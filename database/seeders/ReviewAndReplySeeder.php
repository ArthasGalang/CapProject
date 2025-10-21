<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewAndReplySeeder extends Seeder
{
    public function run(): void
    {
        $products = DB::table('products')->get();
        $users = DB::table('users')->pluck('UserID')->toArray();
        $shops = DB::table('shops')->get(['ShopID', 'UserID']);
        if ($products->isEmpty() || empty($users) || $shops->isEmpty()) return;

        $reviews = [];
        $replies = [];
        foreach ($products as $product) {
            $numReviews = rand(0, 4);
            $reviewIds = [];
            for ($i = 0; $i < $numReviews; $i++) {
                $userId = $users[array_rand($users)];
                $reviewId = null; // We'll get this after insert
                $reviews[] = [
                    'UserID' => $userId,
                    'ProductID' => $product->ProductID,
                    'Rating' => rand(1, 5),
                    'Comment' => 'Review ' . ($i+1) . ' for product ' . $product->ProductID,
                    'ReviewDate' => now()->subDays(rand(0, 365)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        // Insert reviews and get their IDs
        $reviewChunks = array_chunk($reviews, 500);
        $insertedReviewIds = [];
        foreach ($reviewChunks as $chunk) {
            $startId = DB::table('reviews')->max('ReviewID') + 1;
            DB::table('reviews')->insert($chunk);
            // Get inserted IDs (assumes auto-increment is sequential)
            for ($i = 0; $i < count($chunk); $i++) {
                $insertedReviewIds[] = $startId + $i;
            }
        }
        // Now, for each review, maybe add a reply from the shop owner
        $allReviews = DB::table('reviews')->get();
        foreach ($allReviews as $review) {
            if (rand(0, 1) === 1) {
                // Find shop owner for this product
                $shop = $shops->firstWhere('ShopID', $products->firstWhere('ProductID', $review->ProductID)->ShopID);
                if ($shop) {
                    $replies[] = [
                        'UserID' => $shop->UserID,
                        'ReviewID' => $review->ReviewID,
                        'Comment' => 'Thank you for your review!',
                        'LikedBy' => json_encode([]),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        if (!empty($replies)) {
            $replyChunks = array_chunk($replies, 500);
            foreach ($replyChunks as $chunk) {
                DB::table('replies')->insert($chunk);
            }
        }
    }
}
