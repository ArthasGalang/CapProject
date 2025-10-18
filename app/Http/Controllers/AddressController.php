<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Address;

class AddressController extends Controller
{
    public function getUserAddresses(Request $request)
    {
        $userId = $request->input('user_id');
        if (!$userId) {
            return response()->json([], 400);
        }
        $addresses = Address::where('UserID', $userId)->get();
        return response()->json($addresses);
    }
}
