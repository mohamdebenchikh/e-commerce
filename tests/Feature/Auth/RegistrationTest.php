<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'phone' => '+1234567890',
        'gender' => 'male',
        'national_id' => 'ABC123456',
        'country' => 'Morocco',
        'city' => 'Casablanca',
        'payment_method' => 'bank',
        'bank_name' => 'Test Bank',
        'rib_number' => '1234567890123456',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration requires all fields', function () {
    $response = $this->post('/register', []);

    $response->assertSessionHasErrors([
        'first_name',
        'last_name',
        'phone',
        'gender',
        'national_id',
        'country',
        'city',
        'payment_method',
        'bank_name',
        'rib_number',
        'email',
        'password',
    ]);
});

test('registration validates unique fields', function () {
    // Create a user first
    $existingUser = \App\Models\User::factory()->create([
        'email' => 'existing@example.com',
        'phone' => '+1234567890',
        'national_id' => 'ABC123456',
        'rib_number' => '1234567890123456',
    ]);

    $response = $this->post('/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'phone' => '+1234567890', // Duplicate
        'gender' => 'male',
        'national_id' => 'ABC123456', // Duplicate
        'country' => 'Morocco',
        'city' => 'Casablanca',
        'payment_method' => 'bank',
        'bank_name' => 'Test Bank',
        'rib_number' => '1234567890123456', // Duplicate
        'email' => 'existing@example.com', // Duplicate
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertSessionHasErrors([
        'email',
        'phone',
        'national_id',
        'rib_number',
    ]);
});