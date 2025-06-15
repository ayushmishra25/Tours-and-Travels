<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\BookingCreated;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_type' => 'required|in:Hourly,Weekly,Monthly,On demand',
            'source_location' => 'required|string',
            'source_pincode' => 'required|digits:6',  
            'destination_location' => 'nullable|string',
            'hours' => 'nullable|integer',
            'working_days' => 'nullable|integer',
            'working_hours_per_day' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'booking_datetime' => 'nullable|date_format:Y-m-d H:i:s',
            'trip_type' => 'nullable|string',
            'payment' => 'nullable|numeric',
        ]);

        // Save booking
        $booking = Booking::create([
            'user_id' => Auth::id(),
            'booking_type' => $request->booking_type,
            'trip_type' => $request->trip_type,
            'source_location' => $request->source_location,
            'source_pincode' => $request->source_pincode,  
            'destination_location' => $request->destination_location,
            'hours' => $request->hours,
            'working_days' => $request->working_days,
            'working_hours_per_day' => $request->working_hours_per_day,
            'payment' => $request->payment,
            'start_date' => $request->start_date,
            'booking_datetime' => $request->booking_datetime,
        ]);

        $sourcePincode = $request->source_pincode;

        // Get drivers with matching pin code from live_location
        $drivers = User::where('role', 1)->get()->filter(function ($user) use ($sourcePincode) {
            return $this->extractPinCode($user->location) === $sourcePincode;
        });

        // Notify matched drivers
        foreach ($drivers as $driver) {
            event(new BookingCreated([
                'driver_id' => $driver->id,
                'booking_id' => $booking->id,
                'user_name' => auth()->user()->name,
                'source' => $booking->source_location,
                'destination' => $booking->destination_location,
                'booking_type' => $booking->booking_type,
                'timestamp' => now()->toDateTimeString()
            ]));
        }

        return response()->json(['message' => 'Booking successful', 'booking' => $booking], 201);
    }

    private function extractPinCode($address)
    {
        if (preg_match('/\b\d{6}\b/', $address, $matches)) {
            return $matches[0];
        }
        return null;
    }


    public function index()
    {
        $bookings = Booking::with('user')->orderBy('id', 'desc')->get();

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
            'driver_contact' => 'required|string',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->driver_contact = $request->driver_contact;
        $booking->save();

        return response()->json(['message' => 'Driver assigned successfully.', 'booking' => $booking]);
    }


    public function show($user_id)
    {
        $bookings = Booking::with('user')->orderBy('id', 'desc')->get();

        return response()->json(['bookings' => $bookings]);
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

    public function getDriverDetails($booking_id)
    {
        $booking = Booking::find($booking_id);

       
        $driverContact = $booking->driver_contact;
        $driver = User::where('phone', $driverContact)->first();

        if (!$driver) {
            return response()->json(['message' => 'Driver not found in users table'], 404);
        }
        $driverDetails = \App\Models\DriverDetailsUpload::where('user_id', $driver->id)->first();
        if (!$driverDetails) {
            return response()->json(['message' => 'Driver details not uploaded yet'], 404);
        }

        // Convert file paths to full URLs
        $convertToUrl = fn($filePath) => $filePath ? asset("storage/{$filePath}") : null;

        return response()->json([
            'driver_name'             => $booking->driver_name,
            'driver_contact'          => $driverContact,
            'driver_location'         => $booking->driver_location,
            'photo'                   => $convertToUrl($driverDetails->photo),
            'age'                     => $driverDetails->age,
            'location'                => $driver->location,
            'driving_experience'      => $driverDetails->driving_experience,
            'car_driving_experience'  => $driverDetails->car_driving_experience,
            'driving_licence_front'   => $convertToUrl($driverDetails->driving_licence_front),
            'type_of_driving_licence' => $driverDetails->type_of_driving_licence,
            'aadhar_card_front'       => $convertToUrl($driverDetails->aadhar_card_front),
            'aadhar_card_back'        => $convertToUrl($driverDetails->aadhar_card_back),
            'family_contacts' => $driverDetails->family_contacts ?? [],
        ]);
    }

}
