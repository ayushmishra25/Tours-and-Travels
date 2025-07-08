<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'body' => 'required|string',
            'location' => 'nullable|string',
            'role' => 'nullable|integer', 
        ]);

        $message = Message::create([
            'title' => $request->title,
            'body' => $request->body,
            'location' => $request->location,
            'role' => $request->role,
        ]);

        return response()->json(['message' => 'Message sent successfully.', 'data' => $message]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $userLocation = strtolower($user->location);

        $messagesQuery = Message::where(function ($q) use ($user) {
            // Role-based visibility: show if role is null or matches user's role
            $q->whereNull('role')
            ->orWhere('role', $user->role);
        })->where(function ($q) use ($userLocation) {
            // Location-based visibility:
            $q->whereNull('location') // show to all locations
            ->orWhereRaw('LOWER(location) LIKE ?', ["%{$userLocation}%"])
            ->orWhereRaw('? LIKE \'%\' || LOWER(location) || \'%\'', [$userLocation]);
        });

        // Optional date filter
        if ($afterDate = $request->query('after_date')) {
            $messagesQuery->whereDate('created_at', '>=', $afterDate);
        }

        $messages = $messagesQuery
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Optional: filter out blank messages (just in case)
        $filtered = $messages->filter(function ($msg) {
            return !empty($msg->title) || !empty($msg->body);
        })->values();

        return response()->json(['messages' => $filtered]);
    }
}
