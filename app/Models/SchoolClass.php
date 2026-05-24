<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SchoolClass extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'class_student', 'class_id', 'student_id')
                    ->withPivot('academic_year')
                    ->withTimestamps();
    }
}
