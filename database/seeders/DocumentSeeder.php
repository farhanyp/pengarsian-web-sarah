<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        try {
            if (DB::table('documents')->count() > 0) {
                DB::commit();
                return;
            }

            // Find a Guru user to set as creator
            $guru = User::where('email', 'guru@sarah.com')->first();
            if (!$guru) {
                DB::commit();
                return;
            }

            $documents = [
                [
                    'id' => (string) Str::uuid(),
                    'title' => 'Rapor Akademik Semester Ganjil 2025',
                    'status' => 'ARCHIVED',
                    'recipient_type' => 'EXTERNAL',
                    'current_url' => 'https://storage.arsip.id/documents/rapor-ganjil-2025.pdf',
                    'created_by' => $guru->id,
                    'created_at' => now()->subDays(5),
                    'updated_at' => now()->subDays(5),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'title' => 'Surat Keputusan Kelulusan Siswa Angkatan 2025',
                    'status' => 'ARCHIVED',
                    'recipient_type' => 'EXTERNAL',
                    'current_url' => 'https://storage.arsip.id/documents/sk-kelulusan-2025.pdf',
                    'created_by' => $guru->id,
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2),
                ],
                [
                    'id' => (string) Str::uuid(),
                    'title' => 'Laporan Evaluasi Kurikulum Merdeka v1',
                    'status' => 'FAILED',
                    'recipient_type' => 'EXTERNAL',
                    'current_url' => 'https://storage.arsip.id/documents/evaluasi-failed-v1.pdf',
                    'created_by' => $guru->id,
                    'created_at' => now()->subDays(10),
                    'updated_at' => now()->subDays(10),
                ]
            ];

            foreach ($documents as $doc) {
                // 1. Insert Document
                DB::table('documents')->insert($doc);

                // 2. Insert Document History (using document status as the version_name enum)
                DB::table('document_history')->insert([
                    'document_id' => $doc['id'],
                    'file_path' => $doc['current_url'],
                    'version_name' => $doc['status'],
                    'note' => 'Arsip awal terbuat otomatis secara sukses.',
                    'created_by' => $doc['created_by'],
                    'created_at' => $doc['created_at'],
                ]);

                // 3. Insert Outgoing Mail for ARCHIVED documents
                if ($doc['status'] === 'ARCHIVED') {
                    DB::table('outgoing_mail')->insert([
                        'document_id' => $doc['id'],
                        'recipient_name' => 'Wali Murid / Dinas Pendidikan',
                        'sent_at' => $doc['created_at']->addHours(2),
                    ]);
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Seeder failed in DocumentSeeder: " . $e->getMessage());
            throw $e;
        }
    }
}
