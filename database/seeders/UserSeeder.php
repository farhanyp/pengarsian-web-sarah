<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        try {
            // Check if users already exist to avoid duplicate email/UUID constraints
            if (User::where('email', 'superadmin@sarah.com')->exists()) {
                DB::commit();
                return;
            }

            // 1. Create Superadmin User
            $superadmin = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Sarah Superadmin',
                'email' => 'superadmin@sarah.com',
                'password' => Hash::make('password'),
            ]);
            $superadmin->assignRole('SUPERADMIN');

            // 2. Create Guru User
            $guru = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Ahmad Guru',
                'email' => 'guru@sarah.com',
                'password' => Hash::make('password'),
            ]);
            $guru->assignRole('GURU');

            // 3. Create Kepala Sekolah User
            $kepalaSekolah = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Budi Kepsek',
                'email' => 'kepsek@sarah.com',
                'password' => Hash::make('password'),
            ]);
            $kepalaSekolah->assignRole('KEPALA_SEKOLAH');

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Seeder failed in UserSeeder: " . $e->getMessage());
            throw $e;
        }
    }
}
