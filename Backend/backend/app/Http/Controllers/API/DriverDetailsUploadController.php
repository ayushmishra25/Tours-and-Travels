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

    // Show driver details by user ID
    public function show($id)
    {
        $details = DriverDetailsUpload::where('user_id', $id)->first();

        if (!$details) {
            return response()->json([
                'message' => 'Details not found',
                'detailsExist' => false
            ], 404);
        }

        // Convert file paths to full URLs
        $convertToUrl = fn($filePath) => $filePath ? asset("storage/{$filePath}") : null;

        return response()->json([
            'detailsExist' => true,
            'photo' => $convertToUrl($details->photo),
            'education' => $details->education,
            'age' => $details->age,
            'exact_location' => $details->exact_location,
            'pincode' => $details->pincode,
            'zone' => $details->zone,
            'driving_experience' => $details->driving_experience,
            'car_driving_experience' => $details->car_driving_experience,
            'driving_licence_front' => $convertToUrl($details->driving_licence_front),
            'driving_licence_back' => $convertToUrl($details->driving_licence_back),
            'type_of_driving_licence' => $details->type_of_driving_licence,
            'aadhar_card_front' => $convertToUrl($details->aadhar_card_front),
            'aadhar_card_back' => $convertToUrl($details->aadhar_card_back),
            'passbook_front' => $convertToUrl($details->passbook_front),
            'account_number' => $details->account_number,
            'bank_name' => $details->bank_name,
            'ifsc_code' => $details->ifsc_code,
            'account_holder_name' => $details->account_holder_name,
            'family_contacts' => $details->family_contacts ?? [],
        ]);
    }

    // Store new driver details
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
            'driving_licence_front' => 'required|image',
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

        $validatedData['user_id'] = Auth::id();

        // Handle file uploads
        $fileFields = [
            'photo', 'driving_licence_front', 'driving_licence_back',
            'aadhar_card_front', 'aadhar_card_back', 'passbook_front'
        ];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $validatedData[$field] = $request->file($field)->store('uploads/driver', 'public');
            }
        }

        $familyContacts = $request->input('family_contacts', []);
        $validatedData['family_contacts'] = $familyContacts;

        $driver = DriverDetailsUpload::create($validatedData);

        return response()->json([
            'message' => 'Driver details saved successfully',
            'data' => $driver
        ], 201);
    }


    public function update(Request $request, $id)
    {
        \Log::info("🔄 Driver update called for user_id: {$id}");
        \Log::info("📥 Incoming Request:", $request->all());

        $driver = DriverDetailsUpload::where('user_id', $id)->first();

        if (!$driver) {
            return response()->json(['message' => 'Driver details not found.'], 404);
        }

        $data = $request->validate([
            'photo' => 'nullable|image',
            'education' => 'sometimes|string',
            'age' => 'sometimes|integer',
            'exact_location' => 'sometimes|string',
            'pincode' => 'sometimes|string',
            'zone' => 'sometimes|string',
            'driving_experience' => 'sometimes|integer',
            'car_driving_experience' => 'sometimes|string',
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

        \Log::info("✅ Validated data (before file upload):", $data);

        // Handle file uploads
        $fileFields = [
            'photo', 'driving_licence_front', 'driving_licence_back',
            'aadhar_card_front', 'aadhar_card_back', 'passbook_front'
        ];

        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('uploads/driver', 'public');
                \Log::info("📂 Uploaded file: {$field} => {$data[$field]}");
            }
        }

        // Parse family_contacts from flat request structure
        $familyContacts = [];
        foreach ($request->all() as $key => $value) {
            if (preg_match('/^family_contacts\[(\d+)\]\[(name|relation|contact)\]$/', $key, $matches)) {
                $index = $matches[1];
                $field = $matches[2];
                $familyContacts[$index][$field] = $value;
            }
        }

        if (!empty($familyContacts)) {
            ksort($familyContacts); // Optional, keep order
            $data['family_contacts'] = array_values($familyContacts); // Re-index
            \Log::info("👨‍👩‍👧 Parsed family_contacts:", $data['family_contacts']);
        } else {
            \Log::info("ℹ️ No valid family_contacts found.");
        }

        \Log::info("📝 Final data before update:", $data);

        $driver->update($data);

        \Log::info("✅ Driver details updated successfully for user_id: {$id}");

        return response()->json([
            'message' => 'Driver details updated successfully',
            'data' => $driver
        ]);
    }


    // check details 
    // details api 
    public function checkDetails($id)
    {
        $detailsExist = DriverDetailsUpload::where('user_id', $id)->exists();

        return response()->json([
            'detailsExist' => $detailsExist
        ]);
    }

    // Delete a driver record
    public function destroy($id)
    {
        $driver = DriverDetailsUpload::findOrFail($id);
        $driver->delete();

        return response()->json([
            'message' => 'Driver details deleted successfully'
        ]);
    }
}
