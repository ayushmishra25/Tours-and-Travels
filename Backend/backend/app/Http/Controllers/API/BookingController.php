<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\BookingCreated;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\DriverRide;
use App\Models\Booking;
use Illuminate\Database\Eloquent\SoftDeletes; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    // Booking Function
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_type' => 'required|in:Hourly,Weekly,Monthly,On demand',
            'source_location' => 'required|string',
            'source_pincode' => 'required|digits:6',  
            'destination_location' => 'nullable|string',
            'vehicle_details' => 'nullable|string',
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
            'vehicle_details' => $request->vehicle_details,
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
                'vehicle_details' => $booking->vehicle_details,
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

    // Admin Listing API of Bookings
    public function index()
    {
        $bookings = Booking::with('user')
            ->withTrashed() // Include soft-deleted bookings
            ->leftJoin('driver_rides', 'bookings.id', '=', 'driver_rides.booking_id')
            ->orderBy('bookings.id', 'desc')
            ->select(
                'bookings.*',
                'driver_rides.payment_type',
                'driver_rides.payment_status',
                'driver_rides.payment_received'
            )
            ->get();

        $formatted = $bookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'userName' => $booking->user->name,
                'userContact' => $booking->user->phone ?? 'N/A',
                'date' => $booking->booking_datetime ? date('Y-m-d', strtotime($booking->booking_datetime)) : null,
                'time' => $booking->booking_datetime ? date('H:i', strtotime($booking->booking_datetime)) : null,
                'booking_type' => $booking->booking_type,
                'from' => $booking->source_location,
                'vehicle_details' => $booking->vehicle_details,
                'to' => $booking->destination_location,
                'driver' => $booking->driver_name ?? null,
                'driverContact' => $booking->driver_contact ?? null,
                'payment_type' => $booking->payment_type ?? 'N/A',
                'payment_status' => $booking->payment_status ?? 'N/A',
                'payment_received' => $booking->payment_received ?? 'N/A',
                'created_at' => $booking->created_at->toDateTimeString(),
                'deleted_by_customer' => $booking->deleted_at ? true : false, // 🟢 Added this line
            ];
        });

        return response()->json(['bookings' => $formatted]);
    }


    // Assign a Driver
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

    // Cutomer booking listing 
    public function show($user_id)
    {
        $bookings = Booking::withTrashed()->with('user')->orderBy('id', 'desc')->get();

        // Add 'is_deleted' flag to each booking
        $bookings = $bookings->map(function ($booking) {
            $booking->is_deleted = $booking->deleted_at !== null;
            return $booking;
        });

        return response()->json(['bookings' => $bookings]);
    }



    // Driver rides page details
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

    // Against booking Id assign Driver Details
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

    // Current location API
    public function geocode(Request $request)
    {
        $latlng = $request->input('latlng');
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        $response = Http::get("https://maps.googleapis.com/maps/api/geocode/json", [
            'latlng' => $latlng,
            'key' => $apiKey
        ]);

        return $response->json();
    }

    // Delete the booking 
    public function destroy($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Booking not found.'], 404);
        }
        if ($booking->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized: You can only delete your own bookings.'], 403);
        }
        $booking->delete(); // Soft delete
        return response()->json(['message' => 'Booking soft deleted successfully.']);
    }

    // Update API of Booking
    public function update(Request $request, $id)
    {

        try {
            // Check if user has role_id = 2
            if (auth()->user()->role != 2) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Validate the input
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'booking_datetime' => 'nullable|date_format:Y-m-d H:i:s',
                'driver_contact' => 'nullable|string|max:10',
                'hours' => 'nullable|integer',
                'working_days' => 'nullable|integer',
                'working_hours_per_day' => 'nullable|integer',
            ]);

            // Find the booking
            $booking = Booking::find($id);
            if (!$booking) {
                return response()->json(['message' => 'Booking not found'], 404);
            }

            // Update allowed fields
            if ($request -> has('hours')) {
                $booking->hours = $request->hours;
            }

            if ($request ->has('working_days')){
                $booking->working_days = $request->working_days;
            }

            if ($request -> has('working_hours_per_day')){
                $booking->working_hours_per_day = $request->working_hours_per_day;
            }

            if ($request->has('start_date')) {
                $booking->start_date = $request->start_date;
            }
            if ($request->has('booking_datetime')) {
                $booking->booking_datetime = $request->booking_datetime;
            }
            if ($request->has('driver_contact')) {
                $booking->driver_contact = $request->driver_contact;
            }

            $booking->save();

            return response()->json(['message' => 'Booking updated successfully', 'booking' => $booking], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
