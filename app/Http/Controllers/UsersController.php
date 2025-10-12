<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Users;

class UsersController extends Controller
{
    public function index()
    {
        return response()->json(Users::all());
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
        ]);

        $user = Users::create([
            'FirstName' => $validated['firstName'],
            'LastName' => $validated['lastName'],
            'Email' => $validated['email'],
            'Password' => bcrypt($validated['password']),
            'ContactNumber' => $validated['contactNumber'],
            // Address fields can be stored in a separate table if needed
        ]);

        return response()->json(['message' => 'User registered successfully.'], 201);
    }
}
