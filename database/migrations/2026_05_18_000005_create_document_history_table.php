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
        $tableName = 'document_history';

        DB::beginTransaction();
        try {
            Schema::create($tableName, function (Blueprint $table) {
                $table->bigIncrements('id'); // bigserial PK
                $table->uuid('document_id');
                $table->string('file_path');
                $table->enum('version_name', ['ARCHIVED', 'FAILED']);
                $table->text('note')->nullable();
                $table->uuid('created_by');
                $table->timestamp('created_at')->useCurrent(); // timestamp field

                // Foreign Key constraints
                $table->foreign('document_id')
                    ->references('id')
                    ->on('documents')
                    ->cascadeOnDelete();

                $table->foreign('created_by')
                    ->references('id')
                    ->on('users')
                    ->cascadeOnDelete();

                // Indexes specified in the ERD
                $table->index('document_id');
                $table->index('version_name');
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
        $tableName = 'document_history';

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
