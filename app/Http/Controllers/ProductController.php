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
        // Query the product_details_view for product details (including Description)
        $row = \DB::table('product_details_view')->where('ProductID', $ProductID)->first();
        if (!$row) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Helper to normalize image fields: field may be JSON string or plain string
        $resolveImages = function ($val) {
            $out = [];
            if ($val === null) return $out;
            if (is_string($val)) {
                $trim = trim($val);
                $decoded = json_decode($trim, true);
                if (is_array($decoded)) {
                    $out = $decoded;
                } else {
                    $out = [$trim];
                }
            } elseif (is_array($val)) {
                $out = $val;
            }
            $normalized = array_map(function ($p) {
                if (!$p) return null;
                $p = trim($p, " \"'\n\r");
                if (preg_match('/^https?:\/\//i', $p)) return $p;
                $p = ltrim($p, '/\\');
                return '/storage/' . $p;
            }, $out);
            return array_values(array_filter($normalized));
        };

        // Build images array: primary Image then AdditionalImages
        $images = $resolveImages($row->Image ?? null);
        $additional = $resolveImages($row->AdditionalImages ?? null);
        $all = $images;
        foreach ($additional as $a) {
            if (!in_array($a, $all)) $all[] = $a;
        }
        if (empty($all)) {
            $all = ['https://via.placeholder.com/400x120?text=No+Image'];
        }

        // Normalize shop logo path
        $shopLogo = null;
        if (!empty($row->LogoImage)) {
            $logoArr = $resolveImages($row->LogoImage);
            $shopLogo = count($logoArr) ? $logoArr[0] : null;
        }

        $productData = [
            'title' => $row->ProductName,
            'price' => $row->Price,
            'sold' => (int) ($row->Sold ?? 0),
            'images' => $all,
            'description' => $row->Description ?? '',
            'shopName' => $row->Shop,
            'shopLogo' => $shopLogo,
            'ownerName' => $row->User,
            'shopId' => $row->ShopID ?? null,
            'Description' => $row->Description ?? '',
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
        // Store Image as a JSON array (even if only one image)
        if ($request->file('Image')) {
            $mainImagePath = $request->file('Image')->store('products', 'public');
            $product->Image = json_encode([$mainImagePath]);
        } else if ($request->input('Image')) {
            $img = $request->input('Image');
            $product->Image = is_array($img) ? json_encode($img) : json_encode([$img]);
        } else {
            $product->Image = json_encode([]);
        }
        $product->SoldAmount = 0;
        $product->Discount = 0;
        $product->IsFeatured = false;
        $product->AdditionalImages = json_encode($request->file('AdditionalImages') ? array_map(function($file) { return $file->store('products', 'public'); }, $request->file('AdditionalImages')) : $request->input('AdditionalImages', []));
    $product->Attributes = json_encode([]);
        $product->PublishedAt = now()->toDateString();
        $product->IsActive = true;
        $product->Status = $validated['Status'];
        $product->BoughtBy = json_encode([]);
        $product->Tags = json_encode([]);
        $product->save();

        return response()->json($product, 201);
    }
}
