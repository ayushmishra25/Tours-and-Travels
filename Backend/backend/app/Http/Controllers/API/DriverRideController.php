<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DriverRide;
use Illuminate\Http\Request;

class DriverRideController extends Controller
{
    /**
     * Store or update a driver ride based on booking_id.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'payment_type' => 'nullable|in:cash,upi',
            'payment_received' => 'nullable|boolean',
            'payment_status' => 'nullable|boolean',
        ]);

        // Check if a ride already exists for the booking_id
        $existingRide = DriverRide::where('booking_id', $validated['booking_id'])->first();

        $data = [
            'payment_type' => $validated['payment_type'] ?? null,
            'payment_received' => $validated['payment_received'] ?? false,
            'payment_status' => $validated['payment_status'] ?? false,
        ];

        if ($existingRide) {
            // Update existing ride
            $existingRide->update($data);

            return response()->json([
                'message' => 'Ride updated successfully',
                'ride' => $existingRide,
            ]);
        } else {
            // Insert new ride
            $ride = DriverRide::create(array_merge([
                'booking_id' => $validated['booking_id'],
                'start_ride' => now(),
            ], $data));

            return response()->json([
                'message' => 'Ride started',
                'ride' => $ride,
            ]);
        }
    }

    /**
     * Update an existing driver ride by ride ID.
     */
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

    /**
     * Get ride details by booking_id.
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
