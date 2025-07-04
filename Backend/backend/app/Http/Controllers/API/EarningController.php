<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DriverRide;
use App\Models\Booking;
use App\Models\User;
use App\Models\Earning;

class EarningController extends Controller
{
    // POST /finalize-payment/{booking_id}
    public function finalizePayment(Request $request, $booking_id)
    {
        // Step 1: Find the ride (or fail)
        $ride = DriverRide::where('booking_id', $booking_id)->first();

        if (!$ride) {
            // No driver_rides record? Assume cash flow
            return $this->handleCashFlow($booking_id);
        }

        // Step 2: Check if payment completed
        if (!$ride->payment_status) {
            return response()->json([
                'message' => 'Payment is not completed or not received yet.',
            ], 400);
        }

        // Step 3: If UPI and payment done => only UPI logic
        if ($ride->payment_type === 'upi') {
            return $this->handleUPIFlow($booking_id, $ride);
        }

        // Step 4: If anything else (e.g., cash), fallback to cash flow
        return $this->handleCashFlow($booking_id, $ride);
    }

    private function handleUPIFlow($booking_id, $ride)
    {
        $booking = Booking::findOrFail($booking_id);
        $driverContact = $booking->driver_contact ?? null;
        $paymentAmount = $booking->payment ?? 0;

        if (!$driverContact || $paymentAmount <= 0) {
            return response()->json(['message' => 'Invalid driver contact or payment amount.'], 400);
        }

        $driver = User::where('phone', $driverContact)->first();
        if (!$driver) {
            return response()->json(['message' => 'Driver not found.'], 404);
        }

        $companyEarning = round($paymentAmount * 0.20, 2);
        $driverShare = round($paymentAmount * 0.80, 2);

        Earning::create([
            'user_id' => $driver->id,
            'booking_id' => $booking_id,
            'payment_type' => 'upi',
            'driver_earning' => 0,
            'company_share' => 0,
            'comapny_earning' => $companyEarning,
            'driver_share' => $driverShare,
        ]);

        return response()->json([
            'message' => 'Earnings finalized via UPI.',
            'user_id' => $driver->id,
            'payment_type' => 'upi',
            'driver_earning' => 0,
            'company_share' => 0,
            'company_earning' => $companyEarning,
            'driver_share' => $driverShare,
        ]);
    }

    private function handleCashFlow($booking_id, $ride = null)
    {
        $booking = Booking::findOrFail($booking_id);
        $driverContact = $booking->driver_contact ?? null;
        $paymentAmount = $booking->payment ?? 0;

        if (!$driverContact || $paymentAmount <= 0) {
            return response()->json(['message' => 'Invalid driver contact or payment amount.'], 400);
        }

        $driver = User::where('phone', $driverContact)->first();
        if (!$driver) {
            return response()->json(['message' => 'Driver not found.'], 404);
        }

        $driverEarning = round($paymentAmount * 0.80, 2);
        $companyShare = round($paymentAmount * 0.20, 2);

        Earning::create([
            'user_id' => $driver->id,
            'booking_id' => $booking_id,
            'payment_type' => 'cash',
            'driver_earning' => $driverEarning,
            'company_share' => $companyShare,
            'comapny_earning' => 0,
            'driver_share' => 0,
        ]);

        return response()->json([
            'message' => 'Earnings finalized via Cash.',
            'user_id' => $driver->id,
            'payment_type' => 'cash',
            'driver_earning' => $driverEarning,
            'company_share' => $companyShare,
            'company_earning' => 0,
            'driver_share' => 0,
        ]);
    }

    // GET /driver-earnings/{user_id}
    public function getDriverEarnings($user_id)
    {
        $totals = Earning::where('user_id', $user_id)
            ->selectRaw('
                SUM(driver_earning) as total_driver_earning,
                SUM(company_share) as total_company_share,
                SUM(comapny_earning) as total_company_earning,
                SUM(driver_share) as total_driver_share
            ')
            ->first();

        return response()->json([
            'user_id' => $user_id,
            'total_driver_earning' => round($totals->total_driver_earning, 2),
            'total_company_share' => round($totals->total_company_share, 2),
            'total_company_earning' => round($totals->total_company_earning, 2),
            'total_driver_share' => round($totals->total_driver_share, 2),
        ]);
    }

}
