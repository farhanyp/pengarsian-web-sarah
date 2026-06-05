<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        $activeYear = AcademicYear::where('is_active', true)->first();
        $classes = SchoolClass::all();

        if (!$activeYear || $classes->isEmpty()) return;

        $nisCounter = 10001;

        foreach ($classes as $class) {
            // Seed 15 students per class
            for ($i = 0; $i < 15; $i++) {
                $gender = $faker->randomElement(['PRIA', 'WANITA']);
                $firstName = $gender === 'PRIA' ? $faker->firstNameMale() : $faker->firstNameFemale();
                
                $student = Student::firstOrCreate(
                    ['nis' => (string) $nisCounter],
                    [
                        'id' => Str::uuid()->toString(),
                        'nisn' => '00' . $faker->unique()->numerify('########'),
                        'name' => $firstName . ' ' . $faker->lastName(),
                        'jenis_kelamin' => $gender,
                    ]
                );
                
                $nisCounter++;

                $isAttached = $student->classes()
                    ->where('class_id', $class->id)
                    ->wherePivot('academic_year', $activeYear->year)
                    ->exists();

                if (!$isAttached) {
                    $student->classes()->attach($class->id, [
                        'academic_year' => $activeYear->year
                    ]);
                }
            }
        }
    }
}
