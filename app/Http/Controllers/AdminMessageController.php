<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminMessageController extends Controller
{
    // Return count of unread admin messages (IsRead = 0)
    public function unreadCount()
    {
        $count = DB::table('adminmessages')->where('IsRead', 0)->count();
        return response()->json(['unread_messages' => $count]);
    }
}
