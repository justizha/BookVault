<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role?->name, $roles, true)) {
            return response()->json([
                'message' => 'You do not have permission to perform this action',
            ], 403);
        }

        return $next($request);
    }
}