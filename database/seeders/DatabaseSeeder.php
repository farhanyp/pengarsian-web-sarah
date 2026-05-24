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
    }
}
