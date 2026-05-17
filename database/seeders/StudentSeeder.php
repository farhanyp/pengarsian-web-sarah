<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        try {
            if (DB::table('students')->count() > 0) {
                DB::commit();
                return;
            }

            $students = [
                [
                    'id' => (string) Str::uuid(),
                    'nis' => '10001',
                    'nisn' => '0012345671',
                    'name' => 'Sarah Wijaya',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'nis' => '10002',
                    'nisn' => '0012345672',
                    'name' => 'Rian Hidayat',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'nis' => '10003',
                    'nisn' => '0012345673',
                    'name' => 'Dewi Lestari',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'nis' => '10004',
                    'nisn' => '0012345674',
                    'name' => 'Bambang Pamungkas',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'nis' => '10005',
                    'nisn' => '0012345675',
                    'name' => 'Citra Kirana',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ];

            DB::table('students')->insert($students);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Seeder failed in StudentSeeder: " . $e->getMessage());
            throw $e;
        }
    }
}
