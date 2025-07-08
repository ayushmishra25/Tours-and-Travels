<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DriverDetailsUpload; 
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use App\Helpers\SnsHelper;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;



class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:10|unique:users',
            'location' => 'required|string',
            'role' => 'required|in:0,1',
            'password' => 'required|string|min:8|same:confirm_password',
            'confirm_password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone, // FIXED
            'location' => $request->location,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'token' => $token,
            'user' => $user
        ], 201);
    }

    /**
     * Send login 
     */
     /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;

        // Determine redirect path based on role
        $redirect = match ($user->role) {
            0 => 'user',
            1 => 'driver',
            2 => 'admin',
        };

        $detailsUploaded = false;
        if ($user->role == 1) { // driver role
            $detailsUploaded = DriverDetailsUpload::where('user_id', $user->id)->exists();
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
            'role' => $user->role,
            'redirect' => $redirect,
            'detailsUploaded' => $detailsUploaded
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get the authenticated user's profile
     */
    public function getUserProfile($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'user' => $user
        ], 200);
    }


    // listing API of users and drivers 
    public function listUsers(Request $request)
    {
        $role = $request->query('role');

        if ($role == 0) {
            $users = User::where('role', 0)->get();
        } elseif ($role == 1) {
            $users = User::where('role', 1)
                ->leftJoin('driver_details_uploads', 'users.id', '=', 'driver_details_uploads.user_id')
                ->select(
                    'users.*',
                    'driver_details_uploads.exact_location as location',
                    'users.location as current_location'
                )
                ->get();
        } else {
            $users = User::all();
        }

        return response()->json([
            'users' => $users
        ], 200);
    }


    public function updateProfile(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->name = $request->name;
        $user->location = $request->location;
        $user->save();

        return response()->json([
            'message' => 'User profile updated successfully.',
            'user' => $user
        ]);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $otp = rand(100000, 999999);
        $cacheKey = 'otp_' . $request->email;

        Cache::put($cacheKey, $otp, now()->addMinutes(5)); // Store OTP for 5 minutes

        // Send the OTP to the user's email
        Mail::to($request->email)->send(new OtpMail($otp));

        return response()->json(['message' => 'OTP sent to email.']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|digits:6',
        ]);

        $cacheKey = 'otp_' . $request->email;
        $storedOtp = Cache::get($cacheKey);

        if (!$storedOtp || $storedOtp != $request->otp) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        // OTP is valid — remove it from cache
        Cache::forget($cacheKey);

        // ✅ Set verification flag for password reset
        Cache::put('otp_verified_' . $request->email, true, now()->addMinutes(10)); // Optional TTL

        return response()->json(['message' => 'OTP verified successfully']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check OTP verified flag
        if (!Cache::get('otp_verified_' . $request->email)) {
            return response()->json(['message' => 'OTP not verified or session expired'], 403);
        }

        // Reset the user's password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Clear OTP flag to prevent reuse
        Cache::forget('otp_verified_' . $request->email);

        return response()->json(['message' => 'Password reset successful']);
    }

}
