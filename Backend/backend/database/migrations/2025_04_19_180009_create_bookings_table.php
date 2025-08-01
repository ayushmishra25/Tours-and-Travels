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
            $table->enum('booking_type', ['Hourly', 'Weekly', 'Monthly', 'On demand']);
            $table->string('trip_type');
            $table->string('source_location');
            $table->string('source_pincode', 6);
            $table->string('zone')->nullable();
            $table->string('destination_location')->nullable();
            $table->string('vehicle_details')->nullable();
            $table->integer('hours')->nullable(); // For hourly
            $table->integer('working_days')->nullable(); 
            $table->integer('working_hours_per_day')->nullable(); 
            $table->integer('payment'); 
            $table->date('start_date')->nullable(); 
            $table->dateTime('booking_datetime')->nullable();
            $table->boolean('night_charge_applied')->nullable();
            $table->string('driver_name')->nullable();
            $table->string('driver_contact')->nullable();
            $table->string('driver_location')->nullable(); 
            $table->timestamps();
            $table->softDeletes(); 
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
