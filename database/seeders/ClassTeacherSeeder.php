<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\User;
use App\Enums\RoleType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassTeacherSeeder extends Seeder
{
    public function run(): void
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) return;

        $waliKelasUsers = User::where('role_type', RoleType::WALI_KELAS->value)->get();
        $classes = SchoolClass::take(count($waliKelasUsers))->get();

        foreach ($classes as $index => $class) {
            if (isset($waliKelasUsers[$index])) {
                DB::table('class_teachers')->updateOrInsert(
                    [
                        'class_id' => $class->id,
                        'teacher_id' => $waliKelasUsers[$index]->id,
                        'academic_year' => $activeYear->year,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
