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
        $filterSemester = $request->input('filter_semester');
        $filterAy = $request->input('filter_ay');
        $filterClass = $request->input('filter_class');
        
        $user = Auth::user();
        $isWaliKelas = $user && $user->hasRole('WALI_KELAS');
        
        $baseQuery = StudentGrade::query()
            ->when($isWaliKelas, function ($query) use ($user) {
                $query->whereHas('student.classes', function ($q) use ($user) {
                    $q->whereIn('classes.id', function($subQuery) use ($user) {
                        $subQuery->select('class_id')
                                 ->from('class_teachers')
                                 ->where('teacher_id', $user->id);
                    });
                });
            })
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->whereHas('student', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                           ->orWhere('nis', 'like', "%{$search}%")
                           ->orWhere('nisn', 'like', "%{$search}%");
                    })->orWhereHas('subject', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%");
                    })->orWhere('title', 'like', "%{$search}%");
                });
            })
            ->when($filterSemester, function($query, $semester) {
                $query->where('semester', $semester);
            })
            ->when($filterAy, function($query, $ay) {
                $query->where('academic_year', $ay);
            })
            ->when($filterClass, function($query, $classId) use ($filterAy) {
                $query->whereHas('student.classes', function($sq) use ($classId, $filterAy) {
                    $sq->where('class_student.class_id', $classId);
                    if ($filterAy) {
                        $sq->where('class_student.academic_year', $filterAy);
                    }
                });
            });

        $paginatedStudentIds = (clone $baseQuery)
            ->select('student_id')
            ->distinct()
            ->paginate(20)
            ->withQueryString();

        $gradesList = (clone $baseQuery)
            ->with(['student', 'subject', 'category'])
            ->whereIn('student_id', $paginatedStudentIds->pluck('student_id'))
            ->latest()
            ->get();

        $grades = new \Illuminate\Pagination\LengthAwarePaginator(
            $gradesList,
            $paginatedStudentIds->total(),
            $paginatedStudentIds->perPage(),
            $paginatedStudentIds->currentPage(),
            [
                'path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(),
                'query' => $request->query(),
            ]
        );

        $availableAcademicYears = AcademicYear::orderByDesc('year')->get()->map(function($ay) {
            return [
                'id' => $ay->year,
                'name' => $ay->year . ($ay->is_active ? ' (Aktif)' : '')
            ];
        });

        $classesQuery = SchoolClass::select('id', 'name')->orderBy('name');
        if ($isWaliKelas) {
            $classesQuery->whereIn('id', function($subQuery) use ($user) {
                $subQuery->select('class_id')
                         ->from('class_teachers')
                         ->where('teacher_id', $user->id);
            });
        }
        $classes = $classesQuery->get();

        return Inertia::render('nilai-siswa/Index', [
            'grades' => $grades,
            'students' => Student::select('id', 'name', 'nis')->orderBy('name')->get(),
            'classes' => $classes,
            'subjects' => Subject::select('id', 'name')->orderBy('name')->get(),
            'gradeCategories' => GradeCategory::select('id', 'name', 'default_weight')->orderBy('id')->get(),
            'availableAcademicYears' => $availableAcademicYears,
            'filters' => $request->only(['search', 'filter_semester', 'filter_ay', 'filter_class'])
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
            'semester' => 'required|string|in:Ganjil,Genap',
            'academic_year' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $importService->import(
                $file->getRealPath(),
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
        ini_set('memory_limit', '-1');
        set_time_limit(300);

        $request->validate([
            'subject_ids' => 'required|string',
            'class_ids' => 'required|string',
            'academic_year' => 'required|string',
        ]);

        $subjectIds = explode(',', $request->input('subject_ids'));
        $classIds = explode(',', $request->input('class_ids'));
        
        $subjects = Subject::whereIn('id', $subjectIds)->get();

        $customOrder = [
            'Agama',
            'PKN',
            'B.INDONESIA',
            'MATEMATIKA',
            'SENBUD & KET',
            'PENJASKES',
            'B.INGGRIS',
            'T.INFOKOM',
            'Tahfiz',
            'Tahsin',
            'Murajaah',
            "Al Qur'an Hadist",
            'Fiqih',
            'Akidah Akhlak',
            'Sejarah Kebudayaan Islam',
        ];

        $subjects = $subjects->sortBy(function ($subject) use ($customOrder) {
            $position = array_search($subject->name, $customOrder);
            return $position === false ? 999 : $position;
        });

        $academicYear = $request->input('academic_year');

        // Fetch students who belong to selected classes
        $students = Student::whereHas('classes', function ($query) use ($classIds) {
            $query->whereIn('class_student.class_id', $classIds);
        })->orderBy('name')->get();

        if ($students->isEmpty()) {
            return redirect()->back()->with('error', 'Tidak ada siswa ditemukan di kelas yang dipilih.');
        }

        // Create spreadsheet
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        
        // Remove the default sheet that PhpSpreadsheet creates
        $spreadsheet->removeSheetByIndex(0);

        // Subheaders
        $headers = [
            'ID Mapel', 'Mata Pelajaran', 'Kategori', 'Nama / Judul', 'Nilai'
        ];
        
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

        $defaultAssessments = [
            ['category' => 'UTS', 'title' => 'UTS Semester'],
            ['category' => 'UAS', 'title' => 'UAS Semester'],
            ['category' => 'GANJIL ', 'title' => 'Semester Ganjil'],
            ['category' => 'GENAP ', 'title' => 'Semester Genap']
        ];

        foreach ($students as $student) {
            $sheet = $spreadsheet->createSheet();
            
            // Sanitize sheet title (max 31 chars, remove invalid chars)
            $sheetTitle = substr(str_replace(['*', ':', '/', '\\', '?', '[', ']'], '', $student->name), 0, 31);
            $sheet->setTitle($sheetTitle);

            // Styles & Header Metadata
            $sheet->setCellValue('A1', 'SISTEM INFORMASI AKADEMIK (SIAKAD) SD HARAPAN');
            $sheet->setCellValue('A2', 'Nama Siswa: ' . $student->name . ' (' . $student->nis . ')');
            $sheet->setCellValue('A3', 'ID Siswa: ' . $student->id);
            $sheet->setCellValue('A4', 'Tahun Ajaran: ' . $academicYear);
            $sheet->setCellValue('A5', 'Petunjuk: Isi nilai pada kolom E (Nilai). Tambah baris baru jika perlu, tapi jangan ubah/hapus ID Siswa dan ID Mapel.');

            // Merge metadata headers
            $sheet->mergeCells('A1:E1');
            $sheet->mergeCells('A5:E5');

            // Styling metadata
            $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
            $sheet->getStyle('A2:A4')->getFont()->setBold(true);
            $sheet->getStyle('A5')->getFont()->setItalic(true)->getColor()->setARGB(\PhpOffice\PhpSpreadsheet\Style\Color::COLOR_RED);

            // Set subheaders
            foreach ($headers as $index => $header) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($index + 1);
                $sheet->setCellValue($colLetter . '6', $header);
            }
            $sheet->getStyle('A6:E6')->applyFromArray($headerStyle);

            // Fill rows per subject
            $row = 7;
            foreach ($subjects as $subject) {
                foreach ($defaultAssessments as $assessment) {
                    $sheet->setCellValue('A' . $row, $subject->id);
                    $sheet->setCellValue('B' . $row, $subject->name);
                    $sheet->setCellValue('C' . $row, $assessment['category']);
                    $sheet->setCellValue('D' . $row, $assessment['title']);
                    $sheet->setCellValue('E' . $row, ''); // Blank for teacher to fill

                    // Apply borders
                    $sheet->getStyle("A{$row}:E{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                    
                    $row++;
                }
            }

            // Set column auto-size
            foreach (range(1, 5) as $colIndex) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
                $sheet->getColumnDimension($colLetter)->setAutoSize(true);
            }
        }

        // If no sheets created (e.g. no students), create a dummy sheet to prevent corrupt Excel
        if ($spreadsheet->getSheetCount() == 0) {
            $spreadsheet->createSheet()->setTitle('No Data');
        }

        $spreadsheet->setActiveSheetIndex(0);

        $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');

        // Save to a temp file and return as download (more reliable than stream)
        $tempFile = tempnam(sys_get_temp_dir(), 'nilai_template_') . '.xlsx';
        $writer->save($tempFile);

        return response()->download(
            $tempFile,
            'template-import-nilai-multi.xlsx',
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control' => 'max-age=0',
            ]
        )->deleteFileAfterSend(true);
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
