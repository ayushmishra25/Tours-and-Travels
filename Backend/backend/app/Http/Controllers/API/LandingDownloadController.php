<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Landing;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LandingDownloadController extends Controller
{
    public function export()
    {
        $csvData = [];
        $csvData[] = ['Name', 'Mobile Number', 'City Location', 'Service Type'];

        foreach (Landing::all() as $landing) {
            $csvData[] = [
                $landing->name,
                $landing->mobile_number,
                $landing->city_location,
                $landing->service_type,
            ];
        }

        // Convert array to CSV string
        $handle = fopen('php://temp', 'r+');
        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        // Save file to public disk
        Storage::disk('public')->put('landing_data.csv', $csv);

        return response()->json([
            'message' => 'CSV file saved to public storage.',
            'download_url' => asset('storage/landing_data.csv'),
        ]);
    }
}
