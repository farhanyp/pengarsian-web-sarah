<?php

namespace Database\Seeders;

use App\Models\GradeCategory;
use Illuminate\Database\Seeder;

class GradeCategorySeeder extends Seeder
{
    public function run(): void
    {
        $gradeCategories = [
            ['name' => 'Tugas', 'default_weight' => 20],
            ['name' => 'Kuis', 'default_weight' => 15],
            ['name' => 'Latihan', 'default_weight' => 10],
            ['name' => 'Ulangan Harian', 'default_weight' => 15],
            ['name' => 'Ujian Tengah Semester (UTS)', 'default_weight' => 20],
            ['name' => 'Ujian Akhir Semester (UAS)', 'default_weight' => 20],
        ];

        foreach ($gradeCategories as $category) {
            GradeCategory::firstOrCreate(
                ['name' => $category['name']],
                ['default_weight' => $category['default_weight']]
            );
        }
    }
}
