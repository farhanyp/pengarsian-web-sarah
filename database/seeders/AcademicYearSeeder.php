<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        $academicYears = [
            ['year' => '2023/2024', 'is_active' => false],
            ['year' => '2024/2025', 'is_active' => false],
            ['year' => '2025/2026', 'is_active' => true],
            ['year' => '2026/2027', 'is_active' => false],
        ];

        foreach ($academicYears as $ay) {
            AcademicYear::firstOrCreate(
                ['year' => $ay['year']],
                ['is_active' => $ay['is_active']]
            );
        }
    }
}
