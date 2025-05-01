<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportRequestsTable extends Migration
{
    public function up()
    {
        Schema::create('support_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('subject');
            $table->text('message');
            $table->boolean('is_resolved')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('support_requests');
    }
}

