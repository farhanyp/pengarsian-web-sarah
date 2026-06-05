<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
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
            Subject::firstOrCreate(['name' => $subjectName]);
        }
    }
}
