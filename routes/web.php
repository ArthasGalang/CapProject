<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\UsersController;


Route::get('/', function () {
    return Inertia::render('Landing'); 
});

Route::get('/product', function () {
    return Inertia::render('ProductDetails');
});

Route::get('/cart', function () {
    return Inertia::render('Cart');
});

Route::get('/order-history', function () {
    return Inertia::render('OrderHistory');
});

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/terms', function () {
    return Inertia::render('TermsAndConditions');
});

Route::get('/browse', function () {
    return Inertia::render('BrowseProducts');
});

Route::get('/checkout', function () {
    return Inertia::render('CheckoutPage');
});

Route::get('/browse-shops', function () {
    return Inertia::render('BrowseShop');
});

Route::get('/account', function () {
    return Inertia::render('Account');
});

Route::get('/shop', function () {
    return Inertia::render('PageShop');
});



Route::get('/eshop/{id}/dashboard', function ($id) {
    return Inertia::render('ShopDashboard', ['shopId' => $id]);
});
Route::get('/eshop/{id}/products', function ($id) {
    return Inertia::render('ShopProducts', ['shopId' => $id]);
});
Route::get('/eshop/{id}/orders', function ($id) {
    return Inertia::render('ShopOrders', ['shopId' => $id]);
});

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
});

// ->middleware(['auth', 'verified', 'admin'])->name('admin.dashboard');

Route::get('/admin/messages', function () {
    return Inertia::render('Admin/Messages');
});
Route::get('/admin/reports', function () {
    return Inertia::render('Admin/Reports');
});
Route::get('/admin/user-management', function () {
    return Inertia::render('Admin/UserManagement');
});
Route::get('/admin/settings', function () {
    return Inertia::render('Admin/Settings');
});




Route::get('/users', [UsersController::class, 'index']);
