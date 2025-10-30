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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'UserID' => 'required|integer|exists:users,UserID',
            'HouseNumber' => 'required|string|max:255',
            'Street' => 'required|string|max:255',
            'Barangay' => 'required|string|max:255',
            'Municipality' => 'required|string|max:255',
            'ZipCode' => 'required|string|max:10',
        ]);

        $address = Address::create($validated);
        return response()->json($address, 201);
    }

    public function update(Request $request, $id)
    {
        $address = Address::find($id);
        if (!$address) {
            return response()->json(['error' => 'Address not found'], 404);
        }

        $validated = $request->validate([
            'HouseNumber' => 'sometimes|string|max:255',
            'Street' => 'sometimes|string|max:255',
            'Barangay' => 'sometimes|string|max:255',
            'Municipality' => 'sometimes|string|max:255',
            'ZipCode' => 'sometimes|string|max:10',
        ]);

        $address->update($validated);

        return response()->json([
            'success' => true,
            'address' => $address
        ]);
    }
}
