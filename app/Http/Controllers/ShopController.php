<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
	// Return all shops as JSON for BrowseShop
	public function index(Request $request)
	{
		$shops = Shop::all();
		return response()->json($shops);
	}

	// Return count of shops with isVerified = 0
	public function pendingVerificationsCount()
	{
		$count = Shop::where('isVerified', 0)->count();
		return response()->json(['pending_verifications' => $count]);
	}

	// Register a new shop
	public function store(Request $request)
	{
	\Log::info('ShopController@store incoming request', $request->all());
	$validated = $request->validate([
			'UserID' => 'required|integer',
			'ShopName' => 'required|string',
			'ShopDescription' => 'required|string',
			'hasPhysical' => 'boolean',
			'LogoImage' => 'nullable|file|image',
			'BackgroundImage' => 'nullable|file|image',
			'BusinessPermit' => 'nullable|file|image',
			'AddressID' => 'required|integer',
			// Address fields (now optional)
			'houseNumber' => 'nullable|string|max:50',
			'street' => 'nullable|string|max:255',
			'barangay' => 'nullable|string|max:255',
			'municipality' => 'nullable|string|max:255',
			'zipcode' => 'nullable|string|max:10',
		]);

		// Use AddressID from request if provided, else create new address if all fields are present
		$addressId = $validated['AddressID'];

		$data = $validated;
		// Handle file uploads
		foreach ([['LogoImage', 'logos'], ['BackgroundImage', 'banners'], ['BusinessPermit', 'permits']] as [$field, $folder]) {
			if ($request->hasFile($field)) {
				$data[$field] = $request->file($field)->store("shops/$folder", 'public');
			} else {
				$data[$field] = null;
			}
		}
		// Ensure AddressID is set right before create
		$data['AddressID'] = $addressId;
	$shop = \App\Models\Shop::create($data);
		return response()->json(['success' => true, 'shop' => $shop], 201);
	}

	// GET /api/shops?ids=1,2,3
	public function getMany(Request $request)
	{
		$ids = $request->query('ids');
		if (!$ids) return response()->json([]);
		$idArr = explode(',', $ids);
		$shops = \App\Models\Shop::whereIn('ShopID', $idArr)->get();
		return response()->json($shops);
	}

	// Update shop details
	public function update(Request $request, $id)
	{
		$shop = Shop::find($id);
		if (!$shop) {
			return response()->json(['error' => 'Shop not found'], 404);
		}

		$validated = $request->validate([
			'ShopName' => 'sometimes|string|max:255',
			'ShopDescription' => 'sometimes|string',
			'Verification' => 'sometimes|in:Verified,Pending,Rejected',
			'hasPhysical' => 'sometimes|boolean',
			'LogoImage' => 'sometimes|nullable|file|image|max:2048',
			'BackgroundImage' => 'sometimes|nullable|file|image|max:2048',
			'BusinessPermit' => 'sometimes|nullable|file|image|max:2048',
		]);

		// Handle file uploads
		if ($request->hasFile('LogoImage')) {
			// Delete old logo if exists
			if ($shop->LogoImage && \Storage::disk('public')->exists($shop->LogoImage)) {
				\Storage::disk('public')->delete($shop->LogoImage);
			}
			$validated['LogoImage'] = $request->file('LogoImage')->store('shops/logos', 'public');
		}

		if ($request->hasFile('BackgroundImage')) {
			// Delete old background if exists
			if ($shop->BackgroundImage && \Storage::disk('public')->exists($shop->BackgroundImage)) {
				\Storage::disk('public')->delete($shop->BackgroundImage);
			}
			$validated['BackgroundImage'] = $request->file('BackgroundImage')->store('shops/banners', 'public');
		}

		if ($request->hasFile('BusinessPermit')) {
			// Delete old permit if exists
			if ($shop->BusinessPermit && \Storage::disk('public')->exists($shop->BusinessPermit)) {
				\Storage::disk('public')->delete($shop->BusinessPermit);
			}
			$validated['BackgroundImage'] = $request->file('BusinessPermit')->store('shops/permits', 'public');
		}

		$shop->update($validated);

		return response()->json([
			'success' => true,
			'shop' => $shop,
			'BackgroundImage' => $shop->BackgroundImage,
			'LogoImage' => $shop->LogoImage,
			'BusinessPermit' => $shop->BusinessPermit
		]);
	}
}
