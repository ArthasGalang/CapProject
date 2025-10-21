<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            AddressSeeder::class,
            ShopSeeder::class,
            ProductSeeder::class,
            ReviewAndReplySeeder::class,
            OrderAndOrderItemSeeder::class,
            ReportSeeder::class,
            MessageSeeder::class,
            CartItemSeeder::class,
        ]);
    }
}
                    

