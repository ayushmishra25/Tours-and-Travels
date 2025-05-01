<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RideRequest extends Model
{
    use HasFactory;

    protected $table = 'ride_requests';

    protected $fillable = [
        'driver_id',
        'date',
        'start',
        'end',
    ];

    /**
     * Relationship to the driver (user).
     */
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
