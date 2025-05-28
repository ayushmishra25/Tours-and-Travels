<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TimeSlot;
use App\Models\RideRequest;
use App\Models\FutureRide;

class DriverController extends Controller
{
   public function toggleAvailability(Request $request, $driverId)
    {
        $user = User::findOrFail($driverId);

        $user->is_available = !$user->is_available;

        // Save location and coordinates
        if ($request->has(['latitude', 'longitude', 'location'])) {
            $user->latitude = $request->latitude;
            $user->longitude = $request->longitude;
            $user->location = $request->location;
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'available' => $user->is_available ? 'Active' : 'Inactive'
        ]);
    }


    public function getAvailability($driverId)
    {
        // Find the user by driverId
        $user = User::findOrFail($driverId);

        // Return the availability status
        return response()->json([
            'status' => 'success',
            'available' => $user->is_available ? 'Active' : 'Inactive'
        ]);
    }

    
    // Add a time slot for a driver
    public function addTimeSlot(Request $request, $driverId)
    {

        $slot = TimeSlot::create([
            'driver_id' => $driverId,
            'start' => $request->start,
            'end' => $request->end,
            'date' => $request->date,
        ]);

        return response()->json($slot);
    }

    // Get all time slots for a driver
    public function getTimeSlots($driverId)
    {
        return TimeSlot::where('driver_id', $driverId)->get();
    }

    // Get all pending ride requests for a driver
    public function getRideRequests($driverId)
    {
        return RideRequest::where('driver_id', $driverId)->get();
    }

    // Accept a ride request
    public function acceptRide($driverId, $requestId)
    {
        $request = RideRequest::where('driver_id', $driverId)->findOrFail($requestId);

        // Assuming 'pickup', 'destination', and 'time' come from ride request
        FutureRide::create([
            'driver_id' => $driverId,
            'pickup' => $request->pickup ?? 'PickupPoint',
            'destination' => $request->destination ?? 'DestinationPoint',
            'time' => $request->start,
            'date' => $request->date,
        ]);

        // Optionally delete the request or mark it accepted if you add such a field
        $request->delete();

        return response()->json(['status' => 'accepted']);
    }

    // Decline a ride request
    public function declineRide($driverId, $requestId)
    {
        RideRequest::where('driver_id', $driverId)->where('id', $requestId)->delete();
        return response()->json(['status' => 'declined']);
    }

    // Get all future rides for a driver
    public function getFutureRides($driverId)
    {
        return FutureRide::where('driver_id', $driverId)->get();
    }
}
