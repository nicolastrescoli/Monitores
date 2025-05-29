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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->integer('num_participants')->nullable();
            $table->integer('min_age')->nullable();            
            $table->integer('max_age')->nullable();
            $table->integer('duration')->nullable(); // Duration in minutes
            $table->text('objectives')->nullable();
            $table->text('introduction')->nullable();
            $table->text('description')->nullable();
            $table->text('conclusion')->nullable();
            $table->boolean('is_public')->default(false);
            $table->foreignId('type_id')->nullable()->constrained('types')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('original_activity_id')->nullable()->constrained('activities')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
