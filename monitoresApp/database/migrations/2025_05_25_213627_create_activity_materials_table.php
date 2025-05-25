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
        Schema::create('activity_materials', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('activity_id')
                ->constrained('activities')
                ->onDelete('cascade');
            $table->foreignId('material_id')
                ->constrained('materials')
                ->onDelete('cascade');
            $table->integer('quantity')->default(1); // Quantity of the material needed for the activity per number of participants
            $table->text('notes')->nullable(); // Additional notes about the material usage
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_materials');
    }
};
