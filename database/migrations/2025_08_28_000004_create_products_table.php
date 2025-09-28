<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id("ProductID");
            $table->foreignId('UserID')
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->foreignId('CategoryID')
                  ->constrained('categories', 'CategoryID')
                  ->onDelete('cascade');
            $table->string('SKU');
            $table->string("ProductName");
            $table->string("Description");
            $table->decimal("Price", 10, 2);
            $table->unsignedInteger("Stock");
            $table->string("Image");
            $table->boolean("isActive")->default(false);
            $table->timestamps();
        });
            DB::statement("ALTER TABLE products AUTO_INCREMENT = 10000000;");
        

        Schema::create('reviews', function (Blueprint $table) {
            $table->id("ReviewID");
            $table->foreignId('UserID')
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->foreignId('ProductID')
                  ->constrained('products', 'ProductID')
                  ->onDelete('cascade');
            $table->unsignedTinyInteger("Rating");
            $table->text("Comment");
            $table->date("ReviewDate");
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('reviews');
    }
};
