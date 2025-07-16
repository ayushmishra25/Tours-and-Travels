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

        if (!$ride->exists) {
            $ride->payment_type = $validated['payment_type'] ?? 'cash';
            $ride->payment_status = $validated['payment_status'] ?? false;
        }

        foreach (['driver_id', 'start_ride', 'end_ride', 'start_meter', 'end_meter', 'payment_type', 'payment_status'] as $field) {
            if (array_key_exists($field, $validated)) {
                $ride->$field = $validated[$field];
            }
        }

        // ✅ Auto-fill start_ride if missing and booking is On demand
        if (
            array_key_exists('start_meter', $validated) &&
            $booking->booking_type === 'On demand' &&
            is_null($ride->start_ride)
        ) {
            $ride->start_ride = now();
        }

        // ✅ Auto-fill end_ride if missing and booking is On demand
        if (
            array_key_exists('end_meter', $validated) &&
            $booking->booking_type === 'On demand' &&
            is_null($ride->end_ride)
        ) {
            $ride->end_ride = now();
        }

        $ride->save();

        // ------- Payment Calculation -------
        $start = $ride->start_ride ? \Carbon\Carbon::parse($ride->start_ride) : null;
        $end = $ride->end_ride ? \Carbon\Carbon::parse($ride->end_ride) : null;
        $updatedPayment = 0;
        $nightCharge = 0;

        if ($start && $end) {
            // ✅ Night Charge Check
            $current = $start->copy();
            while ($current < $end) {
                $hour = (int) $current->format('H');
                if ($hour >= 22 || $hour < 5) {
                    $nightCharge = 200;
                    break;
                }
                $current->addMinutes(15);
            }

            // ✅ Hourly Booking Pricing
            if ($booking->booking_type === 'Hourly') {
                $duration = $start->diffInHours($end);
                if ($duration < 1) $duration = 1;
                if ($duration > 12) $duration = 12;

                $locationKey = strtolower(str_replace(' ', '_', $booking->source_location));
                $hourlyPricing = [
                    'delhi' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'gurugram' => [270, 340, 410, 480, 560, 625, 720, 815, 910, 1005, 1100, 1195],
                    'faridabad' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'ghaziabad' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'noida' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                    'greater_noida' => [225, 295, 370, 450, 535, 625, 720, 815, 910, 1005, 1100, 1195],
                ];

                $updatedPayment = $hourlyPricing[$locationKey][$duration - 1] ?? 0;
            }

            // ✅ On Demand Booking Pricing
            if (
                $booking->booking_type === 'On demand' &&
                is_numeric($ride->start_meter) &&
                is_numeric($ride->end_meter) &&
                $ride->end_meter > $ride->start_meter
            ) {
                $distanceKm = $ride->end_meter - $ride->start_meter;

                $pricing = [
                    50 => 606, 100 => 1115, 150 => 1206, 200 => 1443, 250 => 1670,
                    300 => 1860, 350 => 2349, 400 => 2570, 450 => 2800, 500 => 3050,
                    600 => 3529, 700 => 4008, 800 => 4480, 900 => 4962, 1000 => 5435, 1200 => 6400
                ];

                $rounded = $this->roundToNearestKey($pricing, $distanceKm);
                $updatedPayment = $pricing[$rounded] ?? 0;
            }

            $updatedPayment += $nightCharge;
        }

        // ✅ Save if changed
        if ($updatedPayment > 0 && $updatedPayment !== $booking->payment) {
            $booking->payment = $updatedPayment;
            $booking->night_charge_applied = $nightCharge > 0;
            $booking->save();
        }

        return response()->json([
            'message' => $ride->wasRecentlyCreated ? 'Ride created successfully' : 'Ride updated successfully',
            'ride' => $ride,
            'updated_payment' => $updatedPayment,
            'night_charge_applied' => $nightCharge > 0
        ]);
    }


    // ✅ Rounding Helper
    private function roundToNearestKey(array $pricing, float|int $distance): int
    {
        ksort($pricing);
        foreach ($pricing as $key => $price) {
            if ($distance <= $key) {
                return $key;
            }
        }
        return array_key_last($pricing); // fallback for highest tier
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
