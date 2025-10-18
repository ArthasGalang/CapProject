<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



use App\Http\Controllers\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ShopController;


Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/products', [ProductsController::class, 'index']);
Route::get('/shops', [ShopController::class, 'index']);
Route::post('/shops', [ShopController::class, 'store']);

Route::get('/test', function() {
    return response()->json(['status' => 'API working']);
});

// Get all addresses for a user (preferred and only method)
Route::get('/user/{id}/addresses', function($id) {
    $addresses = \DB::table('addresses')->where('UserID', $id)->get();
    return response()->json($addresses);
});

// Check if user exists
Route::get('/check-user/{id}', function($id) {
    $user = \DB::table('users')->where('UserID', $id)->first();
    return response()->json(['exists' => !!$user]);
});