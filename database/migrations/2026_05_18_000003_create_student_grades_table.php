<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableName = 'student_grades';

        DB::beginTransaction();
        try {
            Schema::create($tableName, function (Blueprint $table) {
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

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Migration up failed for table [{$tableName}]: " . $e->getMessage());
            throw new \RuntimeException("Failed to create the [{$tableName}] table. Error: " . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = 'student_grades';

        DB::beginTransaction();
        try {
            Schema::dropIfExists($tableName);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Migration down failed for table [{$tableName}]: " . $e->getMessage());
            throw new \RuntimeException("Failed to drop the [{$tableName}] table. Error: " . $e->getMessage(), 0, $e);
        }
    }
};
