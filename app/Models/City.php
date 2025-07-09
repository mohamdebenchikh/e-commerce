<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class City extends Model
{
    protected $table = 'cities';
    protected $fillable = [
        'ar_name','en_name','fr_name','shipping_cost'
    ];

    public function getNameAttribute()
    {
        $locale = App::getLocale();
        return $this->{$locale.'_name'} ?? $this->en_name;
    }
}
