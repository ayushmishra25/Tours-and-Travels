<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;

class InvoiceController extends Controller
{
    public function getInvoice($booking_id)
    {
        // Fetch booking with user relation
        $booking = Booking::with('user')->find($booking_id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        $totalAmount = $booking->payment;
        $taxAmount = round($totalAmount * 0.05, 2);
        $subtotal = round($totalAmount - $taxAmount, 2);
        $invoiceNumber = 'INV' . date('Ymd') . '-' . str_pad($booking_id, 4, '0', STR_PAD_LEFT);


        return response()->json([
            'name' => $booking->user->name,
            'address' => $booking->user->location,
            'email' => $booking->user->email,
            'contact' => $booking->user->phone,
            'service_type' => $booking->booking_type,
            'booking_datetime' => $booking->booking_datetime,
            'payment_date' => $booking->payment_date,
            'night_charge_applied' => $booking->night_charge_applied,
            'payment' => $totalAmount,
            'subtotal' => $subtotal,
            'GST' => $taxAmount,
            'total_amount' => $totalAmount,
            'invoiceNumber' => $invoiceNumber,
            'invoiceDate' => now()->toDateString(), 
        ]);
    }

    public function getPayment($booking_id)
    {
        $booking = Booking::find($booking_id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        return response()->json([
            'payment' => $booking->payment,
            'booking_type' => $booking->booking_type
        ]);
    }
}
