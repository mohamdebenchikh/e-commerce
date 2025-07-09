<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        // Get all cities with localized names
        $cities = \App\Models\City::select('id', 'ar_name', 'en_name', 'fr_name')
            ->orderBy('en_name')
            ->get()
            ->map(function ($city) {
                return [
                    'id' => $city->id,
                    'name' => $city->name, // This uses the getNameAttribute() method
                ];
            });

        return Inertia::render('auth/register', [
            'cities' => $cities
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        try {
            // Get validated data from the custom request
            $validated = $request->validated();

            // Get city name from city ID
            $city = \App\Models\City::find($validated['city']);
            $cityName = $city ? $city->name : $validated['city'];

            // Create the user with all validated data
            $userData = [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'gender' => $validated['gender'],
                'national_id' => $validated['national_id'],
                'country' => $validated['country'],
                'city' => $cityName, // Store city name, not ID
                'payment_method' => $validated['payment_method'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'active' => true, // Set user as active by default
            ];

            // Only add bank fields if payment method is bank
            if ($validated['payment_method'] === 'bank') {
                $userData['bank_name'] = $validated['bank_name'];
                $userData['rib_number'] = $validated['rib_number'];
            }

            $user = User::create($userData);

            // Fire the registered event
            event(new Registered($user));

            // Log the user in
            Auth::login($user);

            // Redirect to dashboard with success message
            return redirect()->intended(route('dashboard', absolute: false))
                ->with('success', __('Account created successfully! Welcome to :app_name.', [
                    'app_name' => config('app.name')
                ]));

        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('User registration failed', [
                'error' => $e->getMessage(),
                'email' => $request->input('email'),
                'trace' => $e->getTraceAsString()
            ]);

            // Redirect back with error message
            return back()->withInput($request->except('password', 'password_confirmation'))
                ->withErrors(['general' => __('Registration failed. Please try again.')]);
        }
    }
}
