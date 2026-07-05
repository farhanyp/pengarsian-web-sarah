<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $classes = SchoolClass::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('kelas/Index', [
            'classes' => $classes,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:classes,name',
        ]);

        SchoolClass::create($validated);

        return redirect()->back()->with('success', 'Data kelas berhasil ditambahkan');
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:classes,name,' . $schoolClass->id,
        ]);

        $schoolClass->update($validated);

        return redirect()->back()->with('success', 'Data kelas berhasil diperbarui');
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();

        return redirect()->back()->with('success', 'Data kelas berhasil dihapus');
    }
}
