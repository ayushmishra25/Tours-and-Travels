<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DriverDetailsUploadController;
// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); 
Route::middleware('auth:sanctum')->get('/profile', [AuthController::class, 'profile']);
Route::get('/profile/{id}', [AuthController::class, 'getUserProfile']);

Route::apiResource('driver-details', DriverDetailsUploadController::class);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);




