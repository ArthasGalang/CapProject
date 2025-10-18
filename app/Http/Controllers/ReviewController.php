<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller {
    // Get average rating for products (accepts ?productIds=1,2,3)
    public function averageRatings(Request $request) {
        $ids = $request->query('productIds');
        if (!$ids) return response()->json([]);
        $idArr = explode(',', $ids);
        $ratings = Review::whereIn('ProductID', $idArr)
            ->selectRaw('ProductID, AVG(Rating) as avg_rating, COUNT(*) as count')
            ->groupBy('ProductID')
            ->get();
        $result = [];
        foreach ($ratings as $row) {
            $result[$row->ProductID] = [
                'avg' => round($row->avg_rating, 2),
                'count' => $row->count
            ];
        }
        return response()->json($result);
    }
}
