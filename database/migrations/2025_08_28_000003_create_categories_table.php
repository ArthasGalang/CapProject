<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id("CategoryID");
            $table->string("CategoryName");
            $table->string("Description");
            $table->timestamps();
        });

        // Auto-seed categories
        DB::table('categories')->insert([
            ['CategoryName' => 'Electronics', 'Description' => 'Electronics category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Books', 'Description' => 'Books category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Clothing', 'Description' => 'Clothing category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Home', 'Description' => 'Home category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Toys', 'Description' => 'Toys category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Groceries', 'Description' => 'Groceries category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Beauty', 'Description' => 'Beauty category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Sports', 'Description' => 'Sports category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Automotive', 'Description' => 'Automotive category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Pets', 'Description' => 'Pets category', 'created_at' => now(), 'updated_at' => now()],
            ['CategoryName' => 'Others', 'Description' => 'Other category', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
