<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\DriverRide;
use Illuminate\Http\Request;

class DriverRideController extends Controller
{
    /**
     * Store or update a driver ride based on booking_id.
     */
    public function update(Request $request, $booking_id)
    {
        $validated = $request->validate([
            'driver_id' => 'nullable|exists:users,id',
            'start_ride' => 'nullable|date',
            'end_ride' => 'nullable|date',
            'start_meter' => 'nullable|numeric',
            'end_meter' => 'nullable|numeric',
            'payment_type' => 'nullable|in:cash,upi',
            'payment_status' => 'nullable|boolean',
        ]);

        $booking = Booking::findOrFail($booking_id);
        $ride = DriverRide::firstOrNew(['booking_id' => $booking_id]);

        // If new ride, set default values
        if (!$ride->exists) {
            $ride->payment_type = $validated['payment_type'] ?? 'cash';
            $ride->payment_status = $validated['payment_status'] ?? false;
        }

        // Assign fields conditionally
        if (array_key_exists('driver_id', $validated)) {
            $ride->driver_id = $validated['driver_id'];
        }

        if (array_key_exists('start_ride', $validated)) {
            $ride->start_ride = $validated['start_ride'] ?? now();
        }

        if (array_key_exists('end_ride', $validated)) {
            $ride->end_ride = $validated['end_ride'] ?? now();
        }

        if (array_key_exists('start_meter', $validated)) {
            $ride->start_meter = $validated['start_meter'];
        }

        if (array_key_exists('end_meter', $validated)) {
            $ride->end_meter = $validated['end_meter'];
        }

        foreach (['payment_type', 'payment_status'] as $field) {
            if (array_key_exists($field, $validated)) {
                $ride->$field = $validated[$field];
            }
        }

        $ride->save();

        // ------- Payment Calculation -------
        $updatedPayment = $booking->payment;

        // Case 1: Hourly Booking
        if ($booking->booking_type === 'Hourly' && $ride->start_ride && $ride->end_ride) {
            $start = \Carbon\Carbon::parse($ride->start_ride);
            $end = \Carbon\Carbon::parse($ride->end_ride);
            $duration = $start->diffInHours($end);
            if ($duration < 1) $duration = 1;
            if ($duration > 12) $duration = 12;

            // Only update payment if duration exceeds booked hours
            if ($duration > $booking->hours) {
                $locationKey = strtolower(str_replace(' ', '_', $booking->source_location));
                $hourlyPricing = [
                    'delhi' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'gurugram' => [270, 340, 410, 480, 560, 625, 720, 815, 910, 1005, 1100, 1195],
                    'faridabad' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'ghaziabad' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'noida' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'greater_noida' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                ];

                $newFare = $hourlyPricing[$locationKey][$duration - 1] ?? 0;
                if ($newFare > $booking->payment) {
                    $updatedPayment = $newFare;
                }
            }
        }

        // Case 2: On Demand Booking
        if ($booking->booking_type === 'On demand' && $ride->start_meter && $ride->end_meter) {
            $distanceKm = $ride->end_meter - $ride->start_meter;

            $pricing = [
                50 => 606, 100 => 1115, 150 => 1206, 200 => 1443, 250 => 1670,
                300 => 1860, 350 => 2349, 400 => 2570, 450 => 2800, 500 => 3050,
                600 => 3529, 700 => 4008, 800 => 4480, 900 => 4962, 1000 => 5435, 1200 => 6400
            ];

            $rounded = $this->roundToNearestKey($pricing, $distanceKm);
            $newFare = $pricing[$rounded] ?? 0;

            if ($newFare > $booking->payment) {
                $updatedPayment = $newFare;
            }
        }

        // Save updated payment if changed
        if ($updatedPayment !== $booking->payment) {
            $booking->payment = $updatedPayment;
            $booking->save();
        }

        return response()->json([
            'message' => $ride->wasRecentlyCreated ? 'Ride created successfully' : 'Ride updated successfully',
            'ride' => $ride,
            'updated_payment' => $updatedPayment
        ]);
    }

    private function roundToNearestKey(array $pricing, float|int $distance): int
    {
        ksort($pricing);
        foreach ($pricing as $key => $price) {
            if ($distance <= $key) {
                return $key;
            }
        }
        return array_key_last($pricing); // fallback for distances above highest key
    }



    /**
     * Show ride by booking_id.
     */
    public function show($booking_id)
    {
        $ride = DriverRide::where('booking_id', $booking_id)->first();

        if (!$ride) {
            return response()->json([
                'message' => 'No ride found for the given booking ID.',
            ], 404);
        }

        return response()->json([
            'message' => 'Ride details retrieved successfully.',
            'ride' => $ride,
        ]);
    }
}
