<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        $academicYears = [
            ['year' => '2025/2026', 'is_active' => true]
        ];

        foreach ($academicYears as $ay) {
            AcademicYear::firstOrCreate(
                ['year' => $ay['year']],
                ['is_active' => $ay['is_active']]
            );
        }
    }
}
