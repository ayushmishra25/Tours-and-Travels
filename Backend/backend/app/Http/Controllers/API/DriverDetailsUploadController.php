<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DriverDetailsUpload;
use Illuminate\Support\Facades\Auth;


class DriverDetailsUploadController extends Controller
{
    // List all driver records
    public function index()
    {
        return DriverDetailsUpload::all();
    }

    // Store a new driver record
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'photo' => 'nullable|image',
            'education' => 'required|string',
            'age' => 'required|integer',
            'exact_location' => 'required|string',
            'pincode' => 'required|string',
            'zone' => 'required|string',
            'driving_experience' => 'required|integer',
            'car_driving_experience' => 'required|string',
            'driving_licence_front' => 'nullable|image',
            'driving_licence_back' => 'nullable|image',
            'type_of_driving_licence' => 'required|string',
            'aadhar_card_front' => 'nullable|image',
            'aadhar_card_back' => 'nullable|image',
            'passbook_front' => 'nullable|image',
            'account_number' => 'required|string',
            'bank_name' => 'required|string',
            'ifsc_code' => 'required|string',
            'account_holder_name' => 'required|string',
        ]);

        // After validation, manually add user_id
        $validatedData['user_id'] = Auth::id();

        // Handling file uploads
        foreach (['photo', 'driving_licence_front', 'driving_licence_back', 'aadhar_card_front', 'aadhar_card_back', 'passbook_front'] as $field) {
            if ($request->hasFile($field)) {
                $validatedData[$field] = $request->file($field)->store('uploads/driver', 'public');
            }
        }

        $driver = DriverDetailsUpload::create($validatedData);

        return response()->json($driver, 201);
    }

    // Update a driver record
    public function update(Request $request, $id)
    {
        $driver = DriverDetailsUpload::findOrFail($id);

        $data = $request->validate([
            'photo' => 'nullable|image',
            'education' => 'sometimes|string',
            'age' => 'sometimes|integer',
            'exact_location' => 'sometimes|string',
            'pincode' => 'sometimes|string',
            'zone' => 'sometimes|string',
            'driving_experience' => 'sometimes|integer',
            'car_driving_experience' => 'sometimes|integer',
            'driving_licence_front' => 'nullable|image',
            'driving_licence_back' => 'nullable|image',
            'type_of_driving_licence' => 'sometimes|string',
            'aadhar_card_front' => 'nullable|image',
            'aadhar_card_back' => 'nullable|image',
            'passbook_front' => 'nullable|image',
            'account_number' => 'sometimes|string',
            'bank_name' => 'sometimes|string',
            'ifsc_code' => 'sometimes|string',
            'account_holder_name' => 'sometimes|string',
        ]);

        foreach (['photo', 'driving_licence_front', 'driving_licence_back', 'aadhar_card_front', 'aadhar_card_back', 'passbook_front'] as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('uploads/driver', 'public');
            }
        }

        $driver->update($data);
        return response()->json($driver);
    }

    // Delete a driver record
    public function destroy($id)
    {
        $driver = DriverDetailsUpload::findOrFail($id);
        $driver->delete();

        return response()->json(['message' => 'Driver details deleted successfully']);
    }
}

