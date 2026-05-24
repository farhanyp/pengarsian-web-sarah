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
        Schema::create('grade_categories', function (Blueprint $table) {
            $table->id(); // bigserial PK
            $table->string('name')->comment('Contoh: Tugas, Kuis, Latihan, UTS, UAS');
            $table->float('default_weight')->comment('Bobot default, misal Tugas = 0.20 (20%), UTS = 0.30 (30%)');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_categories');
    }
};
