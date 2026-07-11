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
        Schema::create('outgoing_mail', function (Blueprint $table) {
            $table->bigIncrements('id'); // bigserial PK
            $table->uuid('document_id');
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outgoing_mail');
    }
};
