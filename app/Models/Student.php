<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nis',
        'nisn',
        'name'
    ];

    public function grades(): HasMany
    {
        return $this->hasMany(StudentGrade::class);
    }

    public function classes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class, 'class_student', 'student_id', 'class_id')
                    ->withPivot('academic_year')
                    ->withTimestamps();
    }
}
