<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate tables to avoid duplicate key errors
    // Disable foreign key checks to allow truncation
    \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    \DB::table('replies')->truncate();
    \DB::table('reviews')->truncate();
    \DB::table('products')->truncate();
    \DB::table('categories')->truncate();
    \DB::table('shops')->truncate();
    \DB::table('addresses')->truncate();
    \DB::table('users')->truncate();
    \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        // Users: diverse names, emails, statuses, profile images
        $userData = [
            ['John', 'Doe', 'john.doe@email.com', 'Active', 'https://randomuser.me/api/portraits/men/1.jpg'],
            ['Jane', 'Smith', 'jane.smith@email.com', 'Busy', 'https://randomuser.me/api/portraits/women/2.jpg'],
            ['Carlos', 'Reyes', 'carlos.reyes@email.com', 'Offline', 'https://randomuser.me/api/portraits/men/3.jpg'],
            ['Emily', 'Tan', 'emily.tan@email.com', 'Active', 'https://randomuser.me/api/portraits/women/4.jpg'],
            ['Ahmed', 'Ali', 'ahmed.ali@email.com', 'Busy', 'https://randomuser.me/api/portraits/men/5.jpg'],
            ['Sofia', 'Garcia', 'sofia.garcia@email.com', 'Active', 'https://randomuser.me/api/portraits/women/6.jpg'],
            ['Liam', 'Nguyen', 'liam.nguyen@email.com', 'Offline', 'https://randomuser.me/api/portraits/men/7.jpg'],
            ['Olivia', 'Kim', 'olivia.kim@email.com', 'Busy', 'https://randomuser.me/api/portraits/women/8.jpg'],
            ['Noah', 'Patel', 'noah.patel@email.com', 'Active', 'https://randomuser.me/api/portraits/men/9.jpg'],
            ['Mia', 'Lee', 'mia.lee@email.com', 'Offline', 'https://randomuser.me/api/portraits/women/10.jpg'],
        ];
        $userIds = [];
        foreach ($userData as $i => $data) {
            $user = \App\Models\User::create([
                'FirstName' => $data[0],
                'LastName' => $data[1],
                'Email' => $data[2],
                'Password' => bcrypt('password' . ($i+1)),
                'ContactNumber' => '09' . rand(100000000,999999999),
                'ProfileImage' => $data[4],
                'Status' => $data[3],
            ]);
            $userIds[] = $user->UserID;
        }

        // Overwrite login for each user: email: 123@[0..9], password: 12312[0..9]
        foreach ($userIds as $i => $uid) {
            \App\Models\User::where('UserID', $uid)->update([
                'Email' => '123@' . $i,
                'Password' => bcrypt('12312' . $i),
            ]);
        }

        // Addresses: realistic, 1 per user, rest distributed
        $addressTemplates = [
            ['Main St', 'Central', 'Metro City', '123', '1000'],
            ['Oak Ave', 'North', 'Metro City', '456', '1001'],
            ['Pine Rd', 'East', 'Metro City', '789', '1002'],
            ['Maple St', 'West', 'Metro City', '321', '1003'],
            ['Elm St', 'South', 'Metro City', '654', '1004'],
            ['Cedar Ave', 'Central', 'Metro City', '987', '1005'],
            ['Spruce Rd', 'North', 'Metro City', '246', '1006'],
            ['Birch St', 'East', 'Metro City', '135', '1007'],
            ['Willow Ave', 'West', 'Metro City', '864', '1008'],
            ['Aspen Rd', 'South', 'Metro City', '579', '1009'],
        ];
        $addressIds = [];
        for ($i = 0; $i < 15; $i++) {
            $template = $addressTemplates[$i % 10];
            $address = \DB::table('addresses')->insertGetId([
                'UserID' => $userIds[$i % 10],
                'Street' => $template[0],
                'Barangay' => $template[1],
                'Municipality' => $template[2],
                'HouseNumber' => $template[3], // Province replaced by HouseNumber
                'ZipCode' => $template[4],
            ]);
            $addressIds[] = $address;
        }
        foreach ($userIds as $idx => $uid) {
            \App\Models\User::where('UserID', $uid)->update(['DefaultAddress' => $addressIds[$idx]]);
        }

        // Shops: unique names, descriptions, images, verified, physical
        $shopTemplates = [
            ['Tech Haven', 'Electronics and gadgets', true, true],
            ['Book Nook', 'Books and stationery', true, false],
            ['Fashion Forward', 'Trendy clothing', false, true],
            ['Home Comforts', 'Furniture and decor', true, true],
            ['Toy World', 'Toys and games', false, false],
            ['Fresh Mart', 'Groceries and essentials', true, true],
            ['Beauty Bliss', 'Beauty and wellness', false, false],
            ['Sport Spot', 'Sports equipment', true, true],
            ['Auto Hub', 'Automotive parts', false, true],
            ['Pet Palace', 'Pet supplies', true, false],
            // 6 more shops
            ['Gadget Galaxy', 'Latest tech gadgets', true, false],
            ['Page Turners', 'Rare and new books', false, true],
            ['Style Central', 'Urban fashion', true, true],
            ['Cozy Living', 'Home essentials', false, false],
            ['Playtime Plus', 'Educational toys', true, true],
            ['Green Grocer', 'Organic groceries', false, true],
        ];
        $shopIds = [];
        // Distribute shops: user 0 gets 3 shops, rest distributed to other users
        $shopUserMap = [
            $userIds[0], $userIds[0], $userIds[0], // user 0 gets 3 shops
            $userIds[1], $userIds[2], $userIds[3], $userIds[4], $userIds[5], $userIds[6], $userIds[7],
            $userIds[8], $userIds[9], $userIds[1], $userIds[2], $userIds[3], $userIds[4]
        ];
        foreach ($shopTemplates as $i => $shop) {
            $shopId = \DB::table('shops')->insertGetId([
                'UserID' => $shopUserMap[$i % count($shopUserMap)],
                'ShopName' => $shop[0],
                'ShopDescription' => $shop[1],
                'LogoImage' => 'https://via.placeholder.com/150?text=' . urlencode($shop[0]),
                'BackgroundImage' => 'https://via.placeholder.com/300x100?text=' . urlencode($shop[0]) . '+BG',
                'Address' => $addressTemplates[$i % 10][0],
                'BusinessPermit' => 'Permit-' . ($i+1),
                'isVerified' => $shop[2],
                'hasPhysical' => $shop[3],
            ]);
            $shopIds[] = $shopId;
        }

        // Categories: insert only once, avoid duplicates
    \DB::table('categories')->delete();
        $categoryNames = [
            'Electronics', 'Books', 'Clothing', 'Home', 'Toys', 'Groceries', 'Beauty', 'Sports', 'Automotive', 'Pets', 'Others'
        ];
        $categoryIds = [];
        foreach ($categoryNames as $catName) {
            $categoryIds[] = \DB::table('categories')->insertGetId([
                'CategoryName' => $catName,
                'Description' => $catName . ' category',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Products: specific, at least 150, distributed randomly to each shop and their category
        $productTemplates = [
            // Electronics
            ['Smartphone', 'Latest model smartphone', 'Electronics'],
            ['Laptop', 'High performance laptop', 'Electronics'],
            ['Bluetooth Headphones', 'Wireless headphones', 'Electronics'],
            ['Smartwatch', 'Fitness tracking smartwatch', 'Electronics'],
            ['Tablet', '10-inch display tablet', 'Electronics'],
            ['Action Camera', 'Waterproof action camera', 'Electronics'],
            ['Gaming Console', 'Next-gen gaming console', 'Electronics'],
            ['Power Bank', '10000mAh power bank', 'Electronics'],
            ['Monitor', '24-inch LED monitor', 'Electronics'],
            ['VR Headset', 'Virtual reality headset', 'Electronics'],
            // Books
            ['Historical Fiction', 'Novel set in ancient times', 'Books'],
            ['Poetry Collection', 'Modern poetry anthology', 'Books'],
            ['Travel Guide', 'Guide to world travel', 'Books'],
            ['Comic Book', 'Superhero comic book', 'Books'],
            ['Business Manual', 'Entrepreneurship manual', 'Books'],
            ['Mystery Novel', 'A thrilling mystery novel', 'Books'],
            ['Science Textbook', 'Comprehensive science textbook', 'Books'],
            ['Cookbook', 'Delicious recipes cookbook', 'Books'],
            ['Children’s Storybook', 'Illustrated children’s storybook', 'Books'],
            ['Self-Help Guide', 'Guide to personal growth', 'Books'],
            // Clothing
            ['Polo Shirt', 'Classic polo shirt', 'Clothing'],
            ['Shorts', 'Casual shorts', 'Clothing'],
            ['Blouse', 'Women’s blouse', 'Clothing'],
            ['Raincoat', 'Waterproof raincoat', 'Clothing'],
            ['Gloves', 'Winter gloves', 'Clothing'],
            ['Men’s T-Shirt', 'Cotton t-shirt', 'Clothing'],
            ['Women’s Dress', 'Summer dress', 'Clothing'],
            ['Jeans', 'Denim jeans', 'Clothing'],
            ['Jacket', 'Warm winter jacket', 'Clothing'],
            ['Sneakers', 'Comfortable sneakers', 'Clothing'],
            // Home
            ['Wall Clock', 'Modern wall clock', 'Home'],
            ['Rug', 'Soft area rug', 'Home'],
            ['Bookshelf', 'Wooden bookshelf', 'Home'],
            ['Mirror', 'Decorative wall mirror', 'Home'],
            ['Laundry Basket', 'Plastic laundry basket', 'Home'],
            ['Sofa', '3-seater sofa', 'Home'],
            ['Dining Table', 'Wooden dining table', 'Home'],
            ['Lamp', 'LED desk lamp', 'Home'],
            ['Curtains', 'Window curtains', 'Home'],
            ['Cookware Set', 'Non-stick cookware set', 'Home'],
            // Toys
            ['Yo-Yo', 'Classic yo-yo toy', 'Toys'],
            ['Kite', 'Colorful flying kite', 'Toys'],
            ['Toy Gun', 'Plastic toy gun', 'Toys'],
            ['Jump Rope', 'Fitness jump rope', 'Toys'],
            ['Bubble Maker', 'Bubble making toy', 'Toys'],
            ['Building Blocks', 'Colorful building blocks', 'Toys'],
            ['Doll', 'Fashion doll', 'Toys'],
            ['RC Car', 'Remote control car', 'Toys'],
            ['Puzzle', '500-piece puzzle', 'Toys'],
            ['Plush Toy', 'Soft plush toy', 'Toys'],
            // Groceries
            ['Rice', 'Premium white rice', 'Groceries'],
            ['Eggs', 'Fresh farm eggs', 'Groceries'],
            ['Milk', 'Organic cow milk', 'Groceries'],
            ['Bread', 'Whole wheat bread', 'Groceries'],
            ['Chicken', 'Free-range chicken', 'Groceries'],
            ['Apples', 'Red apples', 'Groceries'],
            ['Bananas', 'Sweet bananas', 'Groceries'],
            ['Carrots', 'Fresh carrots', 'Groceries'],
            ['Potatoes', 'Organic potatoes', 'Groceries'],
            ['Tomatoes', 'Juicy tomatoes', 'Groceries'],
            // Beauty
            ['Shampoo', 'Herbal shampoo', 'Beauty'],
            ['Conditioner', 'Moisturizing conditioner', 'Beauty'],
            ['Face Cream', 'Anti-aging face cream', 'Beauty'],
            ['Lipstick', 'Long-lasting lipstick', 'Beauty'],
            ['Perfume', 'Floral perfume', 'Beauty'],
            ['Body Lotion', 'Hydrating body lotion', 'Beauty'],
            ['Sunscreen', 'SPF 50 sunscreen', 'Beauty'],
            ['Mascara', 'Waterproof mascara', 'Beauty'],
            ['Foundation', 'Liquid foundation', 'Beauty'],
            ['Blush', 'Rosy blush', 'Beauty'],
            // Sports
            ['Basketball', 'Official size basketball', 'Sports'],
            ['Soccer Ball', 'Professional soccer ball', 'Sports'],
            ['Tennis Racket', 'Lightweight tennis racket', 'Sports'],
            ['Yoga Mat', 'Non-slip yoga mat', 'Sports'],
            ['Dumbbells', 'Adjustable dumbbells', 'Sports'],
            ['Jump Rope', 'Speed jump rope', 'Sports'],
            ['Golf Clubs', 'Set of golf clubs', 'Sports'],
            ['Swim Goggles', 'Anti-fog swim goggles', 'Sports'],
            ['Running Shoes', 'Breathable running shoes', 'Sports'],
            ['Cycling Helmet', 'Safety cycling helmet', 'Sports'],
            // Automotive
            ['Car Battery', 'Long-life car battery', 'Automotive'],
            ['Tire', 'All-season tire', 'Automotive'],
            ['Motor Oil', 'Synthetic motor oil', 'Automotive'],
            ['Wiper Blades', 'Durable wiper blades', 'Automotive'],
            ['Spark Plugs', 'High-performance spark plugs', 'Automotive'],
            ['Brake Pads', 'Ceramic brake pads', 'Automotive'],
            ['Air Filter', 'Premium air filter', 'Automotive'],
            ['Headlights', 'LED headlights', 'Automotive'],
            ['Car Wax', 'Glossy car wax', 'Automotive'],
            ['Floor Mats', 'All-weather floor mats', 'Automotive'],
            // Pets
            ['Dog Food', 'Nutritious dog food', 'Pets'],
            ['Cat Food', 'Grain-free cat food', 'Pets'],
            ['Bird Seed', 'Vitamin-rich bird seed', 'Pets'],
            ['Fish Tank', 'Glass fish tank', 'Pets'],
            ['Pet Shampoo', 'Gentle pet shampoo', 'Pets'],
            ['Dog Leash', 'Durable dog leash', 'Pets'],
            ['Cat Litter', 'Clumping cat litter', 'Pets'],
            ['Pet Carrier', 'Portable pet carrier', 'Pets'],
            ['Chew Toy', 'Safe chew toy', 'Pets'],
            ['Pet Bed', 'Comfortable pet bed', 'Pets'],
            // Others
            ['Umbrella', 'Windproof umbrella', 'Others'],
            ['Flashlight', 'Rechargeable flashlight', 'Others'],
            ['Notebook', 'Spiral notebook', 'Others'],
            ['Water Bottle', 'Insulated water bottle', 'Others'],
            ['Backpack', 'Multi-compartment backpack', 'Others'],
            ['Pen Set', 'Luxury pen set', 'Others'],
            ['Desk Organizer', 'Adjustable desk organizer', 'Others'],
            ['Travel Pillow', 'Memory foam travel pillow', 'Others'],
            ['Alarm Clock', 'Digital alarm clock', 'Others'],
            ['Keychain', 'Custom keychain', 'Others'],
        ];
        $productIds = [];
        for ($i = 1; $i <= 150; $i++) {
            $template = $productTemplates[rand(0, count($productTemplates)-1)];
            $shopIdx = rand(0, count($shopIds)-1);
            $catIdx = array_search($template[2], $categoryNames);
            $productName = $template[0] . ' ' . $i;
            $desc = $template[1] . ' (Item #' . $i . ')';
            $price = rand(100, 10000);
            $stock = rand(1, 200);
            $tags = [$template[2], 'sale', 'popular'];
            $attributes = ['color' => ['red','blue','green'][rand(0,2)], 'size' => ['S','M','L'][rand(0,2)]];
            $images = [
                'https://via.placeholder.com/150?text=' . urlencode($productName),
                'https://via.placeholder.com/150?text=' . urlencode($productName) . '+2'
            ];
            // Ensure BoughtBy is always an array of user IDs
            $boughtByRaw = array_rand($userIds, rand(1,5));
            $boughtBy = is_array($boughtByRaw) ? array_map(function($idx) use ($userIds) { return $userIds[$idx]; }, $boughtByRaw) : [$userIds[$boughtByRaw]];
            $productId = \DB::table('products')->insertGetId([
                'ShopID' => $shopIds[$shopIdx],
                'CategoryID' => $categoryIds[$catIdx],
                'SKU' => 'SKU-' . $i,
                'ProductName' => $productName,
                'Description' => $desc,
                'Price' => $price,
                'Stock' => $stock,
                'Image' => json_encode($images),
                'AdditionalImages' => json_encode([$images[1]]),
                'SoldAmount' => rand(0, $stock),
                'Status' => ['Active','OutOfStock','OffSale'][rand(0,2)],
                'IsActive' => true,
                'Attributes' => json_encode($attributes),
                'Discount' => rand(0, 500),
                'IsFeatured' => (bool)rand(0,1),
                'Tags' => json_encode($tags),
                'BoughtBy' => json_encode($boughtBy),
                'PublishedAt' => now()->subDays(rand(0,365)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $productIds[] = $productId;
        }

        // Reviews: realistic comments, ratings, dates
        $reviewIds = [];
        foreach ($productIds as $pid) {
            $numReviews = rand(0,5);
            for ($r = 0; $r < $numReviews; $r++) {
                $review = \DB::table('reviews')->insertGetId([
                    'UserID' => $userIds[rand(0,9)],
                    'ProductID' => $pid,
                    'Rating' => rand(1,5),
                    'Comment' => 'User ' . ($r+1) . ' says: ' . ['Great product!','Not bad.','Could be better.','Excellent value.','Would buy again.'][rand(0,4)],
                    'ReviewDate' => now()->subDays(rand(0,365)),
                ]);
                $reviewIds[] = $review;
            }
        }

        // Replies: realistic comments, likes
        foreach ($reviewIds as $rid) {
            $numReplies = rand(0,2);
            for ($rp = 0; $rp < $numReplies; $rp++) {
                $numLikes = rand(0,3);
                $likedBy = $numLikes ? array_rand($userIds, $numLikes) : [];
                \DB::table('replies')->insert([
                    'UserID' => $userIds[rand(0,9)],
                    'ReviewID' => $rid,
                    'Comment' => ['Thanks for your feedback!','We appreciate your review.','Let us know if you need help.'][rand(0,2)],  
                    'LikedBy' => json_encode($likedBy),
                    'created_at' => now()->subDays(rand(0,365)),
                    'updated_at' => now()->subDays(rand(0,365)),
                ]);
            }
        }
    }
}
