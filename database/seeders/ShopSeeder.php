<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = DB::table('users')->pluck('UserID')->toArray();
        $addressIds = DB::table('addresses')->pluck('AddressID')->toArray();
        if (count($userIds) === 0 || count($addressIds) === 0) return;

        $shopNames = [
            'Tech Haven', 'Book Nook', 'Fashion Forward', 'Home Comforts', 'Toy World',
            'Fresh Mart', 'Beauty Bliss', 'Sport Spot', 'Auto Hub', 'Pet Palace',
            'Gadget Galaxy', 'Page Turners', 'Style Central', 'Cozy Living', 'Playtime Plus',
            'Green Grocer', 'Urban Eats', 'Shoe Stop', 'Gamer Zone', 'Artisan Alley'
        ];
        $shopDescriptions = [
            'Electronics and gadgets', 'Books and stationery', 'Trendy clothing', 'Furniture and decor', 'Toys and games',
            'Groceries and essentials', 'Beauty and wellness', 'Sports equipment', 'Automotive parts', 'Pet supplies',
            'Latest tech gadgets', 'Rare and new books', 'Urban fashion', 'Home essentials', 'Educational toys',
            'Organic groceries', 'Trendy food hub', 'Footwear for all', 'Gaming paradise', 'Handmade crafts'
        ];
        $placeholderLogo = 'https://via.placeholder.com/150?text=Shop+Logo';
        $placeholderBg = 'https://via.placeholder.com/300x100?text=Shop+BG';

        // Distribute shops: each user gets at least 1, max 3
        $userShopCount = array_fill(0, count($userIds), 1); // everyone gets 1
        $remaining = 20 - count($userIds);
        while ($remaining > 0) {
            $idx = rand(0, count($userIds)-1);
            if ($userShopCount[$idx] < 3) {
                $userShopCount[$idx]++;
                $remaining--;
            }
        }
        $shops = [];
        $shopIdx = 0;
        foreach ($userIds as $i => $userId) {
            for ($j = 0; $j < $userShopCount[$i]; $j++) {
                $shops[] = [
                    'UserID' => $userId,
                    'ShopName' => $shopNames[$shopIdx % count($shopNames)],
                    'ShopDescription' => $shopDescriptions[$shopIdx % count($shopDescriptions)],
                    'LogoImage' => $placeholderLogo,
                    'BackgroundImage' => $placeholderBg,
                    'AddressID' => $addressIds[array_rand($addressIds)],
                    'BusinessPermit' => 'Permit-' . ($shopIdx+1),
                    'isVerified' => (bool)rand(0,1),
                    'hasPhysical' => (bool)rand(0,1),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $shopIdx++;
            }
        }
        DB::table('shops')->insert($shops);
    }
}
