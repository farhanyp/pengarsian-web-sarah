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
        // 1. Create Roles
        $superadminRole = Role::firstOrCreate(['name' => RoleType::SUPERADMIN->value, 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => RoleType::ADMIN->value, 'guard_name' => 'web']);
        $guruRole = Role::firstOrCreate(['name' => RoleType::GURU->value, 'guard_name' => 'web']);
        $kepsekRole = Role::firstOrCreate(['name' => RoleType::KEPALA_SEKOLAH->value, 'guard_name' => 'web']);

        // 2. Create Users for each role
        // a. User Superadmin (Developer/Shadow Role)
        $superadminUser = User::firstOrCreate(
            ['email' => 'developer@scholarsys.edu'],
            [
                'name' => 'Superadmin Developer',
                'password' => Hash::make('password'),
            ]
        );
        $superadminUser->assignRole($superadminRole);

        // b. User Admin
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@scholarsys.edu'],
            [
                'name' => 'Admin System',
                'password' => Hash::make('password'),
            ]
        );
        $adminUser->assignRole($adminRole);

        // c. User Guru
        $guruUser = User::firstOrCreate(
            ['email' => 'guru@gmail.com'],
            [
                'name' => 'Guru Pengajar',
                'password' => Hash::make('password'),
            ]
        );
        $guruUser->assignRole($guruRole);

        // d. User Kepala Sekolah
        $kepsekUser = User::firstOrCreate(
            ['email' => 'kepsek@scholarsys.edu'],
            [
                'name' => 'Kepala Sekolah',
                'password' => Hash::make('password'),
            ]
        );
        $kepsekUser->assignRole($kepsekRole);

        // 3. Create Academic Years
        $academicYears = [
            ['year' => '2023/2024', 'is_active' => false],
            ['year' => '2024/2025', 'is_active' => false],
            ['year' => '2025/2026', 'is_active' => true],
            ['year' => '2026/2027', 'is_active' => false],
        ];

        foreach ($academicYears as $ay) {
            \App\Models\AcademicYear::firstOrCreate(
                ['year' => $ay['year']],
                ['is_active' => $ay['is_active']]
            );
        }

        // 4. Create Classes
        $classes = [
            '10 MIPA 1', '10 MIPA 2', '10 IPS 1', '10 IPS 2',
            '11 MIPA 1', '11 MIPA 2', '11 IPS 1', '11 IPS 2',
            '12 MIPA 1', '12 MIPA 2', '12 IPS 1', '12 IPS 2',
        ];

        foreach ($classes as $className) {
            \App\Models\SchoolClass::firstOrCreate(
                ['name' => $className]
            );
        }

        // 5. Create Subjects (Mata Pelajaran)
        $subjects = [
            'Pendidikan Agama Islam',
            'Pendidikan Pancasila dan Kewarganegaraan',
            'Bahasa Indonesia',
            'Matematika Wajib',
            'Sejarah Indonesia',
            'Bahasa Inggris',
            'Seni Budaya',
            'Pendidikan Jasmani, Olahraga, dan Kesehatan',
            'Prakarya dan Kewirausahaan',
            'Matematika Peminatan',
            'Fisika',
            'Biologi',
            'Kimia',
            'Ekonomi',
            'Sosiologi',
            'Geografi',
            'Bahasa Arab'
        ];

        foreach ($subjects as $subjectName) {
            \App\Models\Subject::firstOrCreate(
                ['name' => $subjectName]
            );
        }

        // 6. Create Grade Categories
        $gradeCategories = [
            ['name' => 'Tugas', 'default_weight' => 20],
            ['name' => 'Kuis', 'default_weight' => 15],
            ['name' => 'Latihan', 'default_weight' => 10],
            ['name' => 'Ulangan Harian', 'default_weight' => 15],
            ['name' => 'Ujian Tengah Semester (UTS)', 'default_weight' => 20],
            ['name' => 'Ujian Akhir Semester (UAS)', 'default_weight' => 20],
        ];

        foreach ($gradeCategories as $category) {
            \App\Models\GradeCategory::firstOrCreate(
                ['name' => $category['name']],
                ['default_weight' => $category['default_weight']]
            );
        }

        // 7. Create Students and attach them to class "10 MIPA 1" for active academic year
        $studentsData = [
            ['nis' => '10001', 'nisn' => '0000100001', 'name' => 'Ahmad Fauzi'],
            ['nis' => '10002', 'nisn' => '0000100002', 'name' => 'Budi Santoso'],
            ['nis' => '10003', 'nisn' => '0000100003', 'name' => 'Citra Lestari'],
            ['nis' => '10004', 'nisn' => '0000100004', 'name' => 'Dewi Sartika'],
            ['nis' => '10005', 'nisn' => '0000100005', 'name' => 'Eko Prasetyo'],
            ['nis' => '10006', 'nisn' => '0000100006', 'name' => 'Farhan Yudha'],
            ['nis' => '10007', 'nisn' => '0000100007', 'name' => 'Gita Ayu'],
            ['nis' => '10008', 'nisn' => '0000100008', 'name' => 'Hendra Wijaya'],
            ['nis' => '10009', 'nisn' => '0000100009', 'name' => 'Indah Permata'],
            ['nis' => '10010', 'nisn' => '0000100010', 'name' => 'Joko Susilo'],
        ];

        $activeYear = \App\Models\AcademicYear::where('is_active', true)->first();
        $class = \App\Models\SchoolClass::where('name', '10 MIPA 1')->first() ?? \App\Models\SchoolClass::first();

        if ($activeYear && $class) {
            foreach ($studentsData as $studentData) {
                $student = \App\Models\Student::firstOrCreate(
                    ['nis' => $studentData['nis']],
                    [
                        'id' => \Illuminate\Support\Str::uuid()->toString(),
                        'nisn' => $studentData['nisn'],
                        'name' => $studentData['name'],
                    ]
                );

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
