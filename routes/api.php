
<?php
use Illuminate\Http\Request;
// User Management API: Return all users
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopOrderController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AddressController;
use App\Models\User;
use App\Http\Controllers\UserMessageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminMessageController;
// User messages API (for chat)

Route::patch('user/{id}/ban', function($id) {
    $updated = DB::table('users')->where('UserID', $id)->update(['Status' => 'Banned', 'updated_at' => now()]);
    if ($updated) {
        return response()->json(['success' => true]);
    } else {
        return response()->json(['error' => 'User not found'], 404);
    }
});
Route::get('/usermessages', [UserMessageController::class, 'index']);
Route::post('/usermessages', [UserMessageController::class, 'store']);
Route::post('/usermessages/read', [UserMessageController::class, 'markAsRead']);
Route::get('/reports/open-count', [ReportController::class, 'openReportsCount']);
Route::get('/adminmessages/unread-count', [AdminMessageController::class, 'unreadCount']);
Route::get('/reports', function() {
    $reports = DB::table('reports')->get();
    return response()->json($reports);
});
Route::get('/reports/view', function() {
    $reports = DB::select('SELECT * FROM reports_view');
    return response()->json($reports);
});
Route::put('/orders/{order}/status', [App\Http\Controllers\ShopOrderController::class, 'updateStatus']);

Route::get('/users', [App\Http\Controllers\UsersController::class, 'index']);

Route::get('/top_products_by_shop', function (\Illuminate\Http\Request $request) {
    $shopId = $request->query('shop_id');
    if (!$shopId) {
        return response()->json([]);
    }
    $results = DB::select('SELECT * FROM top_products_by_shop WHERE ShopID = ? ORDER BY UnitsSold DESC', [$shopId]);
    return response()->json($results);
});

Route::get('/reports/{id}', function($id) {
    $report = \DB::table('reports')->where('ReportID', $id)->first();
    if ($report) {
        return response()->json($report);
    } else {
        return response()->json(['error' => 'Report not found'], 404);
    }
});

Route::get('/reviews_with_replies/{ProductID}', function($ProductID) {
    $results = DB::select('SELECT * FROM reviews_with_replies WHERE ProductID = ?', [$ProductID]);
    return response()->json($results);
});
// Announcements API (dummy, replace with real data as needed)
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AnnouncementController;
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/announcements', [AnnouncementController::class, 'store']);

Route::get('/shop_dashboard_view', function () {
    $data = DB::select('SELECT * FROM shop_dashboard_view');
    return response()->json($data);
});

Route::get('/user/{id}', function($id) {
    $user = User::find($id);
    if (!$user) return response()->json(['error' => 'User not found'], 404);
    return response()->json([
        'FirstName' => $user->FirstName,
        'LastName' => $user->LastName,
        'UserID' => $user->UserID
    ]);
});



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Chat message routes (no auth for testing)
Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);


Route::get('/addresses', [AddressController::class, 'getUserAddresses']);
Route::post('/addresses', [AddressController::class, 'store']);
Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/shop-orders', [ShopOrderController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/product/{ProductID}', [ProductController::class, 'show']);

Route::get('/cart-items/checkout', [CartController::class, 'getCheckoutItems']);
Route::post('/cart/add', [CartController::class, 'add']);
Route::post('/cart-items', [CartItemController::class, 'store']);
Route::delete('/cart-items/{id}', [CartItemController::class, 'destroy']);

// Orders API: Get authenticated user's orders with items and products
Route::get('/orders', [OrderController::class, 'userOrders']);
Route::post('/orders/multi-shop', [OrderController::class, 'store']);
Route::get('/orders/multi-shop', function() {
    return response()->json(['error' => 'GET not supported for this route. Use POST.'], 405);
});

Route::get('/order-items', function(Request $request) {
    $orderId = $request->query('order_id');
    if (!$orderId) {
        return response()->json(['error' => 'order_id required'], 400);
    }
    $items = \DB::table('order_items')->where('OrderID', $orderId)->get();
    return response()->json($items);
});

Route::get('/products/{id}', function($id) {
    $product = \DB::table('products')->where('ProductID', $id)->first();
    if ($product) {
        return response()->json($product);
    } else {
        return response()->json(['error' => 'Product not found'], 404);
    }
});

Route::get('/order-details', function(Request $request) {
    $userId = $request->query('user_id');
    if (!$userId) {
        return response()->json(['error' => 'user_id required'], 400);
    }
    $details = \DB::select('SELECT * FROM user_order_details WHERE UserID = ?', [$userId]);
    return response()->json(['order_details' => $details]);
});

Route::get('/addresses/{id}', function($id) {
    $address = \DB::table('addresses')->where('AddressID', $id)->first();
    if ($address) {
        return response()->json($address);
    } else {
        return response()->json(['error' => 'Address not found'], 404);
    }
});

Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/many', [ShopController::class, 'getMany']);
// Get count of shops with isVerified = 0
Route::get('/shops/pending-verifications', [ShopController::class, 'pendingVerificationsCount']);
Route::get('/shops/{id}', function($id) {
    $shop = \DB::table('shops')->where('ShopID', $id)->first();
    if ($shop) {
        return response()->json($shop);
    } else {
        return response()->json(['error' => 'Shop not found'], 404);
    }
});
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

// PATCH route for updating shop Verification status
Route::patch('/shops/{id}', function(Request $request, $id) {
    $verification = $request->input('Verification');
    if (!in_array($verification, ['Verified', 'Pending', 'Rejected'])) {
        return response()->json(['error' => 'Invalid status'], 400);
    }
    $updated = \DB::table('shops')->where('ShopID', $id)->update(['Verification' => $verification, 'updated_at' => now()]);
    if ($updated) {
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

// Get cart items count for a specific user (compatibility)
Route::get('/user/{id}/cart-items/count', function($id) {
    $count = \DB::table('cart_items')->where('UserID', $id)->count();
    return response()->json(['count' => $count]);
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

// Delete an address by ID
Route::delete('/addresses/{id}', function($id) {
    $deleted = \DB::table('addresses')->where('AddressID', $id)->delete();
    if ($deleted) {
        return response()->json(['success' => true]);
    } else {
        return response()->json(['error' => 'Address not found'], 404);
    }
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

// Get cart items count for authenticated user
Route::middleware('auth:sanctum')->get('/cart-items/count', [CartController::class, 'countForAuthUser']);