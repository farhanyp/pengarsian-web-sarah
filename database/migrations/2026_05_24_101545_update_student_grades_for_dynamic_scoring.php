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
        Schema::table('student_grades', function (Blueprint $table) {
            $table->unsignedBigInteger('grade_category_id')->nullable()->after('subject_id');
            $table->string('title')->nullable()->comment('Nama spesifik raw data, contoh: Tugas Eksponen')->after('grade_category_id');

            $table->foreign('grade_category_id')->references('id')->on('grade_categories')->cascadeOnDelete();

            $table->index(['student_id', 'subject_id', 'semester', 'academic_year'], 'student_grades_composite_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_grades', function (Blueprint $table) {
            $table->dropForeign(['grade_category_id']);
            $table->dropIndex('student_grades_composite_idx');
            
            $table->dropColumn(['grade_category_id', 'title']);
        });
    }
};
