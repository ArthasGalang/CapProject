<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id('AddressID');
            $table->foreignId('UserID')
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->string('Street');
            $table->string('Barangay');
            $table->string('Municipality');
            $table->string('HouseNumber');
            $table->string('ZipCode');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE addresses AUTO_INCREMENT = 60000000;");
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
