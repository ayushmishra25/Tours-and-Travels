<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory;

    protected $table = 'time_slots';

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
