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
        Schema::create('risks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();  
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->integer('severity')->default(1); // 1 to 5 scale
            $table->text('prevention')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risks');
    }
};
