<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['ar_name' => 'إلكترونيات', 'en_name' => 'Electronics', 'fr_name' => 'Électronique'],
            ['ar_name' => 'ملابس', 'en_name' => 'Clothing', 'fr_name' => 'Vêtements'],
            ['ar_name' => 'أدوات منزلية', 'en_name' => 'Home Goods', 'fr_name' => 'Articles Ménagers'],
            ['ar_name' => 'جمال وعناية', 'en_name' => 'Beauty & Care', 'fr_name' => 'Beauté et Soins'],
            ['ar_name' => 'ديكور منزلي', 'en_name' => 'Home Decor', 'fr_name' => 'Décoration'],
            ['ar_name' => 'منتجات تجميل', 'en_name' => 'Cosmetics', 'fr_name' => 'Cosmétiques'],
            ['ar_name' => 'ملابس تقليدية', 'en_name' => 'Traditional Clothing', 'fr_name' => 'Vêtements Traditionnels'],
            ['ar_name' => 'أدوات مطبخ', 'en_name' => 'Kitchen Tools', 'fr_name' => 'Ustensiles de Cuisine'],
            ['ar_name' => 'اكسسوارات', 'en_name' => 'Accessories', 'fr_name' => 'Accessoires'],
            ['ar_name' => 'عطور', 'en_name' => 'Perfumes', 'fr_name' => 'Parfums'],
            ['ar_name' => 'مشروبات', 'en_name' => 'Beverages', 'fr_name' => 'Boissons'],
            ['ar_name' => 'أحذية', 'en_name' => 'Shoes', 'fr_name' => 'Chaussures'],
            ['ar_name' => 'حقائب', 'en_name' => 'Bags', 'fr_name' => 'Sacs'],
            ['ar_name' => 'مجوهرات', 'en_name' => 'Jewelry', 'fr_name' => 'Bijoux'],
            ['ar_name' => 'رياضة', 'en_name' => 'Sports', 'fr_name' => 'Sports'],
            ['ar_name' => 'ألعاب', 'en_name' => 'Toys', 'fr_name' => 'Jouets'],
            ['ar_name' => 'كتب', 'en_name' => 'Books', 'fr_name' => 'Livres'],
            ['ar_name' => 'أدوات مكتبية', 'en_name' => 'Stationery', 'fr_name' => 'Papeterie'],
            ['ar_name' => 'هدايا', 'en_name' => 'Gifts', 'fr_name' => 'Cadeaux'],
            ['ar_name' => 'منتجات صحية', 'en_name' => 'Health Products', 'fr_name' => 'Produits de Santé']
        ];

        foreach ($categories as $index => $category) {
            Category::create([
                'ar_name' => $category['ar_name'],
                'en_name' => $category['en_name'],
                'fr_name' => $category['fr_name'],
                'ar_description' => 'وصف تجريبي بالعربية ل' . $category['ar_name'],
                'en_description' => 'Sample description in English for ' . $category['en_name'],
                'fr_description' => 'Description exemple en français pour ' . $category['fr_name'],
                'is_active' => true,
                'sort_order' => $index + 1,
                'slug' => Str::slug($category['en_name'])
            ]);
        }
    }
}
