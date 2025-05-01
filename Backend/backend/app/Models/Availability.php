<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'name',
        'is_available',
    ];

    // Relationship: Availability belongs to a User (Driver)
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
