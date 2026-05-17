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
        $tableName = 'documents';

        DB::beginTransaction();
        try {
            Schema::create($tableName, function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('title');
                $table->enum('status', ['ARCHIVED', 'FAILED']);
                $table->enum('recipient_type', ['EXTERNAL']);
                $table->string('current_url');
                $table->uuid('created_by');
                $table->timestamps();

                // Foreign Key constraint
                $table->foreign('created_by')
                    ->references('id')
                    ->on('users')
                    ->cascadeOnDelete();

                // Indexes specified in the ERD
                $table->index('status');
                $table->index('created_at');
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
        $tableName = 'documents';

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
