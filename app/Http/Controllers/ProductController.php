<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;

class ProductController extends Controller {
    // Get products by shop_id
    public function index(Request $request)
    {
        $shopId = $request->query('shop_id') ?? $request->query('shopId');
        $page = (int) $request->query('page', 1);
        $limit = (int) ($request->query('limit') ?? $request->query('perPage') ?? 20);
        $query = Product::query();
        if ($shopId) {
            $query->where('ShopID', $shopId);
            // If shopId is present, return ALL products for that shop (no pagination)
            $products = $query->leftJoin('categories', 'products.CategoryID', '=', 'categories.CategoryID')
                ->select('products.*', 'categories.CategoryName')
                ->get();
            return response()->json($products);
        }
        // If limit is very high (e.g., 9999), return all products (no pagination)
        if ($limit >= 9999) {
            $products = $query->leftJoin('categories', 'products.CategoryID', '=', 'categories.CategoryID')
                ->select('products.*', 'categories.CategoryName')
                ->get();
            return response()->json($products);
        }
        // Default: paginated for all products
        $products = $query->leftJoin('categories', 'products.CategoryID', '=', 'categories.CategoryID')
            ->select('products.*', 'categories.CategoryName')
            ->skip(($page - 1) * $limit)
            ->take($limit)
            ->get();
        return response()->json($products);
    }

    // Get product by ProductID
    public function show($ProductID)
    {
        $product = Product::where('ProductID', $ProductID)->first();
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Get average rating from reviews
        $avgRating = 0;
        $reviewData = \DB::table('reviews')
            ->where('ProductID', $ProductID)
            ->selectRaw('AVG(Rating) as avg_rating')
            ->first();
        if ($reviewData && $reviewData->avg_rating) {
            $avgRating = round($reviewData->avg_rating, 2);
        }

        // Sold amount from BoughtBy field
        $sold = 0;
        if ($product->BoughtBy) {
            try {
                $arr = is_string($product->BoughtBy) ? json_decode($product->BoughtBy, true) : $product->BoughtBy;
                if (is_array($arr)) $sold = count($arr);
            } catch (\Exception $e) { $sold = 0; }
        }

        // Shop info
        $shop = \App\Models\Shop::where('ShopID', $product->ShopID)->first();
        $shopName = $shop ? $shop->ShopName : '';
        $shopLogo = $shop ? $shop->LogoImage : null;
        $owner = $shop ? \App\Models\User::where('UserID', $shop->UserID)->first() : null;
        $ownerName = $owner ? ($owner->FirstName . ' ' . $owner->LastName) : '';

        $productData = [
            'title' => $product->ProductName,
            'price' => $product->Price,
            'rating' => $avgRating,
            'sold' => $sold,
            'images' => [
                $product->Image ?? 'https://via.placeholder.com/400x120?text=Main+Image',
                'https://via.placeholder.com/80x120?text=Thumb1',
                'https://via.placeholder.com/80x120?text=Thumb2',
                'https://via.placeholder.com/80x120?text=Thumb3',
                'https://via.placeholder.com/80x120?text=Thumb4',
                'https://via.placeholder.com/80x120?text=Thumb5',
            ],
            'description' => $product->Description,
            'shopName' => $shopName,
            'shopLogo' => $shopLogo,
            'ownerName' => $ownerName,
            'shopId' => $product->ShopID,
        ];
        return response()->json($productData);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ShopID' => 'required|integer',
            'CategoryID' => 'required|integer',
            'SKU' => 'required|string',
            'ProductName' => 'required|string',
            'Description' => 'required|string',
            'Price' => 'required|numeric',
            'Stock' => 'required|integer',
            'Image' => 'nullable',
            'AdditionalImages' => 'nullable',
            'Status' => 'required|string',
        ]);

        $product = new Product();
        $product->ShopID = $validated['ShopID'];
        $product->CategoryID = $validated['CategoryID'];
        $product->SKU = $validated['SKU'];
        $product->ProductName = $validated['ProductName'];
        $product->Description = $validated['Description'];
        $product->Price = $validated['Price'];
        $product->Stock = $validated['Stock'];
        $product->Image = $request->file('Image') ? $request->file('Image')->store('products', 'public') : $request->input('Image');
        $product->SoldAmount = 0;
        $product->Discount = 0;
        $product->IsFeatured = false;
        $product->AdditionalImages = json_encode($request->file('AdditionalImages') ? array_map(function($file) { return $file->store('products', 'public'); }, $request->file('AdditionalImages')) : $request->input('AdditionalImages', []));
        $product->Attributes = '';
        $product->PublishedAt = now()->toDateString();
        $product->IsActive = true;
        $product->Status = $validated['Status'];
        $product->BoughtBy = '';
        $product->Tags = '';
        $product->save();

        return response()->json($product, 201);
    }
}
