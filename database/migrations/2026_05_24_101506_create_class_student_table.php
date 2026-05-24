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
        Schema::create('class_student', function (Blueprint $table) {
            $table->id(); // bigserial PK
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->uuid('student_id');
            $table->string('academic_year')->comment('Contoh: 2025/2026');
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('students')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_student');
    }
};
