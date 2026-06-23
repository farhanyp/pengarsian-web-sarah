<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            'Kelas 1 A',
            'Kelas 1 B',
            'Kelas 2 A',
            'Kelas 2 B',
            'Kelas 2 C',
            'Kelas 3 A',
            'Kelas 3 B',
            'Kelas 4 A',
            'Kelas 4 B',
            'Kelas 5 A',
            'Kelas 5 B',
            'Kelas 6',
        ];

        foreach ($classes as $className) {
            SchoolClass::firstOrCreate(['name' => $className]);
        }
    }
}
