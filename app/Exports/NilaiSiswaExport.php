<?php

namespace App\Exports;

use App\Models\Student;
use App\Models\StudentGrade;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Facades\Response;

class NilaiSiswaExport
{
    protected $academicYear;
    protected $semesterIds;
    protected $classIds;
    protected $mapelIds;
    protected $siswaIds;

    protected $columns = [];

    public function __construct($academicYear, $semesterIds, $classIds, $mapelIds, $siswaIds)
    {
        $this->academicYear = $academicYear;
        $this->semesterIds = $semesterIds;
        $this->classIds = $classIds;
        $this->mapelIds = $mapelIds;
        $this->siswaIds = $siswaIds;
    }

    public function download()
    {
        $this->prepareColumns();
        $students = $this->getStudents();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Nilai Siswa');

        // Headings
        $headings = [
            'A1' => 'NIS',
            'B1' => 'Nama Siswa',
            'C1' => 'Kelas',
        ];

        $colIndex = 4; // Start at D
        foreach ($this->columns as $col) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $headings[$colLetter . '1'] = $col['header'];
            $colIndex++;
        }

        foreach ($headings as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Data
        $row = 2;
        foreach ($students as $student) {
            $className = $student->classes->pluck('name')->join(', ');

            $sheet->setCellValue('A' . $row, $student->nis);
            $sheet->setCellValue('B' . $row, $student->name);
            $sheet->setCellValue('C' . $row, $className);

            $gradeMap = [];
            foreach ($student->grades as $grade) {
                $key = "{$grade->subject_id}_{$grade->grade_category_id}_{$grade->title}";
                $gradeMap[$key] = $grade->score;
            }

            $cIdx = 4;
            foreach ($this->columns as $key => $col) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($cIdx);
                $sheet->setCellValue($colLetter . $row, $gradeMap[$key] ?? '-');
                $cIdx++;
            }
            $row++;
        }

        // Styling
        $highestRow = $row - 1;
        $highestColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex - 1);
        
        $range = "A1:{$highestColumn}" . ($highestRow < 1 ? 1 : $highestRow);

        $sheet->getStyle($range)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => '000000'],
                ],
            ],
        ]);

        $headerRange = "A1:{$highestColumn}1";
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFE2E8F0'],
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(40);

        if ($highestRow > 1) {
            $sheet->getStyle("A2:A{$highestRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            if ($highestColumn !== 'C') {
                $sheet->getStyle("D2:{$highestColumn}{$highestRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            }
        }

        foreach (range(1, $colIndex - 1) as $c) {
            $colL = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($c);
            $sheet->getColumnDimension($colL)->setAutoSize(true);
        }

        if (ob_get_length()) ob_end_clean();

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');

        return response()->stream(
            function () use ($writer) {
                $writer->save('php://output');
            },
            200,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="laporan-nilai-siswa.xlsx"',
                'Cache-Control' => 'max-age=0',
            ]
        );
    }

    protected function prepareColumns()
    {
        $query = StudentGrade::with(['subject', 'category'])
            ->select('subject_id', 'grade_category_id', 'title')
            ->distinct();

        if ($this->academicYear) {
            $query->where('academic_year', $this->academicYear);
        }
        if (!empty($this->semesterIds)) {
            $query->whereIn('semester', $this->semesterIds);
        }
        if (!empty($this->mapelIds)) {
            $query->whereIn('subject_id', $this->mapelIds);
        }
        if (!empty($this->siswaIds)) {
            $query->whereIn('student_id', $this->siswaIds);
        } else if (!empty($this->classIds)) {
            $query->whereHas('student.classes', function($q) {
                $q->whereIn('classes.id', $this->classIds);
                if ($this->academicYear) {
                    $q->where('class_student.academic_year', $this->academicYear);
                }
            });
        }

        $assessments = $query->get()->sortBy(function($grade) {
            return ($grade->subject->name ?? '') . ' - ' . ($grade->category->name ?? '') . ' - ' . $grade->title;
        });

        foreach ($assessments as $assessment) {
            $subjectName = $assessment->subject->name ?? 'Unknown';
            $categoryName = $assessment->category->name ?? 'Unknown';
            $title = $assessment->title;

            $key = "{$assessment->subject_id}_{$assessment->grade_category_id}_{$title}";
            $this->columns[$key] = [
                'subject_id' => $assessment->subject_id,
                'category_id' => $assessment->grade_category_id,
                'title' => $title,
                'header' => "{$subjectName}\n{$categoryName} - {$title}"
            ];
        }
    }

    protected function getStudents()
    {
        $query = Student::with(['classes' => function($q) {
            if ($this->academicYear) {
                $q->where('class_student.academic_year', $this->academicYear);
            }
        }, 'grades' => function($q) {
            if ($this->academicYear) {
                $q->where('academic_year', $this->academicYear);
            }
            if (!empty($this->semesterIds)) {
                $q->whereIn('semester', $this->semesterIds);
            }
            if (!empty($this->mapelIds)) {
                $q->whereIn('subject_id', $this->mapelIds);
            }
        }]);

        if (!empty($this->siswaIds)) {
            $query->whereIn('id', $this->siswaIds);
        } else if (!empty($this->classIds)) {
            $query->whereHas('classes', function($q) {
                $q->whereIn('classes.id', $this->classIds);
                if ($this->academicYear) {
                    $q->where('class_student.academic_year', $this->academicYear);
                }
            });
        }

        return $query->orderBy('name')->get();
    }
}
