<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\App;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'ar_name',
        'en_name',
        'fr_name',
        'ar_description',
        'en_description',
        'fr_description',
        'image',
        'is_active',
        'sort_order',
        'slug'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    protected $appends = ['name', 'description'];

    // Get localized name based on current app locale
    public function getNameAttribute()
    {
        // Get current locale, default to 'en' if not set
        $locale = App::getLocale() ?? 'en';

        // Map of supported locales
        $supportedLocales = ['en', 'ar', 'fr'];

        // If current locale is supported, try to get that name
        if (in_array($locale, $supportedLocales)) {
            $localizedName = $this->attributes[$locale . '_name'] ?? null;
            if (!empty($localizedName)) {
                return $localizedName;
            }
        }

        // Fallback hierarchy: en -> ar -> fr
        foreach (['en', 'ar', 'fr'] as $fallbackLocale) {
            $fallbackName = $this->attributes[$fallbackLocale . '_name'] ?? null;
            if (!empty($fallbackName)) {
                return $fallbackName;
            }
        }

        return 'Unnamed Category';
    }

    // Get localized description based on current app locale
    public function getDescriptionAttribute()
    {
        $locale = App::getLocale();
        return $this->{$locale.'_description'} ?? $this->en_description;
    }

    // Scope for active categories
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope for ordered categories
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }

     public function products ()
     {
        return $this->belongsToMany(Product::class,'product_categories');
     }
}
