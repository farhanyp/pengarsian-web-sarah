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
            ['email' => 'guru@scholarsys.edu'],
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
    }
}
