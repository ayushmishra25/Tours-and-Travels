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
            'phone' => 'required|string|max:10|unique:users',  // FIXED: changed from 'contact' to 'phone'
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

}
