<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        // Get all user IDs
        $userIds = DB::table('users')->pluck('UserID')->toArray();
        if (count($userIds) === 0) return;

        $streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple St', 'Elm St', 'Cedar Ave', 'Spruce Rd', 'Birch St', 'Willow Ave', 'Aspen Rd', 'Palm St', 'Cypress Ave', 'Magnolia Rd', 'Poplar St', 'Sycamore Ave'];
        $barangays = ['Central', 'North', 'East', 'West', 'South'];
        $municipalities = ['Metro City', 'Greenfield', 'Lakeside', 'Hilltown', 'Riverside'];
        $addresses = [];
        for ($i = 0; $i < 15; $i++) {
            $userId = $userIds[$i % count($userIds)]; // Distribute addresses among users
            $addresses[] = [
                'UserID' => $userId,
                'Street' => $streets[$i % count($streets)],
                'Barangay' => $barangays[$i % count($barangays)],
                'Municipality' => $municipalities[$i % count($municipalities)],
                'HouseNumber' => (string)(100 + $i),
                'ZipCode' => '100' . ($i % 10),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('addresses')->insert($addresses);
    }
}
