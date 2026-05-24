<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\StudentController;

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Semua role (ADMIN, GURU, SISWA) bisa akses dashboard
    Route::middleware(['role:ADMIN|GURU|SISWA'])->group(function () {
        Route::inertia('/', 'dashboard')->name('dashboard');
    });

    // Contoh: Hanya ADMIN dan GURU yang bisa akses rute ini
    Route::middleware(['role:ADMIN|GURU'])->group(function () {
        Route::get('/data-siswa', [StudentController::class, 'index'])->name('data-siswa.index');
        Route::post('/data-siswa', [StudentController::class, 'store'])->name('data-siswa.store');
        Route::put('/data-siswa/{student}', [StudentController::class, 'update'])->name('data-siswa.update');
        Route::delete('/data-siswa/{student}', [StudentController::class, 'destroy'])->name('data-siswa.destroy');

        Route::get('/kelas', [\App\Http\Controllers\SchoolClassController::class, 'index'])->name('kelas.index');
        Route::post('/kelas', [\App\Http\Controllers\SchoolClassController::class, 'store'])->name('kelas.store');
        Route::put('/kelas/{schoolClass}', [\App\Http\Controllers\SchoolClassController::class, 'update'])->name('kelas.update');
        Route::delete('/kelas/{schoolClass}', [\App\Http\Controllers\SchoolClassController::class, 'destroy'])->name('kelas.destroy');

        Route::get('/tahun-akademik', [\App\Http\Controllers\AcademicYearController::class, 'index'])->name('tahun-akademik.index');
        Route::post('/tahun-akademik', [\App\Http\Controllers\AcademicYearController::class, 'store'])->name('tahun-akademik.store');
        Route::put('/tahun-akademik/{tahun_akademik}', [\App\Http\Controllers\AcademicYearController::class, 'update'])->name('tahun-akademik.update');
        Route::delete('/tahun-akademik/{tahun_akademik}', [\App\Http\Controllers\AcademicYearController::class, 'destroy'])->name('tahun-akademik.destroy');

        Route::get('/data-nilai-siswa', [\App\Http\Controllers\StudentGradeController::class, 'index'])->name('data-nilai-siswa.index');
        Route::get('/data-nilai-siswa/template', [\App\Http\Controllers\StudentGradeController::class, 'downloadTemplate'])->name('data-nilai-siswa.template');
        Route::post('/data-nilai-siswa', [\App\Http\Controllers\StudentGradeController::class, 'store'])->name('data-nilai-siswa.store');
        Route::post('/data-nilai-siswa/import', [\App\Http\Controllers\StudentGradeController::class, 'import'])->name('data-nilai-siswa.import');
        Route::put('/data-nilai-siswa/{studentGrade}', [\App\Http\Controllers\StudentGradeController::class, 'update'])->name('data-nilai-siswa.update');
        Route::delete('/data-nilai-siswa/{studentGrade}', [\App\Http\Controllers\StudentGradeController::class, 'destroy'])->name('data-nilai-siswa.destroy');

        Route::get('/mata-pelajaran', [\App\Http\Controllers\SubjectController::class, 'index'])->name('mata-pelajaran.index');
        Route::post('/mata-pelajaran', [\App\Http\Controllers\SubjectController::class, 'store'])->name('mata-pelajaran.store');
        Route::put('/mata-pelajaran/{subject}', [\App\Http\Controllers\SubjectController::class, 'update'])->name('mata-pelajaran.update');
        Route::delete('/mata-pelajaran/{subject}', [\App\Http\Controllers\SubjectController::class, 'destroy'])->name('mata-pelajaran.destroy');
    });

});

require __DIR__.'/settings.php';
