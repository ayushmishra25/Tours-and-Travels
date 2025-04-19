<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DriverDetailsUploadController;
use App\Http\Controllers\API\BookingController;

// 🔓 Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/booking', [BookingController::class, 'store']); 
Route::get('/profile/{id}', [AuthController::class, 'getUserProfile']);

// 🔐 Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/booking', [BookingController::class, 'store']); 
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('driver-details', DriverDetailsUploadController::class);
});
