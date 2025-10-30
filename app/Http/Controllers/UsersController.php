<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class UsersController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,Email',
            'password' => 'required|string|min:6',
            'contactNumber' => 'required|string|max:20',
            'barangay' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'zipcode' => 'required|string|max:10',
            'houseNumber' => 'required|string|max:50',
            'street' => 'required|string|max:255',
        ]);

        $user = User::create([
            'FirstName' => $validated['firstName'],
            'LastName' => $validated['lastName'],
            'email' => $validated['email'],
            'Password' => bcrypt($validated['password']),
            'ContactNumber' => $validated['contactNumber'],
        ]);

        // Save address to addresses table and get AddressID
        $addressId = \DB::table('addresses')->insertGetId([
            'UserID' => $user->UserID,
            'Barangay' => $validated['barangay'],
            'Municipality' => $validated['municipality'],
            'HouseNumber' => $validated['houseNumber'],
            'ZipCode' => $validated['zipcode'],
            'Street' => $validated['street'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Set DefaultAddress in users table
        $user->DefaultAddress = $addressId;
        $user->save();

        // Trigger email verification
        event(new Registered($user));

        return response()->json(['message' => 'User registered successfully. Verification email sent.', 'address' => ['AddressID' => $addressId], 'user' => $user], 201);
    }
}
