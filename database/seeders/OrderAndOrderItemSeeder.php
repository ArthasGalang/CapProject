<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderAndOrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('users')->get();
        $shops = DB::table('shops')->get();
        $addresses = DB::table('addresses')->get();
        $products = DB::table('products')->get();
        if ($users->isEmpty() || $shops->isEmpty() || $addresses->isEmpty() || $products->isEmpty()) return;

        $statuses = ['To Pay', 'Preparing', 'For Pickup/Delivery', 'Completed', 'Cancelled'];
        $paymentMethods = ['CoD', 'EWallet'];
        $orders = [];
        $orderItems = [];
        foreach ($users as $user) {
            $userShops = $shops->where('UserID', $user->UserID)->pluck('ShopID')->toArray();
            $otherShops = $shops->whereNotIn('ShopID', $userShops)->pluck('ShopID')->toArray();
            $numOrders = rand(5, 12); // Increase number of orders per user
            for ($i = 0; $i < $numOrders; $i++) {
                if (empty($otherShops)) break;
                $shopId = $otherShops[array_rand($otherShops)];
                $shopProducts = $products->where('ShopID', $shopId)->pluck('ProductID')->toArray();
                if (empty($shopProducts)) continue;
                $addressId = $addresses->where('UserID', $user->UserID)->pluck('AddressID')->random();
                // Generate a random date within 2025
                $start = strtotime('2025-01-01');
                $end = strtotime('2025-12-31');
                $orderDate = \Carbon\Carbon::createFromTimestamp(rand($start, $end));
                $status = $statuses[array_rand($statuses)];
                $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
                $isPickUp = (bool)rand(0, 1);
                $order = [
                    'UserID' => $user->UserID,
                    'AddressID' => $addressId,
                    'ShopID' => $shopId,
                    'TotalAmount' => 0, // to be updated after items
                    'Status' => $status,
                    'OrderDate' => $orderDate,
                    'PaymentMethod' => $paymentMethod,
                    'BuyerNote' => 'Please process quickly.',
                    'PaymentStatus' => 'Pending',
                    'IsPickUp' => $isPickUp,
                    'PickUpTime' => $orderDate->copy()->addHours(rand(1, 48))->format('H:i'),
                    'CompletionDate' => $status === 'Completed' ? $orderDate->copy()->addDays(rand(1, 7)) : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $orderId = DB::table('orders')->insertGetId($order);
                $numItems = rand(2, min(8, count($shopProducts))); // Increase items per order
                $pickedProducts = array_rand($shopProducts, $numItems);
                if (!is_array($pickedProducts)) $pickedProducts = [$pickedProducts];
                $total = 0;
                foreach ($pickedProducts as $idx) {
                    $productId = $shopProducts[$idx];
                    $qty = rand(2, 6); // Increase quantity per item
                    $product = $products->firstWhere('ProductID', $productId);
                    $subtotal = $product->Price * $qty;
                    $orderItems[] = [
                        'OrderID' => $orderId,
                        'ProductID' => $productId,
                        'Quantity' => $qty,
                        'Subtotal' => $subtotal,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $total += $subtotal;
                }
                DB::table('orders')->where('OrderID', $orderId)->update(['TotalAmount' => $total]);
            }
        }
        // Insert all order items in bulk
        if (!empty($orderItems)) {
            foreach (array_chunk($orderItems, 500) as $chunk) {
                DB::table('order_items')->insert($chunk);
            }
        }
    }
}
