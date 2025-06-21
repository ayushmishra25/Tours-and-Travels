<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DriverDetailsUploadController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\SupportRequestController;
use App\Http\Controllers\API\DriverController;
use App\Http\Controllers\API\InvoiceController;
use App\Http\Controllers\API\DriverRideController;
use App\Http\Controllers\API\EarningController;


// 🔓 Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/listUsers', [AuthController::class, 'listUsers']);
Route::get('/geocode', [BookingController::class, 'geocode']);
Route::post('/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);


// 🔐 Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth-related
    Route::get('/profile/{id}', [AuthController::class, 'getUserProfile']);
    Route::put('/profile/{id}', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Booking-related
    Route::apiResource('bookings', BookingController::class);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{user_id}', [BookingController::class, 'show']);
    Route::post('/bookings/{id}/assign-driver', [BookingController::class, 'assignDriver']);
    Route::get('/booking/{booking_id}', [BookingController::class, 'getDriverDetails']);
    Route::get('/driver/rides', [BookingController::class, 'getRidesForDriver']);
    Route::get('/admin/driver-rides/{driverId}', [BookingController::class, 'getRidesForDriverById']);

    

    // Support-related
    Route::apiResource('support', SupportRequestController::class);
    Route::put('/support-requests/{id}/resolve', [SupportRequestController::class, 'markResolved']);

    // Driver Details
    Route::apiResource('driver-details', DriverDetailsUploadController::class);
    Route::put('/driver-details/edit/{id}', [DriverDetailsUploadController::class, 'update']);
    Route::get('/drivers/{id}/details', [DriverDetailsUploadController::class, 'checkDetails']);

    // Invoice
    Route::get('/invoice/{booking_id}', [InvoiceController::class, 'getInvoice']);
    Route::get('/booking/{booking_id}/payment', [InvoiceController::class, 'getPayment']);


    // Driver Rides
    Route::apiResource('driver-rides', DriverRideController::class);

    // Driver Earning
    Route::post('/finalize-payment/{booking_id}', [EarningController::class, 'finalizePayment']);
    Route::get('/driver-earnings/{user_id}', [EarningController::class, 'getDriverEarnings']);


    // Driver-related Routes
    Route::prefix('drivers/{id}')->group(function () {
        Route::post('/toggle-availability', [DriverController::class, 'toggleAvailability']);
        Route::get('/toggle-availability', [DriverController::class, 'getAvailability']);
        Route::post('/add-slot', [DriverController::class, 'addTimeSlot']);
        Route::get('/slots', [DriverController::class, 'getTimeSlots']);
    });
});
