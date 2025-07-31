<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Landing;

class LandingController extends Controller
{
    // POST /api/landing
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:15',
            'city_location' => 'required|string|max:255',
            'service_type' => 'required|in:Hourly,Weekly,Monthly,One-Way,Event',
        ]);

        $landing = Landing::create($validated);

        return response()->json(['message' => 'Data saved successfully', 'data' => $landing], 201);
    }

    // GET /api/landing
    public function index()
    {
        $data = Landing::all();
        return response()->json($data);
    }
}
