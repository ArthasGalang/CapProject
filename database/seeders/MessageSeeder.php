<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        // User messages
        DB::table('usermessages')->delete();
        $faker = Faker::create();
        $users = DB::table('users')->pluck('UserID')->toArray();
        foreach ($users as $sender) {
            $receivers = array_diff($users, [$sender]);
            $numMessages = rand(2, 6);
            for ($i = 0; $i < $numMessages; $i++) {
                $receiver = $faker->randomElement($receivers);
                DB::table('usermessages')->insert([
                    'SenderID' => $sender,
                    'ReceiverID' => $receiver,
                    'MessageBody' => $faker->sentence(rand(5, 15)),
                    'IsRead' => $faker->boolean(70),
                    'ReadAt' => $faker->optional(0.7)->dateTimeThisYear(),
                    'created_at' => $faker->dateTimeThisYear(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Shop messages
        DB::table('shopmessages')->delete();
        $shops = DB::table('shops')->pluck('ShopID')->toArray();
        foreach ($shops as $shop) {
            $numMessages = rand(2, 5);
            for ($i = 0; $i < $numMessages; $i++) {
                $receiver = $faker->randomElement($users);
                DB::table('shopmessages')->insert([
                    'SenderID' => $shop,
                    'ReceiverID' => $receiver,
                    'MessageBody' => $faker->sentence(rand(5, 15)),
                    'IsRead' => $faker->boolean(70),
                    'ReadAt' => $faker->optional(0.7)->dateTimeThisYear(),
                    'created_at' => $faker->dateTimeThisYear(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Announcements
        DB::table('announcement')->delete();
        $numAnnouncements = rand(3, 7);
        for ($i = 0; $i < $numAnnouncements; $i++) {
            $receiverCount = rand(2, count($users));
            $receiverIDs = $faker->randomElements($users, $receiverCount);
            DB::table('announcement')->insert([
                'ReceiverIDs' => json_encode($receiverIDs),
                'Content' => $faker->sentence(rand(10, 25)),
                'created_at' => $faker->dateTimeThisYear(),
                'updated_at' => now(),
            ]);
        }
    }
}
