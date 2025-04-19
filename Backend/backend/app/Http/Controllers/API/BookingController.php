<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_type' => 'required|in:hourly,weekly,monthly,on_demand',
            'source_location' => 'required|string',
            'destination_location' => 'nullable|string',
            'hours' => 'nullable|integer',
            'working_days' => 'nullable|array',
            'working_hours_per_day' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'booking_datetime' => 'nullable|date_format:Y-m-d H:i:s',
        ]);

        $booking = Booking::create([
            'user_id' => Auth::id(), 
            'booking_type' => $request->booking_type,
            'source_location' => $request->source_location,
            'destination_location' => $request->destination_location,
            'hours' => $request->hours,
            'working_days' => $request->working_days ? json_encode($request->working_days) : null,
            'working_hours_per_day' => $request->working_hours_per_day,
            'start_date' => $request->start_date,
            'booking_datetime' => $request->booking_datetime,
        ]);

        return response()->json(['message' => 'Booking successful', 'booking' => $booking], 201);
    }
}
