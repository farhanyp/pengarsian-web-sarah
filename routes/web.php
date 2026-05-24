<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Semua role (ADMIN, GURU, SISWA) bisa akses dashboard
    Route::middleware(['role:ADMIN|GURU|SISWA'])->group(function () {
        Route::inertia('/', 'dashboard')->name('dashboard');
    });

    // Contoh: Hanya ADMIN dan GURU yang bisa akses rute ini
    Route::middleware(['role:ADMIN|GURU'])->group(function () {
        // Route::inertia('/data-siswa', 'data-siswa')->name('data-siswa');
        // Route::inertia('/data-nilai-siswa', 'data-nilai-siswa')->name('data-nilai-siswa');
    });

});

require __DIR__.'/settings.php';
