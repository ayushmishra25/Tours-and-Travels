<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

// Import your event and listener classes here
use App\Events\BookingCreated;
use App\Listeners\SendBookingNotification; // example listener

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        BookingCreated::class => [
            SendBookingNotification::class,  // example listener handling BookingCreated
        ],
        // Add other event-listener mappings here
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
