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
        Schema::create('documents', function (Blueprint $table) {
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
