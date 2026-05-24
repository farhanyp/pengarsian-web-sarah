<?php

namespace App\Http\Controllers;

use App\Models\StudentGrade;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $grades = StudentGrade::with(['student', 'subject'])
            ->when($search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('subject', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('nilai-siswa/Index', [
            'grades' => $grades,
            'students' => Student::select('id', 'name', 'nis')->orderBy('name')->get(),
            'subjects' => Subject::select('id', 'name')->orderBy('name')->get(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'assignment_score' => 'nullable|numeric|min:0|max:100',
            'exam_score' => 'nullable|numeric|min:0|max:100',
            'semester' => 'required|string',
            'academic_year' => 'required|string',
        ]);

        $assignment_score = $validated['assignment_score'] ?? 0;
        $exam_score = $validated['exam_score'] ?? 0;
        $validated['final_score'] = ($assignment_score + $exam_score) / 2;
        $validated['created_by'] = Auth::id();

        StudentGrade::create($validated);

        return redirect()->back()->with('success', 'Data nilai siswa berhasil ditambahkan');
    }

    public function update(Request $request, StudentGrade $studentGrade)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'assignment_score' => 'nullable|numeric|min:0|max:100',
            'exam_score' => 'nullable|numeric|min:0|max:100',
            'semester' => 'required|string',
            'academic_year' => 'required|string',
        ]);

        $assignment_score = $validated['assignment_score'] ?? 0;
        $exam_score = $validated['exam_score'] ?? 0;
        $validated['final_score'] = ($assignment_score + $exam_score) / 2;

        $studentGrade->update($validated);

        return redirect()->back()->with('success', 'Data nilai siswa berhasil diperbarui');
    }

    public function destroy(StudentGrade $studentGrade)
    {
        $studentGrade->delete();

        return redirect()->back()->with('success', 'Data nilai siswa berhasil dihapus');
    }
}
