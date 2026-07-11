<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop existing student_grades table first to avoid FK constraints issues
        Schema::dropIfExists('student_grades');
        // Drop grade_categories table
        Schema::dropIfExists('grade_categories');

        // Re-create grade_categories with BIGSERIAL ID
        Schema::create('grade_categories', function (Blueprint $table) {
            $table->id(); // BIGSERIAL PRIMARY KEY
            $table->string('name')->comment('Contoh: Tugas, Kuis, Latihan, UTS, UAS');
            $table->float('default_weight')->nullable()->comment('Bobot default, misal Tugas = 0.20 (20%)');
            $table->timestamps();
        });

        // Re-create student_grades with BIGSERIAL ID and float/double score
        Schema::create('student_grades', function (Blueprint $table) {
            $table->id(); // BIGSERIAL PRIMARY KEY
            $table->uuid('student_id');
            $table->unsignedBigInteger('subject_id');
            $table->unsignedBigInteger('grade_category_id');
            $table->string('title')->comment('Nama spesifik, contoh: Tugas Eksponen 1');
            $table->double('score'); // Tipe data float/double untuk nilai
            $table->string('semester'); // Contoh: Ganjil / Genap
            $table->string('academic_year'); // Contoh: 2025/2026
            $table->uuid('created_by'); // Guru/Admin yg menginput
            $table->timestamps();

            // Foreign Key constraints
            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->cascadeOnDelete();

            $table->foreign('subject_id')
                ->references('id')
                ->on('subjects')
                ->cascadeOnDelete();

            $table->foreign('grade_category_id')
                ->references('id')
                ->on('grade_categories')
                ->cascadeOnDelete();

            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->foreign('academic_year')
                ->references('year')
                ->on('academic_years')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Composite index optimized for searching grades per student, per subject, per semester
            $table->index(['student_id', 'subject_id', 'semester'], 'student_grades_query_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_grades');
        Schema::dropIfExists('grade_categories');
    }
};
