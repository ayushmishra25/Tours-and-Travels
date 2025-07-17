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
        $ride = DriverRide::where('booking_id', $booking_id)->first();

        if (!$ride) {
            return $this->handleCashFlow($booking_id);
        }

        if (!$ride->payment_status) {
            return response()->json([
                'message' => 'Payment is not completed or not received yet.',
            ], 400);
        }

        if ($ride->payment_type === 'upi') {
            return $this->handleUPIFlow($booking_id, $ride);
        }

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
            'company_settled' => true,
            'company_settled_at' => now(),
            'admin_approved' => true,
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
            'driver_paid' => false,
            'admin_approved' => false,
            'driver_settled' => false,
        ]);

        return response()->json([
            'message' => 'Earnings finalized via Cash. Awaiting driver settlement.',
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

    // POST /driver-settle-request
    public function driverSettleRequest(Request $request)
    {
        $request->validate([
            'earning_id' => 'required|exists:driver_earnings,id',
        ]);

        $earning = Earning::findOrFail($request->earning_id);

        if ($earning->driver_paid) {
            return response()->json(['message' => 'Already marked as paid by driver.'], 400);
        }

        $earning->driver_paid = true;
        $earning->driver_paid_at = now();
        $earning->save();

        return response()->json(['message' => 'Marked as paid. Pending admin approval.']);
    }

    // admin-confirm-driver-payment
    public function adminConfirmDriverPayment(Request $request)
    {
        $request->validate([
            'earning_id' => 'required|exists:driver_earnings,id',
        ]);

        $earning = Earning::findOrFail($request->earning_id);

        // 🛠 Only require driver_paid for CASH payments
        if ($earning->payment_type === 'cash' && !$earning->driver_paid) {
            return response()->json(['message' => 'Driver has not marked as paid yet.'], 400);
        }

        if ($earning->admin_approved) {
            return response()->json(['message' => 'Already approved by admin.'], 400);
        }

        $earning->admin_approved = true;
        $earning->admin_approved_at = now();
        $earning->driver_settled = true;
        $earning->driver_settled_at = now();
        $earning->save();

        return response()->json(['message' => 'Driver payment confirmed and settled.']);
    }

    // Earning Records
    public function getDriverEarningRecords($user_id)
    {
        $records = Earning::where('user_id', $user_id)
            ->select('id', 'booking_id', 'payment_type', 'driver_earning', 'company_share', 'comapny_earning', 'driver_share', 'driver_paid', 'admin_approved', 'driver_settled', 'company_settled')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['records' => $records]);
    }

}
