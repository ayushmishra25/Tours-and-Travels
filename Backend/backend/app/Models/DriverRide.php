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
        'payment_type',
        'payment_received',
        'payment_status',
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
    'payment_received' => 'boolean',
    'payment_status' => 'boolean',
    ];
}
