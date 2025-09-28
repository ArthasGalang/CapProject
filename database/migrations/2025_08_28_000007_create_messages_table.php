<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id('MessageID');
            $table->foreignId('SenderID')
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->foreignId('ReceiverID')
                  ->constrained('users', 'UserID')
                  ->onDelete('cascade');
            $table->text('MessageBody');
            $table->boolean('IsRead')->default(false);
            $table->timestamp('ReadAt')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
