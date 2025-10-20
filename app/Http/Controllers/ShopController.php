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
}
