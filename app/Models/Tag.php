<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'name',
        'slug'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the products that belong to the tag.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_tags');
    }

    /**
     * Scope to get active tags (if needed in the future)
     */
    public function scopeActive($query)
    {
        return $query; // For now, all tags are considered active
    }

    /**
     * Scope to order tags by name
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('name');
    }
}
