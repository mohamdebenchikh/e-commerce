<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['male', 'female']);
        $paymentMethod = fake()->randomElement(['cash', 'bank']);
        
        return [
            'first_name' => fake()->firstName($gender),
            'last_name' => fake()->lastName(),
            'photo' => null,
            'bio' => fake()->text(200),
            'national_id' => strtoupper(fake()->bothify('??######')),
            'phone' => fake()->unique()->numerify('+212#########'),
            'gender' => $gender,
            'country' => 'morocco',
            'city' => fake()->city(),
            'payment_method' => $paymentMethod,
            'bank_name' => $paymentMethod === 'bank' ? fake()->company() : null,
            'rib_number' => $paymentMethod === 'bank' ? fake()->numerify('########################') : null,
            'active' => true,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user uses bank payment method.
     */
    public function bankPayment(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'bank',
            'bank_name' => fake()->company(),
            'rib_number' => fake()->numerify('###############'),
        ]);
    }

    /**
     * Indicate that the user uses cash payment method.
     */
    public function cashPayment(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'cash',
            'bank_name' => null,
            'rib_number' => null,
        ]);
    }
}
