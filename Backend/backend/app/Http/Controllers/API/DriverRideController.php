<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DriverRide;
use Illuminate\Http\Request;

class DriverRideController extends Controller
{
    /**
     * Store a new driver ride.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'payment_type' => 'nullable|in:cash,upi',
            'payment_received' => 'nullable|boolean',
            'payment_status' => 'nullable|boolean',
        ]);

        // Prevent duplicate ongoing ride for a booking
        $existingRide = DriverRide::where('booking_id', $validated['booking_id'])
            ->whereNull('end_ride')
            ->first();

        if ($existingRide) {
            return response()->json([
                'message' => 'This booking already has an ongoing ride.'
            ], 422);
        }

        $data = [
            'booking_id' => $validated['booking_id'],
            'start_ride' => now(),
            'payment_type' => $validated['payment_type'] ?? null,
            'payment_received' => $validated['payment_received'] ?? false,
            'payment_status' => $validated['payment_status'] ?? false,
        ];

        $ride = DriverRide::create($data);

        return response()->json([
            'message' => 'Ride started',
            'ride' => $ride,
        ]);
    }

    // Update API
    public function update(Request $request, $id)
    {
        $ride = DriverRide::findOrFail($id);

        $validated = $request->validate([
            'driver_id' => 'nullable|exists:users,id',
            'end_ride' => 'nullable|date',
            'payment_type' => 'nullable|in:cash,upi',
            'payment_received' => 'nullable|boolean',
            'payment_status' => 'nullable|boolean',
        ]);

        if (isset($validated['driver_id'])) {
            $ride->driver_id = $validated['driver_id'];
        }

        // Default end_ride to now if missing or null
        if (!$request->has('end_ride') || is_null($validated['end_ride'] ?? null)) {
            $ride->end_ride = now();
        } else {
            $ride->end_ride = $validated['end_ride'];
        }

        foreach (['payment_type', 'payment_received', 'payment_status'] as $field) {
            if ($request->has($field)) {
                $ride->$field = $validated[$field];
            }
        }

        $ride->save();

        return response()->json([
            'message' => 'Ride updated successfully',
            'ride' => $ride,
        ]);
    }

}