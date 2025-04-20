<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware {

    /**
     * Handle unauthorized requests properly.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request) {
        /*
        if (! $request->expectsJson()) {
            return route('login');
        }
         * 
         */
        return null;
    }

    protected function unauthenticated($request, array $guards) {
        $response = ['success' => false, 'message' => 'Authentication failed. Please log in.'];
        abort(response()->json($response, 401));
    }
}
