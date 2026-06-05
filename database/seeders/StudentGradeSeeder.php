<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Subject;
use App\Models\GradeCategory;
use App\Models\AcademicYear;
use App\Models\StudentGrade;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentGradeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        $activeYear = AcademicYear::where('is_active', true)->first();
        $students = Student::all();
        $subjects = Subject::take(3)->get(); // Seed grades for 3 subjects
        $categories = GradeCategory::all();
        $teacher = User::where('email', 'guru1@scholarsys.edu')->first();

        if (!$activeYear || $students->isEmpty() || $subjects->isEmpty() || $categories->isEmpty() || !$teacher) return;

        foreach ($students as $student) {
            foreach ($subjects as $subject) {
                // Seed some categories per subject
                foreach (['Tugas', 'Ujian Tengah Semester (UTS)', 'Ujian Akhir Semester (UAS)'] as $catName) {
                    $category = $categories->where('name', $catName)->first();
                    if ($category) {
                        StudentGrade::firstOrCreate(
                            [
                                'student_id' => $student->id,
                                'subject_id' => $subject->id,
                                'grade_category_id' => $category->id,
                                'semester' => 'Ganjil',
                                'academic_year' => $activeYear->year,
                                'title' => $catName . ' 1',
                            ],
                            [
                                'created_by' => $teacher->id,
                                'score' => $faker->numberBetween(70, 100),
                            ]
                        );
                    }
                }
            }
        }
    }
}
