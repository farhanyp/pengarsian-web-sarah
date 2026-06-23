<?php

namespace Database\Seeders;

use App\Enums\RoleType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RoleAndUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Roles
        $superadminRole = Role::firstOrCreate(['name' => RoleType::SUPERADMIN->value, 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => RoleType::ADMIN->value, 'guard_name' => 'web']);
        $guruRole = Role::firstOrCreate(['name' => RoleType::GURU->value, 'guard_name' => 'web']);
        $kepsekRole = Role::firstOrCreate(['name' => RoleType::KEPALA_SEKOLAH->value, 'guard_name' => 'web']);
        $waliKelasRole = Role::firstOrCreate(['name' => RoleType::WALI_KELAS->value, 'guard_name' => 'web']);

        // 2. Create Users
        $users = [
            [
                'name' => 'Superadmin Developer',
                'email' => 'developer@scholarsys.edu',
                'role' => $superadminRole,
                'role_type' => RoleType::SUPERADMIN->value,
            ],
            [
                'name' => 'Admin System',
                'email' => 'admin@scholarsys.edu',
                'role' => $adminRole,
                'role_type' => null, // Since ADMIN isn't in DB enum
            ],
            [
                'name' => 'Kepala Sekolah',
                'email' => 'kepsek@scholarsys.edu',
                'role' => $kepsekRole,
                'role_type' => RoleType::KEPALA_SEKOLAH->value,
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                    'role_type' => $userData['role_type']
                ]
            );
            $user->assignRole($userData['role']);
        }

        // Create 5 Gurus
        for ($i = 1; $i <= 5; $i++) {
            $guru = User::firstOrCreate(
                ['email' => "guru{$i}@scholarsys.edu"],
                [
                    'name' => "Guru Pengajar {$i}",
                    'password' => Hash::make('password'),
                    'role_type' => RoleType::GURU->value,
                ]
            );
            $guru->assignRole($guruRole);
        }

        // Create Wali Kelas based on requirements
        $waliKelasData = [
            ['name' => 'Khelara Permata Sari,S.Pd', 'classes' => ['Kelas 1 A']],
            ['name' => 'Yuni Bayu Ningsih,S.Pd', 'classes' => ['Kelas 1 B']],
            ['name' => 'Siti Afni,S.Pd', 'classes' => ['Kelas 2 A']],
            ['name' => 'Jumiran,S.Ag', 'classes' => ['Kelas 2 B']],
            ['name' => 'Hermayani Purba,S.Pd', 'classes' => ['Kelas 2 C']],
            ['name' => 'Riska Nurhamidah,S.Pd.,Gr.', 'classes' => ['Kelas 3 A']],
            ['name' => 'Indah Sri Annisa,S.Pd.,Gr.', 'classes' => ['Kelas 3 B']],
            ['name' => 'Rahmat May Sandi,S.PdI', 'classes' => ['Kelas 4 A']],
            ['name' => 'Drs. H. Salman', 'classes' => ['Kelas 4 A']],
            ['name' => 'Hervita Puji Pratiwi,S.Pd.,Gr.', 'classes' => ['Kelas 5 A', 'Kelas 5 B']],
        ];

        $activeYear = \App\Models\AcademicYear::firstOrCreate(['year' => '2025/2026', 'is_active' => true])->year;

        foreach ($waliKelasData as $data) {
            $emailName = str_replace(' ', '', strtolower(explode(',', str_replace('.', '', $data['name']))[0]));
            $email = $emailName . '@scholarsys.edu';
            
            $wali = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role_type' => RoleType::WALI_KELAS->value,
                ]
            );
            $wali->assignRole($waliKelasRole);

            foreach ($data['classes'] as $className) {
                $schoolClass = \App\Models\SchoolClass::firstOrCreate(['name' => $className]);
                \App\Models\ClassTeacher::firstOrCreate([
                    'class_id' => $schoolClass->id,
                    'teacher_id' => $wali->id,
                    'academic_year' => $activeYear,
                ]);
            }
        }
    }
}
