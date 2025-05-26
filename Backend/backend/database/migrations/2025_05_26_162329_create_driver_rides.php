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
        Schema::create('driver_rides', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('booking_id');  // define booking_id column first
            $table->unique('booking_id');   
            $table->timestamp('start_ride')->nullable();
            $table->timestamp('end_ride')->nullable();
            $table->enum('payment_type', ['cash', 'upi'])->default('cash');
            $table->boolean('payment_received')->nullable()->default(false);
            $table->boolean('payment_status')->nullable()->default(false);
            $table->timestamps();
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_rides');
    }
};
