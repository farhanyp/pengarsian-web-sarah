<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentGrade extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id',
        'subject_id',
        'grade_category_id',
        'title',
        'assignment_score',
        'exam_score',
        'final_score',
        'semester',
        'academic_year',
        'created_by'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(GradeCategory::class, 'grade_category_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
