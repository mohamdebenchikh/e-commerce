<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 20 random products using factory
        Product::factory()->count(20)->create()->each(function ($product) {
            // Randomly attach 1-3 categories to each product
            $categoryIds = Category::inRandomOrder()->limit(rand(1, 3))->pluck('id');
            $product->categories()->attach($categoryIds);
        });

        // Create specific featured products
        $featuredProducts = [
            [
                'name' => 'سجادة مغربية تقليدية',
                'description' => 'سجادة منسوجة يدوياً من الصوف الطبيعي بتصاميم أمازيغية أصيلة',
                'details' => 'تتميز بألوانها الزاهية ونقوشها الفريدة التي تحكي قصصاً من التراث المغربي العريق. مثالية لإضافة لمسة دافئة وأنيقة إلى أي غرفة.',
                'price' => 1200.00,
                'is_featured' => true,
                'image' => 'products/moroccan-carpet.jpg',
                'categories' => ['Home Decor', 'Traditional Clothing'],
            ],
            [
                'name' => 'قفطان مغربي فاخر',
                'description' => 'قفطان نسائي مطرز بخيوط ذهبية، تصميم عصري بلمسة تراثية',
                'details' => 'قفطان مصمم بعناية فائقة مع تطريز يدوي دقيق. مناسب للمناسبات الخاصة والأعراس.',
                'price' => 650.00,
                'is_featured' => true,
                'image' => 'products/moroccan-kaftan.jpg',
                'categories' => ['Traditional Clothing'],
            ],
        ];

        foreach ($featuredProducts as $productData) {
            $categories = $productData['categories'];
            unset($productData['categories']);
            
            // Create the featured product using factory
            $product = Product::factory()->create(array_merge($productData, [
                'status' => 'published',
                'stock_quantity' => rand(20, 50),
            ]));

            // Attach categories
            $categoryIds = Category::whereIn('en_name', $categories)->pluck('id');
            $product->categories()->attach($categoryIds);
        }
    }
}
