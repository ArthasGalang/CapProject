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
            $table->enum('Status', ['Active', 'Busy', 'Offline', 'Banned'])->default('Offline');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('remember_token')->nullable();
            $table->timestamps();
        });
        DB::statement("ALTER TABLE users AUTO_INCREMENT = 10000000;");



        Schema::create('admins', function (Blueprint $table) {
            $table->id('AdminID');
            $table->foreignId('UserID') 
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->boolean('IsSuperAdmin')->default(false);
            $table->timestamps();
        });
        DB::statement("ALTER TABLE admins AUTO_INCREMENT = 120000000;");
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('replies');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('shops');
        Schema::dropIfExists('admins');
        Schema::dropIfExists('usermessages');
        Schema::dropIfExists('shopmessages');
        Schema::dropIfExists('adminmessages');
        Schema::dropIfExists('announcement');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('users');
    }
};

