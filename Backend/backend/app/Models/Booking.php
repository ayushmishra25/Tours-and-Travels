<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'booking_type',
        'trip_type',
        'zone',
        'source_location',
        'destination_location',
        'hours',
        'working_days',
        'working_hours_per_day',
        'payment',
        'start_date',
        'booking_datetime',
    ];

    /**
     * Get the user that owns the booking.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
