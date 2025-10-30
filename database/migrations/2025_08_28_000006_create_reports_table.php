<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id('ReportID');
            $table->foreignId('UserID')
                  ->constrained('users', 'UserID') 
                  ->onDelete('cascade');
            $table->string('Reason');
            $table->enum('ReportStatus', ['Pending', 'In Review', 'Resolved', 'Rejected']);
            $table->date('ReportDate');
            $table->string('AdminResponse')->nullable();
            $table->string('ReportedLink')->nullable();
            $table->enum('TargetType', ['User', 'Shop', 'Product', 'Order', 'Other']);
            $table->string('TargetID');
            $table->text('Content');
            $table->timestamps();
        });
        DB::statement("ALTER TABLE reports AUTO_INCREMENT = 90000000;");
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
