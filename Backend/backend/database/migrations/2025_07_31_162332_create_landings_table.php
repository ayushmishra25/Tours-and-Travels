<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLandingsTable extends Migration
{
    public function up()
    {
        Schema::create('landings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('mobile_number');
            $table->string('city_location');
            $table->enum('service_type', ['Hourly', 'Weekly', 'Monthly', 'One-Way', 'Event']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('landings');
    }
}
