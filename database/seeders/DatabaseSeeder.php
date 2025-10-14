<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $userIds = [];
        for ($i = 1; $i <= 10; $i++) {
            $user = \App\Models\User::create([
                'FirstName' => 'a' . $i,
                'LastName' => 'b' . $i,
                'email' => '123@' . $i,
                'Password' => bcrypt('123' . $i),
                'ContactNumber' => '123123' . $i,
            ]);
            $userIds[] = $user->UserID;
        }

        // Seed categories
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

        // Seed products: each user 2-10 products, each category 5-15 products
        $productId = 4000000;
        $categoryProductCount = array_fill(0, count($categoryIds), 0);
        $categoryMin = 5;
        $categoryMax = 15;

        // Realistic products for each category
        $productsByCategory = [
            'Electronics' => [
                ['name' => 'Smart TV', 'desc' => '4K Ultra HD Smart TV', 'price' => 15999, 'stock' => 7, 'image' => 'https://via.placeholder.com/150?text=Smart+TV'],
                ['name' => 'Portable Speaker', 'desc' => 'Bluetooth portable speaker', 'price' => 1499, 'stock' => 35, 'image' => 'https://via.placeholder.com/150?text=Speaker'],
                ['name' => 'Drone', 'desc' => 'Quadcopter drone with camera', 'price' => 6999, 'stock' => 10, 'image' => 'https://via.placeholder.com/150?text=Drone'],
                ['name' => 'VR Headset', 'desc' => 'Virtual reality headset', 'price' => 4999, 'stock' => 12, 'image' => 'https://via.placeholder.com/150?text=VR+Headset'],
                ['name' => 'USB Flash Drive', 'desc' => '128GB USB 3.0 flash drive', 'price' => 499, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=USB+Drive'],
                ['name' => 'Smartphone', 'desc' => 'Latest model smartphone', 'price' => 7999, 'stock' => 25, 'image' => 'https://via.placeholder.com/150?text=Smartphone'],
                ['name' => 'Laptop', 'desc' => 'High performance laptop', 'price' => 12999, 'stock' => 10, 'image' => 'https://via.placeholder.com/150?text=Laptop'],
                ['name' => 'Bluetooth Headphones', 'desc' => 'Wireless headphones', 'price' => 1999, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Headphones'],
                ['name' => 'Smartwatch', 'desc' => 'Fitness tracking smartwatch', 'price' => 2999, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Smartwatch'],
                ['name' => 'Tablet', 'desc' => '10-inch display tablet', 'price' => 4999, 'stock' => 20, 'image' => 'https://via.placeholder.com/150?text=Tablet'],
                ['name' => 'Action Camera', 'desc' => 'Waterproof action camera', 'price' => 3999, 'stock' => 15, 'image' => 'https://via.placeholder.com/150?text=Camera'],
                ['name' => 'Wireless Mouse', 'desc' => 'Ergonomic wireless mouse', 'price' => 899, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Mouse'],
                ['name' => 'Gaming Console', 'desc' => 'Next-gen gaming console', 'price' => 15999, 'stock' => 8, 'image' => 'https://via.placeholder.com/150?text=Console'],
                ['name' => 'Power Bank', 'desc' => '10000mAh power bank', 'price' => 999, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Power+Bank'],
                ['name' => 'Monitor', 'desc' => '24-inch LED monitor', 'price' => 4999, 'stock' => 12, 'image' => 'https://via.placeholder.com/150?text=Monitor'],
            ],
            'Books' => [
                ['name' => 'Historical Fiction', 'desc' => 'Novel set in ancient times', 'price' => 499, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Historical'],
                ['name' => 'Poetry Collection', 'desc' => 'Modern poetry anthology', 'price' => 299, 'stock' => 70, 'image' => 'https://via.placeholder.com/150?text=Poetry'],
                ['name' => 'Travel Guide', 'desc' => 'Guide to world travel', 'price' => 599, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Travel'],
                ['name' => 'Comic Book', 'desc' => 'Superhero comic book', 'price' => 199, 'stock' => 90, 'image' => 'https://via.placeholder.com/150?text=Comic'],
                ['name' => 'Business Manual', 'desc' => 'Entrepreneurship manual', 'price' => 699, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Business'],
                ['name' => 'Mystery Novel', 'desc' => 'A thrilling mystery novel', 'price' => 499, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Book'],
                ['name' => 'Science Textbook', 'desc' => 'Comprehensive science textbook', 'price' => 899, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Textbook'],
                ['name' => 'Cookbook', 'desc' => 'Delicious recipes cookbook', 'price' => 599, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Cookbook'],
                ['name' => 'Children’s Storybook', 'desc' => 'Illustrated children’s storybook', 'price' => 299, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Storybook'],
                ['name' => 'Self-Help Guide', 'desc' => 'Guide to personal growth', 'price' => 399, 'stock' => 70, 'image' => 'https://via.placeholder.com/150?text=Self-Help'],
                ['name' => 'Romance Novel', 'desc' => 'Heartwarming romance novel', 'price' => 399, 'stock' => 90, 'image' => 'https://via.placeholder.com/150?text=Romance'],
                ['name' => 'Fantasy Epic', 'desc' => 'Epic fantasy adventure', 'price' => 599, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Fantasy'],
                ['name' => 'Biography', 'desc' => 'Inspiring biography', 'price' => 499, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Biography'],
            ],
            'Clothing' => [
                ['name' => 'Polo Shirt', 'desc' => 'Classic polo shirt', 'price' => 499, 'stock' => 90, 'image' => 'https://via.placeholder.com/150?text=Polo'],
                ['name' => 'Shorts', 'desc' => 'Casual shorts', 'price' => 399, 'stock' => 110, 'image' => 'https://via.placeholder.com/150?text=Shorts'],
                ['name' => 'Blouse', 'desc' => 'Women’s blouse', 'price' => 599, 'stock' => 70, 'image' => 'https://via.placeholder.com/150?text=Blouse'],
                ['name' => 'Raincoat', 'desc' => 'Waterproof raincoat', 'price' => 899, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Raincoat'],
                ['name' => 'Gloves', 'desc' => 'Winter gloves', 'price' => 299, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Gloves'],
                ['name' => 'Men’s T-Shirt', 'desc' => 'Cotton t-shirt', 'price' => 299, 'stock' => 200, 'image' => 'https://via.placeholder.com/150?text=T-Shirt'],
                ['name' => 'Women’s Dress', 'desc' => 'Summer dress', 'price' => 799, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Dress'],
                ['name' => 'Jeans', 'desc' => 'Denim jeans', 'price' => 999, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Jeans'],
                ['name' => 'Jacket', 'desc' => 'Warm winter jacket', 'price' => 1499, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Jacket'],
                ['name' => 'Sneakers', 'desc' => 'Comfortable sneakers', 'price' => 1299, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Sneakers'],
                ['name' => 'Socks', 'desc' => 'Pack of 5 socks', 'price' => 199, 'stock' => 120, 'image' => 'https://via.placeholder.com/150?text=Socks'],
                ['name' => 'Cap', 'desc' => 'Adjustable baseball cap', 'price' => 299, 'stock' => 70, 'image' => 'https://via.placeholder.com/150?text=Cap'],
                ['name' => 'Scarf', 'desc' => 'Woolen scarf', 'price' => 399, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Scarf'],
                ['name' => 'Belt', 'desc' => 'Leather belt', 'price' => 499, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Belt'],
            ],
            'Home' => [
                ['name' => 'Wall Clock', 'desc' => 'Modern wall clock', 'price' => 399, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Clock'],
                ['name' => 'Rug', 'desc' => 'Soft area rug', 'price' => 999, 'stock' => 20, 'image' => 'https://via.placeholder.com/150?text=Rug'],
                ['name' => 'Bookshelf', 'desc' => 'Wooden bookshelf', 'price' => 2499, 'stock' => 10, 'image' => 'https://via.placeholder.com/150?text=Bookshelf'],
                ['name' => 'Mirror', 'desc' => 'Decorative wall mirror', 'price' => 799, 'stock' => 25, 'image' => 'https://via.placeholder.com/150?text=Mirror'],
                ['name' => 'Laundry Basket', 'desc' => 'Plastic laundry basket', 'price' => 299, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Laundry'],
                ['name' => 'Sofa', 'desc' => '3-seater sofa', 'price' => 7999, 'stock' => 10, 'image' => 'https://via.placeholder.com/150?text=Sofa'],
                ['name' => 'Dining Table', 'desc' => 'Wooden dining table', 'price' => 5999, 'stock' => 8, 'image' => 'https://via.placeholder.com/150?text=Table'],
                ['name' => 'Lamp', 'desc' => 'LED desk lamp', 'price' => 499, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Lamp'],
                ['name' => 'Curtains', 'desc' => 'Window curtains', 'price' => 799, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Curtains'],
                ['name' => 'Cookware Set', 'desc' => 'Non-stick cookware set', 'price' => 1999, 'stock' => 20, 'image' => 'https://via.placeholder.com/150?text=Cookware'],
            ],
            'Toys' => [
                ['name' => 'Yo-Yo', 'desc' => 'Classic yo-yo toy', 'price' => 99, 'stock' => 120, 'image' => 'https://via.placeholder.com/150?text=Yo-Yo'],
                ['name' => 'Kite', 'desc' => 'Colorful flying kite', 'price' => 199, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Kite'],
                ['name' => 'Toy Gun', 'desc' => 'Plastic toy gun', 'price' => 149, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Toy+Gun'],
                ['name' => 'Jump Rope', 'desc' => 'Fitness jump rope', 'price' => 129, 'stock' => 90, 'image' => 'https://via.placeholder.com/150?text=Jump+Rope'],
                ['name' => 'Bubble Maker', 'desc' => 'Bubble making toy', 'price' => 79, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Bubble'],
                ['name' => 'Building Blocks', 'desc' => 'Colorful building blocks', 'price' => 399, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Blocks'],
                ['name' => 'Doll', 'desc' => 'Fashion doll', 'price' => 499, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Doll'],
                ['name' => 'RC Car', 'desc' => 'Remote control car', 'price' => 999, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=RC+Car'],
                ['name' => 'Puzzle', 'desc' => '500-piece puzzle', 'price' => 299, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Puzzle'],
                ['name' => 'Plush Toy', 'desc' => 'Soft plush toy', 'price' => 399, 'stock' => 70, 'image' => 'https://via.placeholder.com/150?text=Plush'],
                ['name' => 'Toy Train', 'desc' => 'Battery operated toy train', 'price' => 599, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Train'],
                ['name' => 'Board Game', 'desc' => 'Family board game', 'price' => 799, 'stock' => 25, 'image' => 'https://via.placeholder.com/150?text=Board+Game'],
                ['name' => 'Action Figure', 'desc' => 'Superhero action figure', 'price' => 499, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Action+Figure'],
            ],
            'Groceries' => [
                ['name' => 'Bread', 'desc' => 'Freshly baked bread', 'price' => 49, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Bread'],
                ['name' => 'Butter', 'desc' => 'Creamy butter', 'price' => 89, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Butter'],
                ['name' => 'Cheese', 'desc' => 'Cheddar cheese block', 'price' => 199, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Cheese'],
                ['name' => 'Orange Juice', 'desc' => '1L orange juice', 'price' => 99, 'stock' => 70, 'image' => 'https://via.placeholder.com/150?text=Juice'],
                ['name' => 'Bananas', 'desc' => '1kg bananas', 'price' => 59, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Bananas'],
                ['name' => 'Rice', 'desc' => '5kg bag of rice', 'price' => 299, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Rice'],
                ['name' => 'Cooking Oil', 'desc' => '1L bottle of cooking oil', 'price' => 149, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Oil'],
                ['name' => 'Canned Tuna', 'desc' => 'Canned tuna in oil', 'price' => 59, 'stock' => 200, 'image' => 'https://via.placeholder.com/150?text=Tuna'],
                ['name' => 'Instant Noodles', 'desc' => 'Pack of instant noodles', 'price' => 12, 'stock' => 300, 'image' => 'https://via.placeholder.com/150?text=Noodles'],
                ['name' => 'Coffee', 'desc' => 'Ground coffee', 'price' => 199, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Coffee'],
                ['name' => 'Sugar', 'desc' => '1kg pack of sugar', 'price' => 89, 'stock' => 120, 'image' => 'https://via.placeholder.com/150?text=Sugar'],
                ['name' => 'Salt', 'desc' => '500g pack of salt', 'price' => 29, 'stock' => 150, 'image' => 'https://via.placeholder.com/150?text=Salt'],
                ['name' => 'Eggs', 'desc' => 'Tray of 30 eggs', 'price' => 199, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Eggs'],
                ['name' => 'Milk', 'desc' => '1L fresh milk', 'price' => 99, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Milk'],
            ],
            'Beauty' => [
                ['name' => 'Body Lotion', 'desc' => 'Hydrating body lotion', 'price' => 299, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Lotion'],
                ['name' => 'Hair Gel', 'desc' => 'Strong hold hair gel', 'price' => 199, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Gel'],
                ['name' => 'Face Wash', 'desc' => 'Gentle face wash', 'price' => 249, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Face+Wash'],
                ['name' => 'Sunscreen', 'desc' => 'SPF 50 sunscreen', 'price' => 399, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Sunscreen'],
                ['name' => 'Makeup Remover', 'desc' => 'Oil-free makeup remover', 'price' => 199, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Remover'],
                ['name' => 'Lipstick', 'desc' => 'Matte lipstick', 'price' => 299, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Lipstick'],
                ['name' => 'Shampoo', 'desc' => 'Herbal shampoo', 'price' => 199, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Shampoo'],
                ['name' => 'Face Cream', 'desc' => 'Moisturizing face cream', 'price' => 399, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Cream'],
                ['name' => 'Perfume', 'desc' => 'Floral perfume', 'price' => 799, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Perfume'],
                ['name' => 'Nail Polish', 'desc' => 'Glossy nail polish', 'price' => 149, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Nail+Polish'],
            ],
            'Sports' => [
                ['name' => 'Jump Rope', 'desc' => 'Speed jump rope', 'price' => 149, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Jump+Rope'],
                ['name' => 'Golf Balls', 'desc' => 'Pack of 12 golf balls', 'price' => 399, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Golf+Balls'],
                ['name' => 'Swim Goggles', 'desc' => 'Anti-fog swim goggles', 'price' => 299, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Goggles'],
                ['name' => 'Badminton Set', 'desc' => '2 rackets and shuttlecocks', 'price' => 599, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Badminton'],
                ['name' => 'Resistance Bands', 'desc' => 'Set of resistance bands', 'price' => 499, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Bands'],
                ['name' => 'Basketball', 'desc' => 'Official size basketball', 'price' => 599, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Basketball'],
                ['name' => 'Tennis Racket', 'desc' => 'Lightweight tennis racket', 'price' => 999, 'stock' => 20, 'image' => 'https://via.placeholder.com/150?text=Racket'],
                ['name' => 'Yoga Mat', 'desc' => 'Non-slip yoga mat', 'price' => 399, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Yoga+Mat'],
                ['name' => 'Football', 'desc' => 'Durable football', 'price' => 499, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Football'],
                ['name' => 'Water Bottle', 'desc' => 'Insulated water bottle', 'price' => 299, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Bottle'],
            ],
            'Automotive' => [
                ['name' => 'Windshield Wiper', 'desc' => 'Universal wiper blade', 'price' => 299, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Wiper'],
                ['name' => 'Car Mat', 'desc' => 'Set of 4 car mats', 'price' => 799, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Car+Mat'],
                ['name' => 'Jumper Cables', 'desc' => 'Heavy duty jumper cables', 'price' => 599, 'stock' => 20, 'image' => 'https://via.placeholder.com/150?text=Jumper'],
                ['name' => 'Steering Wheel Cover', 'desc' => 'Leather steering wheel cover', 'price' => 499, 'stock' => 25, 'image' => 'https://via.placeholder.com/150?text=Steering'],
                ['name' => 'Car Vacuum', 'desc' => 'Portable car vacuum cleaner', 'price' => 999, 'stock' => 15, 'image' => 'https://via.placeholder.com/150?text=Vacuum'],
                ['name' => 'Car Wax', 'desc' => 'Premium car wax', 'price' => 399, 'stock' => 30, 'image' => 'https://via.placeholder.com/150?text=Wax'],
                ['name' => 'Motor Oil', 'desc' => 'Synthetic motor oil', 'price' => 799, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Oil'],
                ['name' => 'Air Freshener', 'desc' => 'Car air freshener', 'price' => 99, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Freshener'],
                ['name' => 'Tire Inflator', 'desc' => 'Portable tire inflator', 'price' => 1499, 'stock' => 15, 'image' => 'https://via.placeholder.com/150?text=Inflator'],
                ['name' => 'Car Cover', 'desc' => 'Waterproof car cover', 'price' => 1999, 'stock' => 10, 'image' => 'https://via.placeholder.com/150?text=Cover'],
            ],
            'Pets' => [
                ['name' => 'Dog Leash', 'desc' => 'Adjustable dog leash', 'price' => 199, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Leash'],
                ['name' => 'Cat Toy', 'desc' => 'Interactive cat toy', 'price' => 99, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Cat+Toy'],
                ['name' => 'Pet Carrier', 'desc' => 'Soft pet carrier bag', 'price' => 599, 'stock' => 20, 'image' => 'https://via.placeholder.com/150?text=Carrier'],
                ['name' => 'Dog Collar', 'desc' => 'Reflective dog collar', 'price' => 149, 'stock' => 40, 'image' => 'https://via.placeholder.com/150?text=Collar'],
                ['name' => 'Fish Food', 'desc' => 'Tropical fish food', 'price' => 49, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Fish+Food'],
                ['name' => 'Dog Food', 'desc' => 'Premium dog food', 'price' => 499, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Dog+Food'],
                ['name' => 'Cat Litter', 'desc' => 'Clumping cat litter', 'price' => 299, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Cat+Litter'],
                ['name' => 'Bird Cage', 'desc' => 'Spacious bird cage', 'price' => 999, 'stock' => 20, 'image' => 'https://via.placeholder.com/150?text=Bird+Cage'],
                ['name' => 'Fish Tank', 'desc' => 'Glass fish tank', 'price' => 1499, 'stock' => 10, 'image' => 'https://via.placeholder.com/150?text=Fish+Tank'],
                ['name' => 'Pet Shampoo', 'desc' => 'Gentle pet shampoo', 'price' => 199, 'stock' => 50, 'image' => 'https://via.placeholder.com/150?text=Pet+Shampoo'],
            ],
            'Others' => [
                ['name' => 'Keychain', 'desc' => 'Metal keychain', 'price' => 49, 'stock' => 120, 'image' => 'https://via.placeholder.com/150?text=Keychain'],
                ['name' => 'Sticky Notes', 'desc' => 'Pack of sticky notes', 'price' => 29, 'stock' => 200, 'image' => 'https://via.placeholder.com/150?text=Sticky+Notes'],
                ['name' => 'Pen', 'desc' => 'Ballpoint pen', 'price' => 19, 'stock' => 300, 'image' => 'https://via.placeholder.com/150?text=Pen'],
                ['name' => 'Tape', 'desc' => 'Roll of adhesive tape', 'price' => 39, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Tape'],
                ['name' => 'Magnifier', 'desc' => 'Handheld magnifier', 'price' => 99, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Magnifier'],
                ['name' => 'Gift Card', 'desc' => 'Store gift card', 'price' => 500, 'stock' => 100, 'image' => 'https://via.placeholder.com/150?text=Gift+Card'],
                ['name' => 'Umbrella', 'desc' => 'Foldable umbrella', 'price' => 199, 'stock' => 60, 'image' => 'https://via.placeholder.com/150?text=Umbrella'],
                ['name' => 'Reusable Bag', 'desc' => 'Eco-friendly reusable bag', 'price' => 99, 'stock' => 200, 'image' => 'https://via.placeholder.com/150?text=Bag'],
                ['name' => 'Notebook', 'desc' => 'Spiral notebook', 'price' => 49, 'stock' => 300, 'image' => 'https://via.placeholder.com/150?text=Notebook'],
                ['name' => 'Flashlight', 'desc' => 'LED flashlight', 'price' => 299, 'stock' => 80, 'image' => 'https://via.placeholder.com/150?text=Flashlight'],
            ],
        ];

        $productId = 4000000;
        foreach ($categoryNames as $catIdx => $catName) {
            $catId = $categoryIds[$catIdx];
            $products = $productsByCategory[$catName];
            foreach ($products as $prod) {
                $userId = $userIds[array_rand($userIds)];
                $productId++;
                \DB::table('products')->insert([
                    'ProductID' => $productId,
                    'UserID' => $userId,
                    'CategoryID' => $catId,
                    'SKU' => 'SKU' . $productId,
                    'ProductName' => $prod['name'],
                    'Description' => $prod['desc'],
                    'Price' => $prod['price'],
                    'Stock' => $prod['stock'],
                    'Image' => $prod['image'],
                    'isActive' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Ensure each user has at least 2 products
        foreach ($userIds as $userId) {
            $userProductCount = \DB::table('products')->where('UserID', $userId)->count();
            $toAdd = max(0, 2 - $userProductCount);
            for ($j = 0; $j < $toAdd; $j++) {
                $catId = $categoryIds[array_rand($categoryIds)];
                $productId++;
                $stock = rand(1, 100);
                $price = rand(10, 9999) * (1 / ($stock / 100 + 1));
                \DB::table('products')->insert([
                    'ProductID' => $productId,
                    'UserID' => $userId,
                    'CategoryID' => $catId,
                    'SKU' => 'SKU' . $productId,
                    'ProductName' => 'Product' . $productId,
                    'Description' => 'Description for Product ' . $productId,
                    'Price' => round($price, 2),
                    'Stock' => $stock,
                    'Image' => 'https://via.placeholder.com/150',
                    'isActive' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
