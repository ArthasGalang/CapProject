<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Users;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = Users::where('Email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->Password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Prevent login if email is not verified
        if (empty($user->email_verified_at)) {
            return response()->json(['message' => 'Please verify your email before logging in.'], 403);
        }

        // If you want to use Sanctum, you need to extend Authenticatable in Users model and use HasApiTokens
        $token = null;
        if (method_exists($user, 'createToken')) {
            $token = $user->createToken('authToken')->plainTextToken;
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }
}