<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes,HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'details',
        'price',
        'stock_quantity',
        'is_featured',
        'status',
        'sku',
        'image',
        'seo_title',
        'seo_description',
        'seo_keywords'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_featured' => 'boolean'
    ];

    protected $attributes = [
        'status' => 'draft',
        'stock_quantity' => 0,
        'is_featured' => false
    ];


    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'product_tags');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    // Accessors & Mutators
    public function getIsInStockAttribute()
    {
        return $this->stock_quantity > 0;
    }

    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 2) . ' MAD';
    }

    // Helper Methods
    public function decrementStock(int $quantity = 1)
    {
        if ($this->stock_quantity >= $quantity) {
            $this->decrement('stock_quantity', $quantity);
            return true;
        }
        return false;
    }

    public function incrementStock(int $quantity = 1)
    {
        $this->increment('stock_quantity', $quantity);
        return true;
    }
}
