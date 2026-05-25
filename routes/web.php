<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\StudentController;

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Semua role (ADMIN, GURU, KEPALA_SEKOLAH) bisa akses dashboard
    Route::middleware(['role:ADMIN|GURU|KEPALA_SEKOLAH|SUPERADMIN'])->group(function () {
        Route::get('/', function () {
            $activeYear = \App\Models\AcademicYear::where('is_active', true)->first();
            $activeYearName = $activeYear ? $activeYear->year : null;
            
            $query = clone \App\Models\Student::whereHas('classes', function($q) use ($activeYearName) {
                if ($activeYearName) {
                    $q->where('class_student.academic_year', $activeYearName);
                }
            });
            
            $totalStudents = $query->count();
            $totalMale = (clone $query)->where('jenis_kelamin', 'PRIA')->count();
            $totalFemale = (clone $query)->where('jenis_kelamin', 'WANITA')->count();

            // Fetch class performances (average grade per class in the active academic year)
            $classPerformances = \Illuminate\Support\Facades\DB::table('classes')
                ->leftJoin('class_student', function($join) use ($activeYearName) {
                    $join->on('classes.id', '=', 'class_student.class_id')
                         ->where('class_student.academic_year', '=', $activeYearName);
                })
                ->leftJoin('student_grades', function($join) use ($activeYearName) {
                    $join->on('class_student.student_id', '=', 'student_grades.student_id')
                         ->where('student_grades.academic_year', '=', $activeYearName);
                })
                ->select('classes.name', \Illuminate\Support\Facades\DB::raw('AVG(student_grades.score) as average_score'))
                ->groupBy('classes.id', 'classes.name')
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'average_score' => round((float) $item->average_score, 2),
                    ];
                });

            // Fetch recent documents
            $recentDocuments = \App\Models\Document::with('creator')->latest()->take(4)->get();

            // Fetch top 3 students per class for the current month in the active academic year
            $topStudentsQuery = "
                WITH StudentScores AS (
                    SELECT 
                        s.id as student_id,
                        s.name as student_name,
                        s.nisn,
                        c.name as class_name,
                        AVG(sg.score) as average_score
                    FROM students s
                    JOIN class_student cs ON s.id = cs.student_id
                    JOIN classes c ON c.id = cs.class_id
                    JOIN student_grades sg ON s.id = sg.student_id
                    WHERE cs.academic_year = ?
                      AND sg.academic_year = ?
                      AND EXTRACT(MONTH FROM sg.created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
                      AND EXTRACT(YEAR FROM sg.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
                    GROUP BY s.id, s.name, s.nisn, c.name
                ),
                RankedScores AS (
                    SELECT 
                        student_id,
                        student_name,
                        nisn,
                        class_name,
                        average_score,
                        ROW_NUMBER() OVER(PARTITION BY class_name ORDER BY average_score DESC) as rnk
                    FROM StudentScores
                )
                SELECT * FROM RankedScores WHERE rnk <= 3 ORDER BY class_name, rnk;
            ";

            $topStudents = $activeYearName ? \Illuminate\Support\Facades\DB::select($topStudentsQuery, [$activeYearName, $activeYearName]) : [];

            return inertia('dashboard', [
                'studentStats' => [
                    'total' => $totalStudents,
                    'pria' => $totalMale,
                    'wanita' => $totalFemale,
                    'academic_year' => $activeYearName
                ],
                'classPerformances' => $classPerformances,
                'recentDocuments' => $recentDocuments,
                'topStudents' => $topStudents
            ]);
        })->name('dashboard');
    });

    // Akses READ (Index) untuk berbagai fitur yang diperbolehkan bagi GURU & KEPALA_SEKOLAH
    Route::middleware(['role:ADMIN|GURU|SUPERADMIN|KEPALA_SEKOLAH'])->group(function () {
        Route::get('/data-siswa', [StudentController::class, 'index'])->name('data-siswa.index');
        Route::get('/data-siswa/download-report', [StudentController::class, 'downloadReport'])->name('data-siswa.download-report');
        Route::get('/data-nilai-siswa', [\App\Http\Controllers\StudentGradeController::class, 'index'])->name('data-nilai-siswa.index');
        Route::get('/data-nilai-siswa/download-report', [\App\Http\Controllers\StudentGradeController::class, 'downloadReport'])->name('data-nilai-siswa.download-report');
    });

    // Akses READ Dokumen (GURU tidak memiliki akses)
    Route::middleware(['role:ADMIN|SUPERADMIN|KEPALA_SEKOLAH'])->group(function () {
        Route::get('/dokumen', [\App\Http\Controllers\DocumentController::class, 'index'])->name('dokumen.index');
    });

    // Hanya ADMIN dan SUPERADMIN yang bisa menambah, mengubah, dan menghapus (Write Access)
    Route::middleware(['role:ADMIN|SUPERADMIN'])->group(function () {
        Route::get('/data-siswa/template', [StudentController::class, 'downloadTemplate'])->name('data-siswa.template');
        Route::post('/data-siswa/import', [StudentController::class, 'importBatch'])->name('data-siswa.import');
        Route::post('/data-siswa', [StudentController::class, 'store'])->name('data-siswa.store');
        Route::put('/data-siswa/{student}', [StudentController::class, 'update'])->name('data-siswa.update');
        Route::delete('/data-siswa/{student}', [StudentController::class, 'destroy'])->name('data-siswa.destroy');

        Route::post('/dokumen', [\App\Http\Controllers\DocumentController::class, 'store'])->name('dokumen.store');
        Route::put('/dokumen/{document}', [\App\Http\Controllers\DocumentController::class, 'update'])->name('dokumen.update');
        Route::delete('/dokumen/{document}', [\App\Http\Controllers\DocumentController::class, 'destroy'])->name('dokumen.destroy');

        // Modul Kelas
        Route::get('/kelas', [\App\Http\Controllers\SchoolClassController::class, 'index'])->name('kelas.index');
        Route::post('/kelas', [\App\Http\Controllers\SchoolClassController::class, 'store'])->name('kelas.store');
        Route::put('/kelas/{schoolClass}', [\App\Http\Controllers\SchoolClassController::class, 'update'])->name('kelas.update');
        Route::delete('/kelas/{schoolClass}', [\App\Http\Controllers\SchoolClassController::class, 'destroy'])->name('kelas.destroy');

        // Modul Tahun Akademik
        Route::get('/tahun-akademik', [\App\Http\Controllers\AcademicYearController::class, 'index'])->name('tahun-akademik.index');
        Route::post('/tahun-akademik', [\App\Http\Controllers\AcademicYearController::class, 'store'])->name('tahun-akademik.store');
        Route::put('/tahun-akademik/{tahun_akademik}', [\App\Http\Controllers\AcademicYearController::class, 'update'])->name('tahun-akademik.update');
        Route::delete('/tahun-akademik/{tahun_akademik}', [\App\Http\Controllers\AcademicYearController::class, 'destroy'])->name('tahun-akademik.destroy');
    });

    // Contoh: ADMIN, GURU, SUPERADMIN (fitur lain selain data-siswa, kelas, tahun akademik)
    Route::middleware(['role:ADMIN|GURU|SUPERADMIN'])->group(function () {

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


    // Hanya SUPERADMIN yang bisa akses rute ini
    Route::middleware(['role:SUPERADMIN'])->group(function () {
        Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
        Route::put('/users/{user}/role', [\App\Http\Controllers\UserController::class, 'updateRole'])->name('users.updateRole');
    });

});

require __DIR__.'/settings.php';
