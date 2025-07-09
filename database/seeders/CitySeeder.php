<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            ['ar_name' => 'الرباط', 'fr_name' => 'Rabat', 'en_name' => 'Rabat', 'shipping_cost' => '30'],
            ['ar_name' => 'الدار البيضاء', 'fr_name' => 'Casablanca', 'en_name' => 'Casablanca', 'shipping_cost' => '30'],
            ['ar_name' => 'فاس', 'fr_name' => 'Fès', 'en_name' => 'Fes', 'shipping_cost' => '35'],
            ['ar_name' => 'مراكش', 'fr_name' => 'Marrakech', 'en_name' => 'Marrakesh', 'shipping_cost' => '35'],
            ['ar_name' => 'طنجة', 'fr_name' => 'Tanger', 'en_name' => 'Tangier', 'shipping_cost' => '35'],
            ['ar_name' => 'أكادير', 'fr_name' => 'Agadir', 'en_name' => 'Agadir', 'shipping_cost' => '40'],
            ['ar_name' => 'مكناس', 'fr_name' => 'Meknès', 'en_name' => 'Meknes', 'shipping_cost' => '35'],
            ['ar_name' => 'وجدة', 'fr_name' => 'Oujda', 'en_name' => 'Oujda', 'shipping_cost' => '40'],
            ['ar_name' => 'الجديدة', 'fr_name' => 'El Jadida', 'en_name' => 'El Jadida', 'shipping_cost' => '35'],
            ['ar_name' => 'القنيطرة', 'fr_name' => 'Kénitra', 'en_name' => 'Kenitra', 'shipping_cost' => '35'],
            ['ar_name' => 'تطوان', 'fr_name' => 'Tétouan', 'en_name' => 'Tetouan', 'shipping_cost' => '35'],
            ['ar_name' => 'سلا', 'fr_name' => 'Salé', 'en_name' => 'Sale', 'shipping_cost' => '30'],
            ['ar_name' => 'تمارة', 'fr_name' => 'Témara', 'en_name' => 'Temara', 'shipping_cost' => '30'],
            ['ar_name' => 'المحمدية', 'fr_name' => 'Mohammedia', 'en_name' => 'Mohammedia', 'shipping_cost' => '30'],
            ['ar_name' => 'العرائش', 'fr_name' => 'Larache', 'en_name' => 'Larache', 'shipping_cost' => '35'],
            ['ar_name' => 'خريبكة', 'fr_name' => 'Khouribga', 'en_name' => 'Khouribga', 'shipping_cost' => '35'],
            ['ar_name' => 'برشيد', 'fr_name' => 'Berrechid', 'en_name' => 'Berrechid', 'shipping_cost' => '35'],
            ['ar_name' => 'إنزكان', 'fr_name' => 'Inezgane', 'en_name' => 'Inezgane', 'shipping_cost' => '40'],
            ['ar_name' => 'سطات', 'fr_name' => 'Settat', 'en_name' => 'Settat', 'shipping_cost' => '35'],
            ['ar_name' => 'الناظور', 'fr_name' => 'Nador', 'en_name' => 'Nador', 'shipping_cost' => '40'],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}
