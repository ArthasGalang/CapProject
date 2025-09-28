<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\UsersController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';

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


Route::get('/shop', function () {
    return Inertia::render('ShopDashboard');
});
Route::get('/shop/products', function () {
    return Inertia::render('ShopProducts');
});
Route::get('/shop/orders', function () {
    return Inertia::render('ShopOrders');
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