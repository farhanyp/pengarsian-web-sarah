<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class StudentGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        try {
            if (DB::table('student_grades')->count() > 0) {
                DB::commit();
                return;
            }

            // Find a Guru user to set as creator
            $guru = User::where('email', 'guru@sarah.com')->first();
            if (!$guru) {
                DB::commit();
                return;
            }

            $students = DB::table('students')->get();
            $subjects = DB::table('subjects')->get();

            $grades = [];
            $semesters = ['Ganjil', 'Genap'];
            $academicYears = ['2024/2025', '2025/2026'];

            foreach ($students as $student) {
                foreach ($subjects as $subject) {
                    // Generate realistic scores between 72.5 and 96.0
                    $score = round(72.5 + (mt_rand() / mt_getrandmax()) * (96.0 - 72.5), 1);

                    $grades[] = [
                        'id' => (string) Str::uuid(),
                        'student_id' => $student->id,
                        'subject_id' => $subject->id,
                        'score' => $score,
                        'semester' => $semesters[array_rand($semesters)],
                        'academic_year' => $academicYears[array_rand($academicYears)],
                        'created_by' => $guru->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            DB::table('student_grades')->insert($grades);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Seeder failed in StudentGradeSeeder: " . $e->getMessage());
            throw $e;
        }
    }
}
