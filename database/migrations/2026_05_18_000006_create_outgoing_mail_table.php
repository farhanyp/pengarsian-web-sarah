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
        $tableName = 'outgoing_mail'; // Singular table name matching the ERD exactly

        DB::beginTransaction();
        try {
            Schema::create($tableName, function (Blueprint $table) {
                $table->bigIncrements('id'); // bigserial PK
                $table->uuid('document_id');
                $table->string('recipient_name');
                $table->timestamp('sent_at')->useCurrent(); // timestamp field

                // Foreign Key constraint
                $table->foreign('document_id')
                    ->references('id')
                    ->on('documents')
                    ->cascadeOnDelete();

                // Indexes specified in the ERD
                $table->index('document_id');
                $table->index('sent_at');
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
        $tableName = 'outgoing_mail';

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
