<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('booking_type', ['hourly', 'weekly', 'monthly', 'on_demand']);
            $table->string('source_location');
            $table->string('destination_location')->nullable();
            $table->integer('hours')->nullable(); // For hourly
            $table->json('working_days')->nullable(); 
            $table->integer('working_hours_per_day')->nullable(); 
            $table->date('start_date')->nullable(); 
            $table->dateTime('booking_datetime')->nullable(); 
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
