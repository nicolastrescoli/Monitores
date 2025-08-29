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
        Schema::create('activity_schedule', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('activity_id')
                ->constrained('activities')
                ->onDelete('cascade');
            $table->foreignId('schedule_id')
                ->constrained('schedules')
                ->onDelete('cascade');
            $table->dateTime('start_time'); // Start time of the activity
            $table->dateTime('end_time'); // End time of the activity

            // $table->foreignId('schedule_id')->constrained()->onDelete('cascade');
            // $table->foreignId('activity_id')->constrained()->onDelete('cascade');            
            // $table->uuid('instance_uuid')->unique(); // UUID generado en frontend
            // $table->date('day'); // fecha del día
            // $table->time('start_time'); // hora inicio
            // $table->time('end_time');   // hora fin
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_schedule');
    }
};
