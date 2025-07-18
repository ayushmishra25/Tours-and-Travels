<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverRide extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'booking_id',
        'start_ride',
        'end_ride',
        'start_meter',
        'end_meter',
        'payment_type',
        'payment_status',
        'night_charge_applied'
    ];

    // Relationships
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    protected $casts = [
        'payment_status' => 'boolean',
    ];
}
