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

        // Create 5 Wali Kelas
        for ($i = 1; $i <= 5; $i++) {
            $wali = User::firstOrCreate(
                ['email' => "walikelas{$i}@scholarsys.edu"],
                [
                    'name' => "Wali Kelas {$i}",
                    'password' => Hash::make('password'),
                    'role_type' => RoleType::WALI_KELAS->value,
                ]
            );
            $wali->assignRole($waliKelasRole);
        }
    }
}
