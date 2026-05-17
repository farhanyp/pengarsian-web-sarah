<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        try {
            if (DB::table('subjects')->count() > 0) {
                DB::commit();
                return;
            }

            $subjects = [
                ['name' => 'Matematika', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Bahasa Indonesia', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'IPA', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'IPS', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Bahasa Inggris', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'PJOK', 'created_at' => now(), 'updated_at' => now()],
            ];

            DB::table('subjects')->insert($subjects);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Seeder failed in SubjectSeeder: " . $e->getMessage());
            throw $e;
        }
    }
}
