<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Landing;
use App\Observers\LandingObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Landing::observe(LandingObserver::class);
    }
}
