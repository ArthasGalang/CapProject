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
        $table->foreignId('ShopID')
            ->constrained('shops', 'ShopID')
            ->onDelete('cascade');
        $table->foreignId('CategoryID')
            ->constrained('categories', 'CategoryID')
            ->onDelete('cascade');
        $table->string('SKU');
        $table->string("ProductName");
        $table->string("Description");
        $table->decimal("Price", 10, 2);
        $table->unsignedInteger("Stock");
        $table->json("Image");
        $table->unsignedInteger('SoldAmount')->default(0);
        $table->json('Tags')->nullable();
        $table->decimal('Discount', 10, 2)->nullable();
        $table->boolean('IsFeatured')->default(false);
        $table->json('AdditionalImages')->nullable();
        $table->json('Attributes')->nullable();
        $table->timestamp('PublishedAt')->nullable();
        $table->boolean('IsActive')->default(true);
        $table->enum('Status', ['Active', 'OutOfStock', 'OffSale']);
        $table->json('BoughtBy')->nullable();
        $table->json('Tags')->nullable();
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

        Schema::create('replies', function (Blueprint $table) {
            $table->id('ReplyID');
            $table->foreignId('UserID')->constrained('users', 'UserID')->onDelete('cascade');
            $table->foreignId('ReviewID')->constrained('reviews', 'ReviewID')->onDelete('cascade');
            $table->text('Comment');
            $table->json('LikedBy')->nullable();
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('products');
        Schema::dropIfExists('replies');
    }
};
