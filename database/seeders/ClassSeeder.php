<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            '10 MIPA 1', '10 MIPA 2', '10 IPS 1', '10 IPS 2',
            '11 MIPA 1', '11 MIPA 2', '11 IPS 1', '11 IPS 2',
            '12 MIPA 1', '12 MIPA 2', '12 IPS 1', '12 IPS 2',
        ];

        foreach ($classes as $className) {
            SchoolClass::firstOrCreate(['name' => $className]);
        }
    }
}
