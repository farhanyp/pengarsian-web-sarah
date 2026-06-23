<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            'Pendidikan Agama dan Budi Pekerti',
            'Pendidikan Pancasila',
            'Bahasa Indonesia',
            'Matematika',
            'Seni dan Budaya',
            'Pendidikan Jasmani Olahraga dan Kesehatan',
            'Bahasa Inggris',
            'Teknologi Informasi dan Komunikasi',
            'Tahfidz',
            'Tahsin',
            'Murojaah',
            "Al-Qur'an Hadist",
            'Fiqih',
            'Akidah Akhlak',
            'Sejarah Kebudayaan Islam',
        ];

        foreach ($subjects as $subjectName) {
            Subject::firstOrCreate(['name' => $subjectName]);
        }
    }
}
