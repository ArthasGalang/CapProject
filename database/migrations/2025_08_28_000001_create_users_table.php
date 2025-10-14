<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('UserID'); // 👈 Custom primary key
            $table->string('FirstName');
            $table->string('LastName');
            $table->string('Email')->unique();
            $table->string('Password');
            $table->string('ContactNumber');
            $table->string('ProfileImage')->nullable();
            $table->unsignedBigInteger('DefaultAddress')->nullable();
            $table->enum('Status', ['Active', 'Busy', 'Offline'])->default('Active');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('remember_token')->nullable();
            $table->timestamps();
            $table->foreign('DefaultAddress')->references('AddressID')->on('addresses')->nullOnDelete();
        });
            DB::statement("ALTER TABLE users AUTO_INCREMENT = 1000000;");


        Schema::create('shops', function (Blueprint $table) {
        $table->id('ShopID');
        $table->foreignId('UserID')
            ->constrained('users', 'UserID') 
            ->onDelete('cascade');
        $table->string('ShopName');
        $table->string('ShopDescription');
        $table->string('LogoImage');
        $table->string('BackgroundImage');
        $table->string('Address');
        $table->string('BusinessPermit');
        $table->boolean('isVerified')->default(false);
        $table->boolean('hasPhysical')->default(false);
        $table->timestamps();
        });
            DB::statement("ALTER TABLE shops AUTO_INCREMENT = 10;");


        Schema::create('admins', function (Blueprint $table) {
            $table->id('AdminID');
            $table->foreignId('UserID') 
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->boolean('IsSuperAdmin')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
        Schema::dropIfExists('admins');
        Schema::dropIfExists('users');
    }
};

