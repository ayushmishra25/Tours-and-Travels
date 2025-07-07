<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportRequestController extends Controller
{
    // Create API of Support request 
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $support = SupportRequest::create([
            'user_id' => Auth::id(), 
            'subject' => $request->subject,
            'message' => $request->message,
            'is_resolve' => false,
        ]);

        return response()->json([
            'message' => 'Support request submitted successfully.',
            'data' => $support,
        ], 201);
    }


    // Listing API of Support
    public function index()
    {
        $requests = SupportRequest::all();
    
        $data = $requests->map(function ($item) {
            $user = $item->user; 
    
            return [
                'id' => $item->id,
                'name' => $user->name ?? '',
                'email' => $user->email ?? '',
                'contact' => $user->phone ?? '',
                'role' => $user->role ?? 'User',
                'problem' => $item->subject . ' - ' . $item->message,
                'date' => $item->created_at->toDateString(),
                'resolved' => $item -> is_resolved, 
            ];
        });
    
        return response()->json($data);
    }

    // Update API of Support Request just is_resolved 
    public function markResolved(Request $request, $id)
    {
        $supportRequest = SupportRequest::find($id);

        if (!$supportRequest) {
            return response()->json(['message' => 'Support request not found'], 404);
        }

        $supportRequest->is_resolved = $request->input('is_resolved');
        $supportRequest->save();

        return response()->json(['message' => 'Support request updated successfully']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'resolution' => 'required|string',
        ]);

        $supportRequest = SupportRequest::find($id);

        if (!$supportRequest) {
            return response()->json(['message' => 'Support request not found'], 404);
        }

        $supportRequest->resolution = $request->input('resolution');
        $supportRequest->is_resolved = true; 
        $supportRequest->save();

        return response()->json([
            'message' => 'Resolution updated successfully.',
            'data' => $supportRequest,
        ]);
    }

    public function getSupportDriver()
    {
        $userId = Auth::id();

        // Get only support requests that belong to this user
        $requests = SupportRequest::where('user_id', $userId)->get();

        $data = $requests->map(function ($item) {
            $user = $item->user;

            return [
                'id' => $item->id,
                'problem' => $item->subject . ' - ' . $item->message,
                'resolved' => $item->is_resolved,
                'resolution' => $item->resolution,
            ];
        });

        return response()->json($data);
    }

}

