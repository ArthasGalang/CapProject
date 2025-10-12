<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


use App\Http\Controllers\UsersController;
use App\Http\Controllers\AuthController;

Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/test', function() {
    return response()->json(['status' => 'API working']);
});