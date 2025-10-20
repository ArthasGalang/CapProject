<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->UserID ?? $request->user()->id;
        $otherId = $request->query('other_id');
        $messages = Message::where(function($q) use ($userId, $otherId) {
            $q->where('SenderID', $userId)->where('ReceiverID', $otherId);
        })->orWhere(function($q) use ($userId, $otherId) {
            $q->where('SenderID', $otherId)->where('ReceiverID', $userId);
        })->orderBy('created_at')->get();
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $userId = $request->user()->UserID ?? $request->user()->id;
        $message = Message::create([
            'SenderID' => $userId,
            'ReceiverID' => $request->input('receiver_id'),
            'MessageBody' => $request->input('message'),
        ]);
        broadcast(new MessageSent($message))->toOthers();
        return response()->json($message);
    }
}
