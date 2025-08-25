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
        // database/migrations/xxxx_create_deliveries_table.php
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->integer('distance_km');
            $table->float('fuel_used');
            $table->integer('time_minutes')->nullable(); // for prediction
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};