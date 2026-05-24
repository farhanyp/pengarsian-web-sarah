<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GradeCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'default_weight',
    ];

    public function grades(): HasMany
    {
        return $this->hasMany(StudentGrade::class);
    }
}
