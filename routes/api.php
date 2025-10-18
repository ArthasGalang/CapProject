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
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrderController;


use App\Http\Controllers\CartController;
use App\Http\Controllers\AddressController;

Route::get('/addresses', [AddressController::class, 'getUserAddresses']);
use App\Http\Controllers\CartItemController;

Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/product/{ProductID}', [ProductController::class, 'show']);

Route::get('/cart-items/checkout', [CartController::class, 'getCheckoutItems']);
Route::post('/cart/add', [CartController::class, 'add']);
Route::post('/cart-items', [CartItemController::class, 'store']);
Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy']);
Route::post('/orders/multi-shop', [OrderController::class, 'storeMultiShop']);
Route::get('/orders/multi-shop', function() {
    return response()->json(['error' => 'GET not supported for this route. Use POST.'], 405);
});

Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/many', [ShopController::class, 'getMany']);
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

// Get average ratings for reviews
Route::get('/reviews/average-ratings', [ReviewController::class, 'averageRatings']);
Route::get('/cart-items', [CartItemController::class, 'index']);
Route::patch('/cart-items/{id}', [CartItemController::class, 'update']);