<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Landing;
use Illuminate\Support\Facades\Storage;

class LandingDownloadController extends Controller
{
    public function export()
    {
        $csvData = [];
        
        // Header row for CSV
        $csvData[] = ['Name', 'Mobile Number', 'City Location', 'Service Type'];

        // Populate with data
        foreach (Landing::all() as $landing) {
            $csvData[] = [
                $landing->name,
                $landing->mobile_number,
                $landing->city_location,
                $landing->service_type,
            ];
        }

        // Write to temporary memory
        $handle = fopen('php://temp', 'r+');

        // Add UTF-8 BOM for Excel compatibility
        fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        // Save to storage/app/public/landing_data.csv
        Storage::disk('public')->put('landing_data.csv', $csv);
         
         \Log::info('CSV generated', ['csv' => $csv]);

        return response()->json([
            'message' => 'CSV file saved to public storage.',
            'file_path' => 'storage/landing_data.csv',
            'download_url' => asset('storage/landing_data.csv'),
        ]);
    }

    public function download()
    {
        $this->export();
        $file = storage_path('app/public/landing_data.csv');
        if (!file_exists($file)) {
            return response()->json(['message' => 'File not found.'], 404);
        }
        return response()->download($file, 'landing_data.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }
}
