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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id(); // bigserial PK
            $table->string('year')->unique()->comment("Contoh: '2025/2026', '2026/2027'");
            $table->boolean('is_active')->default(false)->comment("Penanda tahun ajaran yang sedang berjalan");
            $table->timestamps();

            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
