<?php

namespace App\Observers;

use App\Models\Landing;
use Spatie\SimpleExcel\SimpleExcelWriter;

class LandingObserver
{
    public function created(Landing $landing)
    {
        $this->syncExcel();
    }

    public function updated(Landing $landing)
    {
        $this->syncExcel();
    }

    public function deleted(Landing $landing)
    {
        $this->syncExcel();
    }

    protected function syncExcel()
    {
        $filePath = storage_path('app/public/landings.csv');

        $writer = SimpleExcelWriter::create($filePath);

        $landings = Landing::all()->map(function ($landing) {
            return [
                'ID'            => $landing->id,
                'Name'          => $landing->name,
                'Mobile Number' => $landing->mobile_number,
                'City'          => $landing->city_location,
                'Service'       => $landing->service_type,
            ];
        });

        $writer->addRows($landings->toArray());
    }
}
