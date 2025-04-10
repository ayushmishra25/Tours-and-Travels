<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverDetailsUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'photo',
        'education',
        'age',
        'exact_location',
        'pincode',
        'zone',
        'driving_experience',
        'car_driving_experience',
        'driving_licence_front',
        'driving_licence_back',
        'type_of_driving_licence',
        'aadhar_card_front',
        'aadhar_card_back',
        'passbook_front',
        'account_number',
        'bank_name',
        'ifsc_code',
        'account_holder_name',
    ];
}
