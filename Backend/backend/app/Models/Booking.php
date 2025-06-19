<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 
use App\Models\User;

class Booking extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'booking_type',
        'trip_type',
        'zone',
        'source_location',
        'source_pincode',
        'destination_location',
        'vehicle_details',
        'hours',
        'working_days',
        'working_hours_per_day',
        'payment',
        'start_date',
        'booking_datetime',
        'driver_name',
        'driver_contact',
        'driver_location',
        'is_selected'
    ];

    /**
     * Get the user that owns the booking.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
