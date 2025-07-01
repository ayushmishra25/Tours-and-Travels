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
        $ride = DriverRide::where('booking_id', $booking_id)->firstOrFail();

        // Ensure payment is marked as completed and received
        if (!$ride->payment_status) {
            return response()->json([
                'message' => 'Payment is not completed or not received yet.',
            ], 400);
        }

        $booking = Booking::findOrFail($booking_id);
        $driverContact = $booking->driver_contact ?? null;
        $paymentAmount = $booking->payment ?? 0;

        if (!$driverContact || $paymentAmount <= 0) {
            return response()->json([
                'message' => 'Invalid driver contact or payment amount.',
            ], 400);
        }

        $driver = User::where('phone', $driverContact)->first();
        if (!$driver) {
            return response()->json(['message' => 'Driver not found.'], 404);
        }

        $driverEarning = 0;
        $companyShare = 0;
        $companyEarning = 0;
        $driverShare = 0;

        if ($ride->payment_type === 'cash') {
            // Driver got paid directly; owes 20% to company
            $driverEarning = round($paymentAmount * 0.80, 2); // what driver keeps
            $companyShare = round($paymentAmount * 0.20, 2);  // what company is owed
            $companyEarning = 0;
            $driverShare = 0;
        } elseif ($ride->payment_type === 'upi') {
            // Company received all; keeps 20%, owes 80% to driver
            $driverEarning = 0; 
            $companyShare = 0;
            $companyEarning = round($paymentAmount * 0.20, 2); // company keeps
            $driverShare = round($paymentAmount * 0.80, 2);   // what company owes to driver
        } else {
            return response()->json(['message' => 'Invalid payment type.'], 400);
        }

        // Save to database
        Earning::create([
            'user_id' => $driver->id,
            'booking_id' => $booking_id,
            'payment_type' => $ride->payment_type,
            'driver_earning' => $driverEarning,
            'company_share' => $companyShare,
            'comapny_earning' => $companyEarning, 
            'driver_share' => $driverShare,
        ]);

        return response()->json([
            'message' => 'Earnings finalized and stored.',
            'user_id' => $driver->id,
            'payment_type' => $ride->payment_type,
            'driver_earning' => $driverEarning,
            'company_share' => $companyShare,
            'company_earning' => $companyEarning,
            'driver_share' => $driverShare,
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
