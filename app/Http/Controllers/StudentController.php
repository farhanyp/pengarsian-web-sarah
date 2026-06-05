<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\DataSiswaExport;
use Illuminate\Support\Facades\DB;
use App\Services\ExcelStudentImportService;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $filterAy = $request->input('filter_ay');
        $filterClass = $request->input('filter_class');
        $sortName = $request->input('sort_name');
        
        $user = \Illuminate\Support\Facades\Auth::user();
        $isWaliKelas = $user && $user->hasRole('WALI_KELAS');
        
        $students = Student::query()
            ->with('classes')
            ->when($isWaliKelas, function ($query) use ($user) {
                $query->whereHas('classes', function ($q) use ($user) {
                    $q->whereIn('classes.id', function($subQuery) use ($user) {
                        $subQuery->select('class_id')
                                 ->from('class_teachers')
                                 ->where('teacher_id', $user->id);
                    });
                });
            })
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%")
                      ->orWhere('nisn', 'like', "%{$search}%");
                });
            })
            ->when($filterAy || $filterClass, function ($query) use ($filterAy, $filterClass) {
                $query->whereHas('classes', function ($q) use ($filterAy, $filterClass) {
                    if ($filterAy) {
                        $q->where('class_student.academic_year', $filterAy);
                    }
                    if ($filterClass) {
                        $q->where('class_student.class_id', $filterClass);
                    }
                });
            })
            ->when($sortName, function($query, $sortName) {
                $query->orderBy('name', $sortName);
            })
            ->when(!$sortName, function($query) {
                $query->latest();
            })
            ->paginate(20)
            ->withQueryString();

        $availableClassesQuery = SchoolClass::orderBy('name');
        if ($isWaliKelas) {
            $availableClassesQuery->whereIn('id', function($subQuery) use ($user) {
                $subQuery->select('class_id')
                         ->from('class_teachers')
                         ->where('teacher_id', $user->id);
            });
        }
        $availableClasses = $availableClassesQuery->get(['id', 'name']);
        $availableAcademicYears = AcademicYear::orderByDesc('year')->get()->map(function($ay) {
            return [
                'id' => $ay->year,
                'name' => $ay->year . ($ay->is_active ? ' (Aktif)' : '')
            ];
        });

        return Inertia::render('data-siswa/Index', [
            'students' => $students,
            'availableClasses' => $availableClasses,
            'availableAcademicYears' => $availableAcademicYears,
            'filters' => $request->only(['search', 'filter_ay', 'filter_class', 'sort_name'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis',
            'nisn' => 'required|string|unique:students,nisn',
            'name' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:PRIA,WANITA',
            'class_id' => 'required|exists:classes,id',
            'academic_year' => 'required|exists:academic_years,year',
        ]);

        $student = Student::create([
            'nis' => $validated['nis'],
            'nisn' => $validated['nisn'],
            'name' => $validated['name'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
        ]);

        $student->classes()->attach($validated['class_id'], [
            'academic_year' => $validated['academic_year']
        ]);

        return redirect()->back()->with('success', 'Data siswa berhasil ditambahkan');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis,' . $student->id,
            'nisn' => 'required|string|unique:students,nisn,' . $student->id,
            'name' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:PRIA,WANITA',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Data siswa berhasil diperbarui');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->back()->with('success', 'Data siswa berhasil dihapus');
    }

    public function downloadReport(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_id' => 'required|exists:academic_years,year',
            'kelas_ids' => 'required|array|min:1',
            'kelas_ids.*' => 'required|exists:classes,id',
        ]);

        $export = new DataSiswaExport($validated['tahun_ajaran_id'], $validated['kelas_ids']);
        return $export->download('Laporan_Data_Siswa.xlsx');
    }

    public function downloadTemplate()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'TEMPLATE IMPORT BATCH DATA SISWA');
        $sheet->mergeCells('A1:F1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        
        $sheet->setCellValue('A2', 'Catatan:');
        $sheet->setCellValue('A3', '- Baris 6 adalah Header Tabel. Jangan diubah.');
        $sheet->setCellValue('A4', '- Kolom Jenis Kelamin dan Nama Kelas menggunakan Dropdown.');
        
        $headers = ['NIS', 'NISN', 'Nama Lengkap', 'Jenis Kelamin', 'Nama Kelas', 'Tahun Ajaran'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '6', $header);
            $sheet->getStyle($col . '6')->getFont()->setBold(true);
            $sheet->getColumnDimension($col)->setAutoSize(true);
            $col++;
        }

        $validationGender = $sheet->getCell('D7')->getDataValidation();
        $validationGender->setType(DataValidation::TYPE_LIST);
        $validationGender->setErrorStyle(DataValidation::STYLE_STOP);
        $validationGender->setAllowBlank(true);
        $validationGender->setShowInputMessage(true);
        $validationGender->setShowErrorMessage(true);
        $validationGender->setShowDropDown(true);
        $validationGender->setErrorTitle('Input Error');
        $validationGender->setError('Nilai tidak valid');
        $validationGender->setPromptTitle('Pilih Jenis Kelamin');
        $validationGender->setFormula1('"PRIA,WANITA"');
        $sheet->setDataValidation('D7:D100', $validationGender);

        $classes = SchoolClass::orderBy('name')->pluck('name')->toArray();
        if (count($classes) > 0) {
            $classList = '"' . implode(',', $classes) . '"';
            $validationClass = $sheet->getCell('E7')->getDataValidation();
            $validationClass->setType(DataValidation::TYPE_LIST);
            $validationClass->setErrorStyle(DataValidation::STYLE_STOP);
            $validationClass->setAllowBlank(true);
            $validationClass->setShowInputMessage(true);
            $validationClass->setShowErrorMessage(true);
            $validationClass->setShowDropDown(true);
            $validationClass->setErrorTitle('Input Error');
            $validationClass->setError('Kelas tidak valid');
            $validationClass->setPromptTitle('Pilih Kelas');
            $validationClass->setFormula1($classList);
            $sheet->setDataValidation('E7:E100', $validationClass);
        }

        $academicYears = AcademicYear::orderByDesc('year')->pluck('year')->toArray();
        if (count($academicYears) > 0) {
            $ayList = '"' . implode(',', $academicYears) . '"';
            $validationAy = $sheet->getCell('F7')->getDataValidation();
            $validationAy->setType(DataValidation::TYPE_LIST);
            $validationAy->setErrorStyle(DataValidation::STYLE_STOP);
            $validationAy->setAllowBlank(true);
            $validationAy->setShowInputMessage(true);
            $validationAy->setShowErrorMessage(true);
            $validationAy->setShowDropDown(true);
            $validationAy->setErrorTitle('Input Error');
            $validationAy->setError('Tahun ajaran tidak valid');
            $validationAy->setPromptTitle('Pilih Tahun Ajaran');
            $validationAy->setFormula1($ayList);
            $sheet->setDataValidation('F7:F100', $validationAy);
        }

        $writer = new Xlsx($spreadsheet);
        
        $fileName = 'Template_Import_Siswa.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($tempFile);
        
        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }

    public function importBatch(Request $request, ExcelStudentImportService $importService)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:5120',
        ]);

        DB::beginTransaction();
        try {
            $importService->import($request->file('file')->path());
            DB::commit();
            return redirect()->back()->with('success', 'Data batch siswa berhasil diimport.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['file' => $e->getMessage()]);
        }
    }
}
