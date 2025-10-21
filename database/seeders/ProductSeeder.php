<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $shops = DB::table('shops')->get();
        $categories = DB::table('categories')->get();
        if ($shops->isEmpty() || $categories->isEmpty()) return;

        // Map keywords to categories for tailoring
        $categoryMap = [
            'Electronics' => ['Electronics', 'Gadget', 'Tech'],
            'Books' => ['Book', 'Page', 'Turner'],
            'Clothing' => ['Fashion', 'Style', 'Wear'],
            'Home' => ['Home', 'Cozy', 'Comfort', 'Living', 'Furniture', 'Decor'],
            'Toys' => ['Toy', 'Play', 'Game'],
            'Groceries' => ['Mart', 'Grocer', 'Food', 'Eats'],
            'Beauty' => ['Beauty', 'Bliss', 'Wellness'],
            'Sports' => ['Sport', 'Gamer', 'Zone'],
            'Automotive' => ['Auto', 'Automotive'],
            'Pets' => ['Pet'],
            'Others' => ['Artisan', 'Handmade', 'Craft']
        ];
        $categoryNames = $categories->pluck('CategoryName', 'CategoryID')->toArray();
        $products = [];
        $productCount = 0;
        $placeholderImg = 'https://via.placeholder.com/150?text=Product';
        foreach ($shops as $shop) {
            // Find tailored categories for this shop
            $tailoredCatIds = [];
            foreach ($categoryMap as $cat => $keywords) {
                foreach ($keywords as $kw) {
                    if (stripos($shop->ShopName, $kw) !== false || stripos($shop->ShopDescription, $kw) !== false) {
                        $catId = array_search($cat, $categoryNames);
                        if ($catId) $tailoredCatIds[] = $catId;
                    }
                }
            }
            // Always fallback to all categories if none matched
            if (empty($tailoredCatIds)) {
                $tailoredCatIds = array_keys($categoryNames);
            }
            $numProducts = rand(10, 20);
            for ($i = 1; $i <= $numProducts; $i++) {
                if ($productCount >= 200) break 2;
                $catId = $tailoredCatIds[array_rand($tailoredCatIds)];
                $products[] = [
                    'ShopID' => $shop->ShopID,
                    'CategoryID' => $catId,
                    'SKU' => 'SKU-' . $shop->ShopID . '-' . $i,
                    'ProductName' => $shop->ShopName . ' Product ' . $i,
                    'Description' => 'A great product from ' . $shop->ShopName,
                    'Price' => rand(100, 10000) / 100,
                    'Stock' => rand(1, 100),
                    'Image' => $placeholderImg,
                    'SoldAmount' => rand(0, 50),
                    'Discount' => rand(0, 1) ? rand(5, 30) : null,
                    'IsFeatured' => (bool)rand(0, 1),
                    'AdditionalImages' => json_encode([$placeholderImg]),
                    'Attributes' => json_encode(['color' => ['red', 'blue', 'green'][rand(0,2)], 'size' => ['S','M','L'][rand(0,2)]]),
                    'PublishedAt' => now(),
                    'IsActive' => true,
                    'Status' => ['Active','OutOfStock','OffSale'][rand(0,2)],
                    'BoughtBy' => json_encode([]),
                    'Tags' => json_encode([$categoryNames[$catId]]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $productCount++;
            }
        }
        DB::table('products')->insert($products);
    }
}
