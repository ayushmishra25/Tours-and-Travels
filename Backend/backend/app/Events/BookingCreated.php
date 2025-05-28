<?php

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class BookingCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data; // contains pincode, user info, etc.
    }

    public function broadcastOn()
    {
        return new Channel('drivers'); // public channel
    }

    public function broadcastAs()
    {
        return 'booking.created';
    }
}


