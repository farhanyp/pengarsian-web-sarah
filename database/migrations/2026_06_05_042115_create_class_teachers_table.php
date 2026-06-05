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
        Schema::create('class_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->foreignUuid('teacher_id')->comment('Foreign key ke users.id yang memiliki role WALI_KELAS')->constrained('users')->onDelete('cascade');
            $table->string('academic_year')->comment('Contoh: 2025/2026');
            $table->timestamps();

            $table->foreign('academic_year')->references('year')->on('academic_years')->onDelete('cascade');
            $table->unique(['class_id', 'teacher_id', 'academic_year'], 'class_teacher_year_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_teachers');
    }
};
