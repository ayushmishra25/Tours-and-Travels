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
    Schema::create('driver_details_uploads', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('photo')->nullable();
        $table->string('education');
        $table->integer('age');
        $table->string('exact_location');
        $table->string('pincode');
        $table->string('zone');
        $table->integer('driving_experience');
        $table->string('car_driving_experience');
        $table->string('driving_licence_front')->nullable();
        $table->string('driving_licence_back')->nullable();
        $table->string('type_of_driving_licence');
        $table->string('aadhar_card_front')->nullable();
        $table->string('aadhar_card_back')->nullable();
        $table->string('passbook_front')->nullable();
        $table->string('account_number');
        $table->string('bank_name');
        $table->string('ifsc_code');
        $table->string('account_holder_name');
        $table->json('family_contacts');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_details_uploads');
    }
};
