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
            'booking_type' => 'required|in:Hourly,Weekly,Monthly,On demand',
            'source_location' => 'required|string',
            'destination_location' => 'nullable|string',
            'hours' => 'nullable|integer',
            'working_days' => 'nullable|integer',
            'working_hours_per_day' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'booking_datetime' => 'nullable|date_format:Y-m-d H:i:s',
        ]);

        $booking = Booking::create([
            'user_id' => Auth::id(), 
            'booking_type' => $request->booking_type,
            'trip_type' => $request->trip_type,
            'source_location' => $request->source_location,
            'destination_location' => $request->destination_location,
            'hours' => $request->hours,
            'working_days' => $request->working_days,
            'working_hours_per_day' => $request->working_hours_per_day,
            'payment' => $request->payment,
            'start_date' => $request->start_date,
            'booking_datetime' => $request->booking_datetime,
        ]);

        return response()->json(['message' => 'Booking successful', 'booking' => $booking], 201);
    }

    public function index()
    {
        $bookings = Booking::with('user')->orderBy('created_at', 'desc')->get();

        $formatted = $bookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'userName' => $booking->user->name,
                'userContact' => $booking->user->phone ?? 'N/A',
                'date' => $booking->booking_datetime ? date('Y-m-d', strtotime($booking->booking_datetime)) : null,
                'time' => $booking->booking_datetime ? date('H:i', strtotime($booking->booking_datetime)) : null,
                'booking_type' => $booking->booking_type,
                'from' => $booking->source_location,
                'to' => $booking->destination_location,
                'driver' => $booking->driver_name ?? null,
                'driverContact' => $booking->driver_contact ?? null,
                'created_at' => $booking->created_at->toDateTimeString(),
            ];
        });

        return response()->json(['bookings' => $formatted]);
    }

    public function assignDriver(Request $request, $id)
    {
        $request->validate([
            'driver_name' => 'required|string',
            'driver_contact' => 'required|string',
            'driver_location' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->driver_name = $request->driver_name;
        $booking->driver_contact = $request->driver_contact;
        $booking->driver_location = $request->driver_location;
        $booking->save();

        return response()->json(['message' => 'Driver assigned successfully.', 'booking' => $booking]);
    }


    public function show($id)
    {
        $booking = Booking::findOrFail($id);
        return response()->json(['booking' => $booking]);
    }



    // my rides page details
    public function getRidesForDriver()
    {
        $user = Auth::user();

        if (!$user || !$user->phone) {
            return response()->json(['error' => 'Contact to admin about your phone number is wrong.'], 401);
        }

        // Fetch bookings based on driver's phone
        $rawRides = Booking::where('driver_contact', $user->phone)
                    ->orderBy('booking_datetime', 'desc')
                    ->get();


        // Format the rides
        $rides = $rawRides->map(function ($ride) {
            return [
                'id' => $ride->id,
                'date' => $ride->booking_datetime ? date('Y-m-d', strtotime($ride->booking_datetime)) : null,
                'time' => $ride->booking_datetime ? date('H:i', strtotime($ride->booking_datetime)) : null,
                'pickup' => $ride->source_location,
                'destination' => $ride->destination_location,
                'type' => $ride->booking_type,
                'fare' => $ride->payment ?? 'N/A',
            ];
        });

        return response()->json(['rides' => $rides], 200);
    }

}
