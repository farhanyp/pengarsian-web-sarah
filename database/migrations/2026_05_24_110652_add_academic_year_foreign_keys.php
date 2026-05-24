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
        Schema::table('class_student', function (Blueprint $table) {
            $table->foreign('academic_year')
                  ->references('year')
                  ->on('academic_years')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
        });

        Schema::table('student_grades', function (Blueprint $table) {
            $table->foreign('academic_year')
                  ->references('year')
                  ->on('academic_years')
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_grades', function (Blueprint $table) {
            $table->dropForeign(['academic_year']);
        });

        Schema::table('class_student', function (Blueprint $table) {
            $table->dropForeign(['academic_year']);
        });
    }
};
