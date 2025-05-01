<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FutureRide extends Model
{
    use HasFactory;

    protected $table = 'future_rides';

    protected $fillable = [
        'driver_id',
        'pickup',
        'destination',
        'time',
        'date',
    ];

    /**
     * Relationship to the driver (user).
     */
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
