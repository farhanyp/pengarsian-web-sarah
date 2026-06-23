<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\User;
use App\Enums\RoleType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassTeacherSeeder extends Seeder
{
    public function run(): void
    {
        // Assigned specifically in RoleAndUserSeeder
        // Kept empty to avoid duplicating or randomizing Wali Kelas assignments
    }
}
