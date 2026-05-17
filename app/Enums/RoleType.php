<?php

namespace App\Enums;

enum RoleType: string
{
    case SUPERADMIN = 'SUPERADMIN';
    case GURU = 'GURU';
    case KEPALA_SEKOLAH = 'KEPALA_SEKOLAH';
}