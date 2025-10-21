<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usermessages', function (Blueprint $table) {
            $table->id('UserMessageID');
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
      DB::statement("ALTER TABLE usermessages AUTO_INCREMENT = 100000000;");


        Schema::create('shopmessages', function (Blueprint $table) {
            $table->id('ShopMessageID');
    $table->foreignId('SenderID')
      ->constrained('shops', 'ShopID')
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
      DB::statement("ALTER TABLE shopmessages AUTO_INCREMENT = 110000000;");



    Schema::create('announcement', function (Blueprint $table) {
            $table->id('AnnouncementID');
            $table->json('ReceiverIDs'); // JSON array of user IDs
            $table->text('Content');
            $table->softDeletes();
            $table->timestamps();
        });
      DB::statement("ALTER TABLE announcement AUTO_INCREMENT = 120000000;");
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
