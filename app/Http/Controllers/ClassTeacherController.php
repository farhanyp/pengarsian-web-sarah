<?php

namespace App\Http\Controllers;

use App\Models\ClassTeacher;
use App\Models\SchoolClass;
use App\Models\User;
use App\Models\AcademicYear;
use App\Enums\RoleType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ClassTeacherController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $classTeachers = ClassTeacher::query()
            ->with(['class', 'teacher'])
            ->when($search, function ($query, $search) {
                $query->whereHas('teacher', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhereHas('class', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('academic_year', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // Eligible teachers are those who have role_type WALI_KELAS or are assigned the WALI_KELAS role
        $teachers = User::where('role_type', RoleType::WALI_KELAS->value)
            ->orWhereHas('roles', function($q) {
                $q->where('name', RoleType::WALI_KELAS->value);
            })
            ->orderBy('name')
            ->get();

        $classes = SchoolClass::orderBy('name')->get();
        $academicYears = AcademicYear::orderBy('year', 'desc')->get();

        return Inertia::render('wali-kelas/Index', [
            'classTeachers' => $classTeachers,
            'teachers' => $teachers,
            'classes' => $classes,
            'academicYears' => $academicYears,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => ['required', 'exists:classes,id'],
            'teacher_id' => ['required', 'exists:users,id'],
            'academic_year' => ['required', 'exists:academic_years,year'],
        ]);

        // Check if teacher is indeed a wali kelas
        $teacher = User::find($validated['teacher_id']);
        if ($teacher->role_type !== RoleType::WALI_KELAS->value && !$teacher->hasRole(RoleType::WALI_KELAS->value)) {
            return redirect()->back()->withErrors([
                'teacher_id' => 'Pengguna terpilih bukan Wali Kelas.',
            ]);
        }

        // Check unique constraint
        $exists = ClassTeacher::where('class_id', $validated['class_id'])
            ->where('teacher_id', $validated['teacher_id'])
            ->where('academic_year', $validated['academic_year'])
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors([
                'class_id' => 'Penugasan wali kelas ini sudah ada untuk tahun akademik yang sama.',
            ]);
        }

        ClassTeacher::create($validated);

        return redirect()->back()->with('success', 'Penugasan wali kelas berhasil ditambahkan');
    }

    public function update(Request $request, ClassTeacher $classTeacher)
    {
        $validated = $request->validate([
            'class_id' => ['required', 'exists:classes,id'],
            'teacher_id' => ['required', 'exists:users,id'],
            'academic_year' => ['required', 'exists:academic_years,year'],
        ]);

        // Check if teacher is indeed a wali kelas
        $teacher = User::find($validated['teacher_id']);
        if ($teacher->role_type !== RoleType::WALI_KELAS->value && !$teacher->hasRole(RoleType::WALI_KELAS->value)) {
            return redirect()->back()->withErrors([
                'teacher_id' => 'Pengguna terpilih bukan Wali Kelas.',
            ]);
        }

        // Check unique constraint excluding current row
        $exists = ClassTeacher::where('class_id', $validated['class_id'])
            ->where('teacher_id', $validated['teacher_id'])
            ->where('academic_year', $validated['academic_year'])
            ->where('id', '!=', $classTeacher->id)
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors([
                'class_id' => 'Penugasan wali kelas ini sudah ada untuk tahun akademik yang sama.',
            ]);
        }

        $classTeacher->update($validated);

        return redirect()->back()->with('success', 'Penugasan wali kelas berhasil diperbarui');
    }

    public function destroy(ClassTeacher $classTeacher)
    {
        $classTeacher->delete();

        return redirect()->back()->with('success', 'Penugasan wali kelas berhasil dihapus');
    }
}
