<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('reports')->delete();
        $faker = Faker::create();
        $users = DB::table('users')->get();
        $targetTypes = ['User', 'Shop', 'Product', 'Order', 'Other'];
    $reportStatuses = ['Pending', 'In Review', 'Resolved', 'Rejected'];
        $reasons = [
            'Spam', 'Inappropriate Content', 'Fraud', 'Abuse', 'Other',
            'Fake Listing', 'Scam', 'Offensive Language', 'Copyright Violation', 'Harassment'
        ];
        foreach ($users as $user) {
            $reportCount = rand(0, 3);
            for ($i = 0; $i < $reportCount; $i++) {
                $targetType = $faker->randomElement($targetTypes);
                $targetID = match ($targetType) {
                    'User' => DB::table('users')->inRandomOrder()->value('UserID') ?? 1,
                    'Shop' => DB::table('shops')->inRandomOrder()->value('ShopID') ?? 1,
                    'Product' => DB::table('products')->inRandomOrder()->value('ProductID') ?? 1,
                    'Order' => DB::table('orders')->inRandomOrder()->value('OrderID') ?? 1,
                    default => (string)rand(1, 100),
                };
                DB::table('reports')->insert([
                    'UserID' => $user->UserID,
                    'Reason' => $faker->randomElement($reasons),
                    'ReportStatus' => $faker->randomElement($reportStatuses),
                    'ReportDate' => $faker->date(),
                    'AdminResponse' => $faker->boolean(60) ? $faker->sentence() : '',
                    'ReportedLink' => $faker->url(),
                    'TargetType' => $targetType,
                    'TargetID' => (string)$targetID,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
