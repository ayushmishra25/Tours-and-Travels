<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Booking;

class Earning extends Model
{
    use HasFactory;

    protected $table = 'driver_earnings';

    protected $fillable = [
        'user_id',
        'booking_id',
        'payment_type',
        'driver_earning',
        'company_share',
        'comapny_earning', // Note: There's a typo in the column name — see note below
        'driver_share',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
