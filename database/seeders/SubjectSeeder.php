<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            'Agama',
            'PKn',
            'B.INDONESIA',
            'MATEMATIKA',
            'SENBUD & KET',
            'PENJASKES',
            'B.INGGRIS',
            'T.INFOKOM',
            'Tahfiz',
            'Tahsin',
            'Murajaah',
            "Al Qur'an Hadist",
            'Fiqih',
            'Akidah Akhlak',
            'Sejarah Kebudayaan Islam',
        ];

        foreach ($subjects as $subjectName) {
            Subject::firstOrCreate(['name' => $subjectName]);
        }
    }
}
