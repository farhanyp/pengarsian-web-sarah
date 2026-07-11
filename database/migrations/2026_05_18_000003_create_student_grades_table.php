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
        Schema::create('student_grades', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('student_id');
            $table->unsignedBigInteger('subject_id');
            $table->double('score'); // Menyeimbangi tipe float untuk nilai
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

            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            // Indexes specified in the ERD
            $table->index('student_id');
            $table->index('subject_id');
            $table->index(['student_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_grades');
    }
};
