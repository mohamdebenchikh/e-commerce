<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'details' => $this->faker->paragraphs(3, true),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'is_featured' => $this->faker->boolean(20),
            'status' => $this->faker->randomElement(['draft', 'published']),
            'sku' => $this->faker->unique()->regexify('[A-Z]{2}[0-9]{6}'),
            'image' => 'products/default.jpg',
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Product $product) {
            // Attach random categories (1-3)
            $categories = Category::inRandomOrder()->limit(rand(1, 3))->get();
            $product->categories()->attach($categories);

            // Create 1-4 additional product images
            $imageCount = rand(1, 4);
            for ($i = 0; $i < $imageCount; $i++) {
                $product->images()->create([
                    'url' => 'products/additional-' . $i . '.jpg'
                ]);
            }
        });
    }

    /**
     * Indicate that the product is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
