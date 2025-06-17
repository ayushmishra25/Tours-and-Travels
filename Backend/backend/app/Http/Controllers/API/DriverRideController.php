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
            'payment_type' => 'nullable|in:cash,upi',
            'payment_received' => 'nullable|boolean',
            'payment_status' => 'nullable|boolean',
        ]);

        $ride = DriverRide::firstOrNew(['booking_id' => $booking_id]);

        if (!$ride->exists) {
            // New record - set default start_ride and optional fields
            $ride->payment_type = $validated['payment_type'] ?? 'cash';
            $ride->payment_received = $validated['payment_received'] ?? false;
            $ride->payment_status = $validated['payment_status'] ?? false;
        }

        // Only update fields if present in request
        if (array_key_exists('driver_id', $validated)) {
            $ride->driver_id = $validated['driver_id'];
        }

        if (array_key_exists('start_ride', $validated)) {
            $ride->start_ride = $validated['start_ride'] ?? now();
        }

        if (array_key_exists('end_ride', $validated)) {
            $ride->end_ride = $validated['end_ride'] ?? now();
        }

        foreach (['payment_type', 'payment_received', 'payment_status'] as $field) {
            if (array_key_exists($field, $validated)) {
                $ride->$field = $validated[$field];
            }
        }

        $ride->save();

        return response()->json([
            'message' => $ride->wasRecentlyCreated ? 'Ride created successfully' : 'Ride updated successfully',
            'ride' => $ride,
        ]);
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
