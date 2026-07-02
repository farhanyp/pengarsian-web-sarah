<?php

namespace Database\Seeders;

use App\Enums\RoleType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AcademicYearSeeder::class,
            ClassSeeder::class,
            SubjectSeeder::class,
            GradeCategorySeeder::class,
            RoleAndUserSeeder::class,
            ClassTeacherSeeder::class,
            // StudentSeeder::class,
            // StudentGradeSeeder::class,
        ]);
    }
}
