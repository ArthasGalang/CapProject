<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [];
        $firstNames = ['John', 'Jane', 'Carlos', 'Emily', 'Ahmed', 'Sofia', 'Liam', 'Olivia', 'Noah'];
        $lastNames = ['Doe', 'Smith', 'Reyes', 'Tan', 'Ali', 'Garcia', 'Nguyen', 'Kim', 'Patel'];
        for ($i = 1; $i <= 9; $i++) {
            $users[] = [
                'FirstName' => $firstNames[$i-1],
                'LastName' => $lastNames[$i-1],
                'Email' => '123@' . $i,
                'Password' => bcrypt('123' . $i),
                'ContactNumber' => '09' . rand(100000000, 999999999),
                'ProfileImage' => null,
                'DefaultAddress' => null,
                'Status' => 'Offline',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('users')->insert($users);
    }
}
