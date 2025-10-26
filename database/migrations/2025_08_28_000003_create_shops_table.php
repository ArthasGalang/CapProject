<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id('ShopID');
            $table->foreignId('UserID')
                ->constrained('users', 'UserID')
                ->onDelete('cascade');
            $table->string('ShopName');
            $table->string('ShopDescription');
            $table->string('LogoImage');
            $table->string('BackgroundImage');
            $table->unsignedBigInteger('AddressID');
            $table->string('BusinessPermit');
            $table->string('Facebook')->nullable();
            $table->string('Instagram')->nullable();
            $table->string('X')->nullable();
            $table->string('TikTok')->nullable();
            $table->enum('Verification', ['Rejected', 'Pending', 'Verified'])->default('Pending');
            $table->boolean('hasPhysical')->default(false);
            $table->timestamps();
            $table->foreign('AddressID')->references('AddressID')->on('addresses');
        });
        DB::statement("ALTER TABLE shops AUTO_INCREMENT = 20000000;");
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
