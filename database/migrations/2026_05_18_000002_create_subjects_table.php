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
        $tableName = 'subjects';

        DB::beginTransaction();
        try {
            Schema::create($tableName, function (Blueprint $table) {
                $table->bigIncrements('id'); // bigserial PK
                $table->string('name');       // Contoh: Matematika, Bahasa Indonesia
                $table->timestamps();

                // Indexes specified in the ERD
                $table->index('name');
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
        $tableName = 'subjects';

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
