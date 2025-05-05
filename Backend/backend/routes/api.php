<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DriverDetailsUploadController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\SupportRequestController;
use App\Http\Controllers\API\DriverController;

// 🔓 Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/listUsers', [AuthController::class, 'listUsers']);

// 🔐 Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('booking', BookingController::class);
    Route::apiResource('support', SupportRequestController::class);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings/{id}/assign-driver', [BookingController::class, 'assignDriver']);
    Route::get('/profile/{id}', [AuthController::class, 'getUserProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('support', SupportRequestController::class);
    Route::put('/support-requests/{id}/resolve', [SupportRequestController::class, 'markResolved']);
    Route::apiResource('driver-details', DriverDetailsUploadController::class);
    Route::get('/driver/rides', [BookingController::class, 'getRidesForDriver']);
    Route::get('/bookings/{user_id}', [BookingController::class, 'show']);
    Route::get('/drivers/{id}/details', [DriverDetailsUploadController::class, 'checkDetails']);



    // Driver-related Routes
    Route::prefix('drivers/{id}')->group(function () {
        Route::post('/toggle-availability', [DriverController::class, 'toggleAvailability']);
        Route::get('/drivers/{driverId}/toggle-availability', [DriverController::class, 'getAvailability']);
        Route::post('/add-slot', [DriverController::class, 'addTimeSlot']);
        Route::get('/slots', [DriverController::class, 'getTimeSlots']);
    });
});
