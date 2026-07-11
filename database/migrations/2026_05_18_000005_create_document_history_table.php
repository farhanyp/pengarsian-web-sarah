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
        Schema::create('document_history', function (Blueprint $table) {
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_history');
    }
};
