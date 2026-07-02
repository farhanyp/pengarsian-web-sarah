<?php

namespace Database\Seeders;

use App\Models\GradeCategory;
use Illuminate\Database\Seeder;

class GradeCategorySeeder extends Seeder
{
    public function run(): void
    {
        $gradeCategories = [
            ['name' => 'UTS'],
            ['name' => 'UAS'],
            ['name' => 'GANJIL'],
            ['name' => 'GENAP'],
        ];

        foreach ($gradeCategories as $category) {
            GradeCategory::firstOrCreate(
                ['name' => $category['name']],
            );
        }
    }
}
