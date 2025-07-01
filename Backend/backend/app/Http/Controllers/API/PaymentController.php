<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Razorpay\Api\Api;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

        $order = $api->order->create([
            'receipt' => 'order_rcptid_' . time(),
            'amount' => $request->amount * 100,
            'currency' => 'INR'
        ]);

        return response()->json([
            'order_id' => $order->id,
            'amount' => $order->amount,
            'currency' => $order->currency,
            'key' => env('RAZORPAY_KEY'),
        ]);
    }

    public function verifyPayment(Request $request)
    {
        $data = $request->all();

        $generated_signature = hash_hmac(
            'sha256',
            $data['order_id'] . "|" . $data['payment_id'],
            env('RAZORPAY_SECRET')
        );

        if ($generated_signature === $data['signature']) {
            return response()->json(['status' => 'success']);
        } else {
            return response()->json(['status' => 'failure'], 400);
        }
    }

}
