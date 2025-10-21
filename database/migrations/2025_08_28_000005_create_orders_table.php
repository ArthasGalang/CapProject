<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('OrderID');
            $table->foreignId('UserID')
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->foreignId('AddressID')
                  ->constrained('addresses', 'AddressID')
                  ->onDelete('cascade');
            $table->foreignId('ShopID')
                    ->constrained('shops', 'ShopID')
                    ->onDelete('cascade');
            $table->decimal('TotalAmount', 10, 2);
            $table->enum('Status', ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed', 'Cancelled'])->default('To Pay');
            $table->date('OrderDate');
            $table->enum('PaymentMethod', ['CoD', 'EWallet']);
            $table->string('BuyerNote');
            $table->enum('PaymentStatus', ['Pending', 'Confirmed', 'Failed'])->default('Pending');
            $table->boolean('IsPickUp')->default(True);
            $table->string('PickUpTime');
            $table->date('CompletionDate')->nullable();
            $table->timestamps();

        });
      DB::statement("ALTER TABLE orders AUTO_INCREMENT = 70000000;");
        Schema::create('order_items', function (Blueprint $table) {
            $table->id('OrderItemID');
            $table->foreignId('OrderID')
                  ->constrained('orders', 'OrderID')
                  ->onDelete('cascade');
            $table->foreignId('ProductID')
                  ->constrained('products', 'ProductID')
                  ->onDelete('cascade');
            $table->unsignedInteger('Quantity');
            $table->decimal('Subtotal', 10, 2);
            $table->timestamps();
        });
        DB::statement("ALTER TABLE order_items AUTO_INCREMENT = 80000000;");
        
    }


    public function down(): void
    {
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('orders');
    }
};
