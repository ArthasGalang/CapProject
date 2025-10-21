<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class CartItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cart_items')->delete();
        $faker = Faker::create();
        $users = DB::table('users')->pluck('UserID')->toArray();
        $products = DB::table('products')->select('ProductID', 'ShopID', 'Price', 'Attributes')->get();
        foreach ($users as $userId) {
            $cartCount = rand(2, 10);
            $usedProductIds = [];
            for ($i = 0; $i < $cartCount; $i++) {
                $product = $faker->randomElement($products);
                // Avoid duplicate products in the same user's cart
                if (in_array($product->ProductID, $usedProductIds)) {
                    continue;
                }
                $usedProductIds[] = $product->ProductID;
                $quantity = rand(1, 5);
                $price = $product->Price;
                $subtotal = $price * $quantity;
                $options = $product->Attributes ? json_decode($product->Attributes, true) : null;
                DB::table('cart_items')->insert([
                    'UserID' => $userId,
                    'ProductID' => $product->ProductID,
                    'ShopID' => $product->ShopID,
                    'Quantity' => $quantity,
                    'Price' => $price,
                    'Subtotal' => $subtotal,
                    'Options' => $options ? json_encode($options) : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
