<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



use App\Http\Controllers\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;


Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/shops', [ShopController::class, 'index']);
Route::post('/shops', [ShopController::class, 'store']);
Route::delete('/shops/{id}', function($id) {
    $shop = \DB::table('shops')->where('ShopID', $id);
    if ($shop->exists()) {
        $shop->delete();
        return response()->json(['success' => true]);
    } else {
        return response()->json(['error' => 'Shop not found'], 404);
    }
});

Route::get('/test', function() {
    return response()->json(['status' => 'API working']);
});

// Get all categories
Route::get('/categories', function() {
    $categories = \DB::table('categories')->get();
    return response()->json($categories);
});

// Get all addresses for a user
Route::get('/user/{id}/addresses', function($id) {
    $addresses = \DB::table('addresses')->where('UserID', $id)->get();
    return response()->json($addresses);
});

// Add a new address for a user
Route::post('/user/{id}/addresses', function(Request $request, $id) {
    $validated = $request->validate([
        'Street' => 'required|string|max:255',
        'Barangay' => 'required|string|max:255',
        'Municipality' => 'required|string|max:255',
        'HouseNumber' => 'required|string|max:50',
        'ZipCode' => 'required|string|max:10',
    ]);
    $addressId = \DB::table('addresses')->insertGetId([
        'UserID' => $id,
        'Street' => $validated['Street'],
        'Barangay' => $validated['Barangay'],
        'Municipality' => $validated['Municipality'],
        'HouseNumber' => $validated['HouseNumber'],
        'ZipCode' => $validated['ZipCode'],
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    $address = \DB::table('addresses')->where('AddressID', $addressId)->first();
    return response()->json($address, 201);
});

// Check if user exists
Route::get('/check-user/{id}', function($id) {
    $user = \DB::table('users')->where('UserID', $id)->first();
    return response()->json(['exists' => !!$user]);
});