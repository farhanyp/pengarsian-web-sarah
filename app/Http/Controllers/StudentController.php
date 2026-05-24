<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\DataSiswaExport;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $students = Student::query()
            ->with('classes')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%")
                      ->orWhere('nisn', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $availableClasses = SchoolClass::orderBy('name')->get(['id', 'name']);
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
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis',
            'nisn' => 'required|string|unique:students,nisn',
            'name' => 'required|string|max:255',
            'class_id' => 'required|exists:classes,id',
            'academic_year' => 'required|exists:academic_years,year',
        ]);

        $student = Student::create([
            'nis' => $validated['nis'],
            'nisn' => $validated['nisn'],
            'name' => $validated['name'],
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
}
