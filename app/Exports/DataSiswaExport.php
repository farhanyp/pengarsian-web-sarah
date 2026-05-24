<?php

namespace App\Exports;

use App\Models\Student;
use Illuminate\Database\Eloquent\Builder;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DataSiswaExport
{
    protected $tahunAjaranId;
    protected $kelasIds;

    public function __construct($tahunAjaranId, array $kelasIds)
    {
        $this->tahunAjaranId = $tahunAjaranId;
        $this->kelasIds = $kelasIds;
    }

    public function download($filename)
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set Headings
        $headings = [
            'No',
            'NISN',
            'NIS',
            'Nama Siswa',
            'Kelas',
            'Tahun Ajaran'
        ];
        
        $sheet->fromArray($headings, null, 'A1');

        // Get Data
        $students = Student::query()
            ->with(['classes' => function ($query) {
                $query->where('academic_year', $this->tahunAjaranId);
            }])
            ->whereHas('classes', function (Builder $query) {
                $query->where('academic_year', $this->tahunAjaranId)
                      ->whereIn('class_id', $this->kelasIds);
            })
            ->orderBy('name')
            ->get();

        $rowNumber = 2;
        $count = 1;
        foreach ($students as $student) {
            $className = '';
            $academicYear = '';

            if ($student->classes->isNotEmpty()) {
                $class = $student->classes->first();
                $className = $class->name;
                $academicYear = $class->pivot->academic_year;
            }

            $sheet->setCellValue('A' . $rowNumber, $count++);
            $sheet->setCellValueExplicit('B' . $rowNumber, $student->nisn, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
            $sheet->setCellValueExplicit('C' . $rowNumber, $student->nis, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
            $sheet->setCellValue('D' . $rowNumber, $student->name);
            $sheet->setCellValue('E' . $rowNumber, $className);
            $sheet->setCellValue('F' . $rowNumber, $academicYear);
            
            $rowNumber++;
        }

        // Apply Styles
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        // Header style
        $sheet->getStyle('A1:F1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 12,
                'color' => ['argb' => 'FFFFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'FF4F46E5', // Indigo 600
                ],
            ],
        ]);

        // Borders
        if ($highestRow > 1) {
            $sheet->getStyle('A1:' . $highestColumn . $highestRow)->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                    ],
                ],
            ]);
        }

        // Auto size columns
        foreach (range('A', $highestColumn) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);

        return new StreamedResponse(
            function () use ($writer) {
                $writer->save('php://output');
            },
            200,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'Cache-Control' => 'max-age=0',
            ]
        );
    }
}
