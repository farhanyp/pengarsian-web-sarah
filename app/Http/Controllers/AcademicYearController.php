<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $academicYears = AcademicYear::query()
            ->when($search, function ($query, $search) {
                $query->where('year', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('tahun-akademik/Index', [
            'academicYears' => $academicYears,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|string|max:255|unique:academic_years,year',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        AcademicYear::create([
            'year' => $validated['year'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        return redirect()->back()->with('success', 'Data tahun akademik berhasil ditambahkan');
    }

    public function update(Request $request, AcademicYear $tahun_akademik)
    {
        $validated = $request->validate([
            'year' => 'required|string|max:255|unique:academic_years,year,' . $tahun_akademik->id,
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            AcademicYear::where('is_active', true)->where('id', '!=', $tahun_akademik->id)->update(['is_active' => false]);
        }

        $tahun_akademik->update([
            'year' => $validated['year'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        return redirect()->back()->with('success', 'Data tahun akademik berhasil diperbarui');
    }

    public function destroy(AcademicYear $tahun_akademik)
    {
        $tahun_akademik->delete();

        return redirect()->back()->with('success', 'Data tahun akademik berhasil dihapus');
    }
}
