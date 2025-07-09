<?php

use App\Models\City;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('register page loads with cities data', function () {
    // Create some test cities
    City::create([
        'ar_name' => 'الرباط',
        'fr_name' => 'Rabat',
        'en_name' => 'Rabat',
        'shipping_cost' => '30'
    ]);
    
    City::create([
        'ar_name' => 'الدار البيضاء',
        'fr_name' => 'Casablanca',
        'en_name' => 'Casablanca',
        'shipping_cost' => '30'
    ]);

    $response = $this->get('/register');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('auth/register')
             ->has('cities', 2)
             ->where('cities.0.name', 'Rabat')
             ->where('cities.1.name', 'Casablanca')
    );
});

test('user can register with city id', function () {
    // Create a test city
    $city = City::create([
        'ar_name' => 'الدار البيضاء',
        'fr_name' => 'Casablanca',
        'en_name' => 'Casablanca',
        'shipping_cost' => '30'
    ]);

    $response = $this->post('/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'phone' => '+1234567890',
        'gender' => 'male',
        'national_id' => 'ABC123456',
        'country' => 'Morocco',
        'city' => $city->id, // Pass city ID instead of name
        'payment_method' => 'cash',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    
    // Verify the user was created with the correct city name
    $user = \App\Models\User::where('email', 'test@example.com')->first();
    expect($user->city)->toBe('Casablanca');
});

test('registration fails with invalid city id', function () {
    $response = $this->post('/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'phone' => '+1234567890',
        'gender' => 'male',
        'national_id' => 'ABC123456',
        'country' => 'Morocco',
        'city' => 999, // Invalid city ID
        'payment_method' => 'cash',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors(['city']);
    $this->assertGuest();
});
