<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class CheckSessionUserExists
{
    public function handle($request, Closure $next)
    {
        \Log::info('CheckSessionUserExists middleware running.');
        if (Auth::check()) {
            $user = Auth::user();
            if (!$user || !($user instanceof User) || !$user->id || !User::where('id', $user->id)->exists()) {
                \Log::info('User does not exist. Logging out.');
                Auth::logout();
                Session::flush();
                Session::regenerateToken();
                return redirect('/');
            }
        }
        return $next($request);
    }
}
