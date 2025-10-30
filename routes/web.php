
<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;

use App\Http\Controllers\UsersController;

Route::get('/auth/login', function (\Illuminate\Http\Request $request) {
    $id = $request->query('id');
    $hash = $request->query('hash');
    if ($id && $hash) {
        $user = User::find($id);
        if ($user && sha1($user->getEmailForVerification()) === $hash) {
            if (!$user->email_verified_at) {
                $user->email_verified_at = Carbon::now();
                $user->save();
            }
            return redirect('/?verified=1&showLoginModal=1');
        }
    }
    return redirect('/?showLoginModal=1');
});

Route::get('/', function () {
    return Inertia::render('Landing'); 
});

Route::get('/login', function() {
    return redirect('/?showLoginModal=1');
});
Route::get('/product', function () {
    return Inertia::render('ProductDetails');
});

Route::get('/product/{ProductID}', function ($ProductID) {
    return Inertia::render('ProductDetails', ['ProductID' => $ProductID]);
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

use Illuminate\Http\Request;

Route::get('/checkout', function (Request $request) {
    return Inertia::render('CheckoutPage', [
        'userId' => $request->input('userId'),
        'selectedCartItemIds' => $request->input('selectedCartItemIds'),
        'total' => $request->input('total'),
    ]);
});

Route::get('/browse-shops', function () {
    return Inertia::render('BrowseShop');
});

Route::get('/account', function () {
    return Inertia::render('Account');
});

// Real-time chat test page
Route::get('/chat-test', function () {
    return Inertia::render('ChatTest');
});

Route::get('/account/info', function () {
    return Inertia::render('AccountInfo');
});


Route::get('/account/orders', function () {
    return Inertia::render('AccountOrders');
});

Route::get('/account/addresses', function () {
    return Inertia::render('AccountAddresses');
});

Route::get('/account/settings', function () {
    return Inertia::render('AccountSettings');
});


Route::get('/shop/{id}', function ($id) {
    return Inertia::render('PageShop', ['shopId' => $id]);
});



Route::get('/eshop/{id}/dashboard', function ($id) {
    return Inertia::render('ShopDashboard', ['shopId' => $id]);
});
Route::get('/eshop/{id}/details', function ($id) {
    return Inertia::render('ShopDetails', ['shopId' => $id]);
});
Route::get('/eshop/{id}/products', function ($id) {
    return Inertia::render('ShopProducts', ['shopId' => $id]);
});
Route::get('/eshop/{id}/orders', function ($id) {
    return Inertia::render('ShopOrders', ['shopId' => $id]);
});
Route::get('/eshop/{id}/settings', function ($id) {
    return Inertia::render('ShopSettings', ['shopId' => $id]);
});

Route::get('/admin/login', function () {
    return Inertia::render('AdminLogin');
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


Route::get('/admin/shop-management', function() {
    return Inertia::render('Admin/ShopManagement');
});




use App\Http\Controllers\AddressController;
Route::get('/api/addresses', [AddressController::class, 'getUserAddresses']);
Route::get('/users', [UsersController::class, 'index']);

// Auth routes for Breeze (including email verification)
require __DIR__.'/auth.php';
