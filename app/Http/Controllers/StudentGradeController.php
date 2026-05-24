<?php

namespace App\Http\Controllers;

use App\Models\StudentGrade;
use App\Models\Student;
use App\Models\Subject;
use App\Models\GradeCategory;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Exports\NilaiSiswaExport;
use App\Services\ExcelGradeImportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $grades = StudentGrade::with(['student', 'subject', 'category'])
            ->when($search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('subject', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('title', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $availableAcademicYears = AcademicYear::orderByDesc('year')->get()->map(function($ay) {
            return [
                'id' => $ay->year,
                'name' => $ay->year . ($ay->is_active ? ' (Aktif)' : '')
            ];
        });

        return Inertia::render('nilai-siswa/Index', [
            'grades' => $grades,
            'students' => Student::select('id', 'name', 'nis')->orderBy('name')->get(),
            'classes' => SchoolClass::select('id', 'name')->orderBy('name')->get(),
            'subjects' => Subject::select('id', 'name')->orderBy('name')->get(),
            'gradeCategories' => GradeCategory::select('id', 'name', 'default_weight')->orderBy('id')->get(),
            'availableAcademicYears' => $availableAcademicYears,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'grade_category_id' => 'required|exists:grade_categories,id',
            'title' => 'required|string|max:255',
            'score' => 'required|numeric|min:0|max:100',
            'semester' => 'required|string',
            'academic_year' => 'required|string',
        ]);

        $validated['created_by'] = Auth::id();

        StudentGrade::create($validated);

        return redirect()->back()->with('success', 'Data nilai siswa berhasil ditambahkan');
    }

    public function update(Request $request, StudentGrade $studentGrade)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'grade_category_id' => 'required|exists:grade_categories,id',
            'title' => 'required|string|max:255',
            'score' => 'required|numeric|min:0|max:100',
            'semester' => 'required|string',
            'academic_year' => 'required|string',
        ]);

        $studentGrade->update($validated);

        return redirect()->back()->with('success', 'Data nilai siswa berhasil diperbarui');
    }

    public function destroy(StudentGrade $studentGrade)
    {
        $studentGrade->delete();

        return redirect()->back()->with('success', 'Data nilai siswa berhasil dihapus');
    }

    public function import(Request $request, ExcelGradeImportService $importService)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'subject_id' => 'required|exists:subjects,id',
            'semester' => 'required|string|in:Ganjil,Genap',
            'academic_year' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $importService->import(
                $file->getRealPath(),
                $request->input('subject_id'),
                $request->input('semester'),
                $request->input('academic_year'),
                Auth::id()
            );

            DB::commit();
            return redirect()->back()->with('success', 'Batch data nilai siswa berhasil diimpor!');
        } catch (\Throwable $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'file' => $e->getMessage()
            ]);
        }
    }

    public function downloadTemplate(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'semester' => 'required|string|in:Ganjil,Genap',
            'academic_year' => 'required|string',
        ]);

        $subjectName = Subject::find($request->input('subject_id'))->name;
        $semester = $request->input('semester');
        $academicYear = $request->input('academic_year');

        // Fetch students who belong to active classes in the selected academic year, or filter by student_ids
        $studentsQuery = Student::query();

        if ($request->filled('student_ids')) {
            $studentIds = explode(',', $request->input('student_ids'));
            $studentsQuery->whereIn('id', $studentIds);
        } else {
            $studentsQuery->whereHas('classes', function ($query) use ($academicYear) {
                $query->where('class_student.academic_year', $academicYear);
            });
        }

        $students = $studentsQuery->orderBy('name')->get();

        if ($students->isEmpty()) {
            $students = Student::orderBy('name')->get();
        }

        // Create spreadsheet
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Nilai');

        // Styles
        $sheet->setCellValue('A1', 'SISTEM INFORMASI AKADEMIK (SIAKAD) SD HARAPAN');
        $sheet->setCellValue('A2', 'Mata Pelajaran: ' . $subjectName);
        $sheet->setCellValue('A3', 'Semester: ' . $semester);
        $sheet->setCellValue('A4', 'Tahun Ajaran: ' . $academicYear);
        $sheet->setCellValue('A5', 'Petunjuk: Isi nilai pada kolom F (Nilai) ke arah bawah. Jangan edit/hapus ID Siswa (Kolom A), NIS (Kolom B), atau Nama (Kolom C).');

        // Merge headers
        $sheet->mergeCells('A1:F1');
        $sheet->mergeCells('A5:F5');

        // Styling title
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A2:A4')->getFont()->setBold(true);
        $sheet->getStyle('A5')->getFont()->setItalic(true)->getColor()->setARGB(\PhpOffice\PhpSpreadsheet\Style\Color::COLOR_RED);

        // Subheaders
        $headers = [
            'ID Siswa', 'NIS', 'Nama Siswa', 
            'Kategori', 'Nama / Judul', 'Nilai'
        ];
        
        foreach ($headers as $index => $header) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index + 1);
            $sheet->setCellValue($colLetter . '6', $header);
        }

        // Style subheaders row 6
        $headerStyle = [
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E2E8F0']
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN
                ]
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER
            ]
        ];
        $sheet->getStyle('A6:F6')->applyFromArray($headerStyle);

        // Fill Student data vertically (3 rows per student for Tasks, UTS, UAS as default guide)
        $row = 7;
        $defaultAssessments = [
            ['category' => 'Tugas', 'title' => 'Tugas 1'],
            ['category' => 'UTS', 'title' => 'UTS Semester'],
            ['category' => 'UAS', 'title' => 'UAS Semester']
        ];

        foreach ($students as $student) {
            foreach ($defaultAssessments as $assessment) {
                $sheet->setCellValue('A' . $row, $student->id);
                $sheet->setCellValue('B' . $row, $student->nis);
                $sheet->setCellValue('C' . $row, $student->name);
                $sheet->setCellValue('D' . $row, $assessment['category']);
                $sheet->setCellValue('E' . $row, $assessment['title']);
                $sheet->setCellValue('F' . $row, ''); // Blank for teacher to fill

                // Apply borders
                $sheet->getStyle("A{$row}:F{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                
                $row++;
            }
        }

        // Set column auto-size
        foreach (range(1, 6) as $colIndex) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        // Clean output buffers to prevent corrupt files
        if (ob_get_length()) ob_end_clean();

        $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');

        return response()->stream(
            function () use ($writer) {
                $writer->save('php://output');
            },
            200,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="template-import-nilai-' . str_replace(' ', '-', strtolower($subjectName)) . '.xlsx"',
                'Cache-Control' => 'max-age=0',
            ]
        );
    }

    public function downloadReport(Request $request)
    {
        $request->validate([
            'academic_year' => 'nullable|string',
            'semester_ids' => 'nullable|array',
            'semester_ids.*' => 'string',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'integer',
            'mapel_ids' => 'nullable|array',
            'mapel_ids.*' => 'integer',
            'siswa_ids' => 'nullable|array',
            'siswa_ids.*' => 'string',
        ]);

        $export = new NilaiSiswaExport(
            $request->input('academic_year'),
            $request->input('semester_ids', []),
            $request->input('class_ids', []),
            $request->input('mapel_ids', []),
            $request->input('siswa_ids', [])
        );

        return $export->download();
    }
}
