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
        'comapny_earning',
        'driver_share',
        'driver_paid',
        'driver_paid_at',
        'admin_approved',
        'admin_approved_at',
        'driver_settled',
        'driver_settled_at',
        'company_settled',
        'company_settled_at',
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
