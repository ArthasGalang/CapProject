<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;

class ProductController extends Controller {
    // Get products by shop_id
    public function index(Request $request)
    {
        $shopId = $request->query('shop_id');
        $query = Product::query();
        if ($shopId) {
            $query->where('ShopID', $shopId);
        }
        // Join with categories to get CategoryName for frontend grouping
        $products = $query->leftJoin('categories', 'products.CategoryID', '=', 'categories.CategoryID')
            ->select('products.*', 'categories.CategoryName')
            ->get();
        return response()->json($products);
    }

    // Store new product
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
