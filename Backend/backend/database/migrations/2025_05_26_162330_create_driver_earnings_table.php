<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDriverEarningsTable extends Migration
{
    public function up()
    {
        Schema::create('driver_earnings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('booking_id');
            $table->string('payment_type')->nullable();
            $table->decimal('driver_earning', 10, 2);
            $table->decimal('company_share', 10, 2);
            $table->decimal('comapny_earning', 10, 2);
            $table->decimal('driver_share', 10, 2);
            $table->boolean('driver_paid')->default(false);
            $table->timestamp('driver_paid_at')->nullable();
            $table->boolean('admin_approved')->default(false);
            $table->timestamp('admin_approved_at')->nullable();
            $table->boolean('driver_settled')->default(false);
            $table->timestamp('driver_settled_at')->nullable();
            $table->boolean('company_settled')->default(false);
            $table->timestamp('company_settled_at')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('driver_earnings');
    }
}
