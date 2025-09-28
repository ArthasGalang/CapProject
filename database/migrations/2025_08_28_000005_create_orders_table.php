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
            $table->decimal('TotalAmount', 10, 2);
            $table->enum('Status', ['ToPay', 'ToShip', 'Delivering', 'Completed']);
            $table->date('OrderDate');
            $table->enum('PaymentMethod', ['CoD', 'EWallet']);
            $table->string('BuyerNote');
            $table->enum('PaymentStatus', ['Pending', 'Paid', 'Failed'])->default('Pending');
            $table->boolean('IsPickUp')->default(True);
            $table->string('PickUpTime');
            $table->date('CompletionDate')->nullable();
            $table->timestamps();

        });
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
    }


    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('orderItem');
    }
};
