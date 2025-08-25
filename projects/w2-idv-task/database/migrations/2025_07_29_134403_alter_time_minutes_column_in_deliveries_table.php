<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTimeMinutesColumnInDeliveriesTable extends Migration
{
    public function up()
    {
        Schema::table('deliveries', function (Blueprint $table) {
            // Change the column type from integer to float
            $table->float('time_minutes')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('deliveries', function (Blueprint $table) {
            // Revert back to integer if rolled back
            $table->integer('time_minutes')->nullable()->change();
        });
    }
}