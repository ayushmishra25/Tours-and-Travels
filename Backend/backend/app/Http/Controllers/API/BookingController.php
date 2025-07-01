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
            'zone' => 'nullable|string',
            'source_pincode' => 'required|digits:6',
            'destination_location' => 'nullable|string',
            'vehicle_details' => 'nullable|string',
            'hours' => 'nullable|integer',
            'working_days' => 'nullable|integer',
            'working_hours_per_day' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'booking_datetime' => 'nullable|date_format:Y-m-d g:i A',
            'trip_type' => 'nullable|string',
            'start_meter' => 'nullable|integer',
            'end_meter' => 'nullable|integer',
            'distance' => 'nullable|numeric',
            'is_selected' => 'nullable|boolean'
        ]);

        $payment = $this->calculateFare($request);

        $booking = Booking::create([
            'user_id' => Auth::id(),
            'booking_type' => $request->booking_type,
            'zone' => $request->zone,
            'trip_type' => $request->trip_type,
            'source_location' => $request->source_location,
            'source_pincode' => $request->source_pincode,
            'destination_location' => $request->destination_location,
            'vehicle_details' => $request->vehicle_details,
            'hours' => $request->hours,
            'working_days' => $request->working_days,
            'working_hours_per_day' => $request->working_hours_per_day,
            'payment' => $payment,
            'start_date' => $request->start_date,
            'booking_datetime' => $request->booking_datetime,
            'is_selected' => $request-> is_selected,
        ]);

        return response()->json([
            'message' => 'Booking successful',
            'booking' => $booking
        ], 201);
    }

    public function calculateFare(Request $request)
    {
        $type = $request->booking_type;

        if ($type === 'Hourly') {
            // ✅ Try zone, fallback to city extraction
            $location = $request->zone
                ? strtolower(str_replace(' ', '_', $request->zone))
                : $this->extractCity($request->source_location);

            $hourlyPricing = [
                'delhi' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                'gurugram' => [270, 340, 410, 480, 560, 625, 720, 815, 910, 1005, 1100, 1195],
                'faridabad' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                'ghaziabad' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                'noida' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                'greater_noida' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
            ];

            $hours = $request->hours;
            if (!$location || !$hours || $hours < 1 || $hours > 12) return 0;

            return $hourlyPricing[$location][$hours - 1] ?? 0;
        }

        elseif ($type === 'Weekly') {
            $days = (int) $request->working_days;
            $hoursPerDay = (int) $request->working_hours_per_day;

            if (!$days || !$hoursPerDay) return 0;

            $ratePerHour = 1250 / 12;
            return round($ratePerHour * $hoursPerDay * $days);
        }

        elseif ($type === 'Monthly') {
            $monthlyPricing = $this->getMonthlyPricing();
            $area = $request->zone;
            $days = (string) $request->working_days;
            $hours = (string) $request->working_hours_per_day;

            if (!$area || !$days || !$hours) return 0;

            return $monthlyPricing[$area][$days][$hours] ?? 0;
        }

        elseif ($type === 'On demand') {
            $pricing = [
                50 => 606, 100 => 1115, 150 => 1206, 200 => 1443, 250 => 1670,
                300 => 1860, 350 => 2349, 400 => 2570, 450 => 2800, 500 => 3050,
                600 => 3529, 700 => 4008, 800 => 4480, 900 => 4962, 1000 => 5435, 1200 => 6400
            ];

            $distance = null;

            if ($request->has('distance')) {
                $distance = (float) $request->distance;
            } elseif ($request->has('start_meter') && $request->has('end_meter')) {
                $distance = ($request->end_meter - $request->start_meter) / 1000;
            }

            if ($distance !== null) {
                $rounded = $this->roundToNearestKey($pricing, $distance);
                return $pricing[$rounded] ?? 0;
            }

            return 0;
        }

        return 0;
    }

    public function extractCity($address)
    {
        $address = strtolower($address);
        $cities = ['delhi', 'gurugram', 'faridabad', 'ghaziabad', 'noida', 'greater noida'];

        foreach ($cities as $city) {
            if (strpos($address, strtolower($city)) !== false) {
                return str_replace(' ', '_', $city);
            }
        }

        return null;
    }

    public function roundToNearestKey(array $pricing, float $distance)
    {
        $keys = array_keys($pricing);
        foreach ($keys as $key) {
            if ($distance <= $key) return $key;
        }
        return max($keys);
    }

    public function getMonthlyPricing()
    {
        return [
            "East Delhi" => [
                "22" => ["8" => 17000, "10" => 17500, "12" => 18500],
                "24" => ["8" => 17500, "10" => 18500, "12" => 19500],
                "26" => ["8" => 18000, "10" => 19000, "12" => 20000]
            ],
            "North Delhi" => [
                "22" => ["8" => 17000, "10" => 17500, "12" => 18500],
                "24" => ["8" => 17500, "10" => 17500, "12" => 19500],
                "26" => ["8" => 18000, "10" => 19000, "12" => 20000]
            ],
            "South Delhi" => [
                "22" => ["8" => 19000, "10" => 20000, "12" => 21000],
                "24" => ["8" => 19500, "10" => 21000, "12" => 22000],
                "26" => ["8" => 21000, "10" => 22000, "12" => 23000]
            ],
            "West Delhi" => [
                "22" => ["8" => 17500, "10" => 18500, "12" => 19500],
                "24" => ["8" => 18000, "10" => 19000, "12" => 20000],
                "26" => ["8" => 19000, "10" => 20000, "12" => 21000]
            ],
            "Gurugram" => [
                "22" => ["8" => 18500, "10" => 19500, "12" => 20500],
                "24" => ["8" => 19500, "10" => 20500, "12" => 21500],
                "26" => ["8" => 20000, "10" => 21000, "12" => 22000]
            ],
            "Faridabad" => [
                "22" => ["8" => 18000, "10" => 19000, "12" => 20000],
                "24" => ["8" => 19000, "10" => 20000, "12" => 21000],
                "26" => ["8" => 20000, "10" => 21000, "12" => 22000]
            ],
            "Ghaziabad" => [
                "22" => ["8" => 16000, "10" => 17000, "12" => 18000],
                "24" => ["8" => 17000, "10" => 18000, "12" => 19000],
                "26" => ["8" => 18000, "10" => 19000, "12" => 20000]
            ],
            "Noida" => [
                "22" => ["8" => 17000, "10" => 18000, "12" => 19000],
                "24" => ["8" => 18000, "10" => 19000, "12" => 20000],
                "26" => ["8" => 19000, "10" => 20000, "12" => 21000]
            ],
            "Greater Noida" => [
                "22" => ["8" => 17000, "10" => 18000, "12" => 19000],
                "24" => ["8" => 18000, "10" => 19000, "12" => 20000],
                "26" => ["8" => 19000, "10" => 20000, "12" => 21000]
            ],
        ];
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
            ->withTrashed()
            ->leftJoin('driver_rides', 'bookings.id', '=', 'driver_rides.booking_id')
            ->leftJoin('users as driver_user', 'bookings.driver_contact', '=', 'driver_user.phone') // join to get driver name
            ->orderBy('bookings.id', 'desc')
            ->select(
                'bookings.*',
                'driver_rides.payment_type',
                'driver_rides.payment_status',
                'driver_rides.end_ride',
                'driver_rides.start_ride',
                'driver_rides.start_meter',
                'driver_rides.end_meter',
                'driver_user.name as driver_name' // selecting driver's name
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
                'hours' => $booking->hours ?? null,
                'working_days' => $booking->working_days ?? null,
                'working_hours_per_day' => $booking->working_hours_per_day ?? null,
                'driver' => $booking->driver_name ?? null, // get driver name from joined table
                'driverContact' => $booking->driver_contact ?? null,
                'payment_type' => $booking->payment_type ?? 'N/A',
                'payment_status' => $booking->payment_status ?? 'N/A',
                'start_ride' => $booking->start_ride ?? 'N/A',
                'end_ride' => $booking->end_ride ?? 'N/A',
                'start_meter' => $booking->start_meter ?? 'N/A',
                'end_meter' => $booking->end_meter ?? 'N/A',
                'created_at' => $booking->created_at->toDateTimeString(),
                'deleted_by_customer' => $booking->deleted_at ? true : false,
                'is_selected'=> $booking->is_selected ? true : false,
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
        $bookings = Booking::withTrashed()
            ->with('user')
            ->where('user_id', $user_id)
            ->orderBy('id', 'desc')
            ->get();

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
            return response()->json(['error' => 'Contact admin about your phone number.'], 401);
        }

        $rawRides = Booking::query()
            // No withTrashed(): only active (non‑deleted) bookings
            ->leftJoin('driver_rides', 'bookings.id', '=', 'driver_rides.booking_id')
            ->whereNull('bookings.deleted_at')
            ->where('bookings.driver_contact', $user->phone)
            ->select(
                'bookings.*',
                'driver_rides.start_ride',
                'driver_rides.end_ride',
                'driver_rides.start_meter',
                'driver_rides.end_meter',
                'driver_rides.payment_status',
                'driver_rides.payment_type'
            )
            ->orderBy('bookings.booking_datetime', 'desc')
            ->get();

        $rides = $rawRides->map(function ($ride) {
            $base = [
                'id'          => $ride->id,
                'date'        => $ride->booking_datetime ? date('Y-m-d', strtotime($ride->booking_datetime)) : null,
                'time' => $ride->booking_datetime ? date('h:i A', strtotime($ride->booking_datetime)) : null,
                'pickup'      => $ride->source_location,
                'destination' => $ride->destination_location,
                'type'        => $ride->booking_type,
                'fare'        => $ride->payment ?? 'N/A',
                'payment_status' => $ride->payment_status ?? 'N/A',
                'payment_type' => $ride->payment_type ?? 'N/A'
            ];

            $type = strtolower($ride->booking_type);

            if ($type === 'on demand') {
                $base['start_meter'] = $ride->start_meter ?? 'N/A';
                $base['end_meter']   = $ride->end_meter   ?? 'N/A';
            } elseif ($type === 'hourly') {
                $base['start_ride'] = $ride->start_ride ?? 'N/A';
                $base['end_ride']   = $ride->end_ride   ?? 'N/A';
            }
            // weekly and monthly types get no ride fields
            return $base;
        });

        return response()->json(['rides' => $rides], 200);
    }

    //  Admin page Driver Ride
    public function getRidesForDriverById($driverId)
    {
        $admin = Auth::user();

        if (!$admin || $admin->role != 2) { 
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $driver = User::find($driverId);
        if (!$driver || !$driver->phone) {
            return response()->json(['error' => 'Driver not found or missing phone.'], 404);
        }

        $rides = Booking::query()
            ->leftJoin('driver_rides', 'bookings.id', '=', 'driver_rides.booking_id')
            ->whereNull('bookings.deleted_at')
            ->where('bookings.driver_contact', $driver->phone)
            ->select(
                'bookings.*',
                'driver_rides.start_ride',
                'driver_rides.end_ride',
                'driver_rides.start_meter',
                'driver_rides.end_meter',
                'driver_rides.payment_status'
            )
            ->orderBy('bookings.booking_datetime', 'desc')
            ->get()
            ->map(function ($ride) {
                $data = [
                    'id' => $ride->id,
                    'date' => $ride->booking_datetime ? date('Y-m-d', strtotime($ride->booking_datetime)) : null,
                    'time' => $ride->booking_datetime ? date('h:i A', strtotime($ride->booking_datetime)) : null,
                    'pickup' => $ride->source_location,
                    'destination' => $ride->destination_location,
                    'type' => $ride->booking_type,
                    'fare' => $ride->payment ?? 'N/A',
                    'payment_status' => $ride->payment_status ?? 'N/A',
                ];

                if (strtolower($ride->booking_type) === 'on demand') {
                    $data['start_meter'] = $ride->start_meter ?? 'N/A';
                    $data['end_meter'] = $ride->end_meter ?? 'N/A';
                } elseif (strtolower($ride->booking_type) === 'hourly') {
                    $data['start_ride'] = $ride->start_ride ?? 'N/A';
                    $data['end_ride'] = $ride->end_ride ?? 'N/A';
                }

                return $data;
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
                'is_selected' => 'nullable|boolean'
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
            if ($request->has('is_selected')) {
                $booking->is_selected = $request->is_selected;
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
