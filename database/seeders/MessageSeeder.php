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
                $message = $faker->sentence(rand(5, 15));
                $isRead = $faker->boolean(70);
                DB::table('usermessages')->insert([
                    'SenderID' => $sender,
                    'ReceiverID' => $receiver,
                    'MessageBody' => $message,
                    'IsRead' => $isRead,
                    'ReadAt' => $isRead ? $faker->dateTimeThisYear() : null,
                    'created_at' => $faker->dateTimeThisYear(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Admin messages (only ReceiverID, no SenderID)
        DB::table('adminmessages')->delete();
        $users = DB::table('users')->pluck('UserID')->toArray();
        $numAdmins = DB::table('admins')->count();
        $numMessages = $numAdmins > 0 ? rand(2, 5) * $numAdmins : 5;
        for ($i = 0; $i < $numMessages; $i++) {
            $receiver = $faker->randomElement($users);
            $message = $faker->sentence(rand(5, 15));
            $isRead = $faker->boolean(70);
            DB::table('adminmessages')->insert([
                'ReceiverID' => $receiver,
                'MessageBody' => $message,
                'IsRead' => $isRead,
                'ReadAt' => $isRead ? $faker->dateTimeThisYear() : null,
                'Incoming' => $faker->boolean(50),
                'created_at' => $faker->dateTimeThisYear(),
                'updated_at' => now(),
            ]);
        }

        // Announcements
        DB::table('announcement')->delete();
        $numAnnouncements = rand(3, 7);
        for ($i = 0; $i < $numAnnouncements; $i++) {
            $receiverCount = rand(2, count($users));
            $receiverIDs = $faker->randomElements($users, $receiverCount);
            $content = $faker->sentence(rand(10, 25));
            DB::table('announcement')->insert([
                'ReceiverIDs' => json_encode($receiverIDs),
                'Content' => $content,
                'created_at' => $faker->dateTimeThisYear(),
                'updated_at' => now(),
            ]);
        }
    }
}
