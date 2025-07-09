<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'product_id',
        'client_name',
        'city',
        'address',
        'client_phone',
        'shipping_cost',
        'sale_price',
        'user_profit',
        'status',
        'notes',
        'tracking_number',
        'estimated_delivery'
    ];

    protected $casts = [
        'shipping_cost' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'user_profit' => 'decimal:2',
        'estimated_delivery' => 'datetime'
    ];

    protected $attributes = [
        'status' => 'pending'
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeShipped($query)
    {
        return $query->where('status', 'shipped');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    // Accessors
    public function getFormattedSalePriceAttribute()
    {
        return number_format($this->sale_price, 2) . ' MAD';
    }

    public function getFormattedShippingCostAttribute()
    {
        return number_format($this->shipping_cost, 2) . ' MAD';
    }

    public function getFormattedUserProfitAttribute()
    {
        return number_format($this->user_profit, 2) . ' MAD';
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'pending' => ['label' => 'Pending', 'variant' => 'secondary'],
            'confirmed' => ['label' => 'Confirmed', 'variant' => 'default'],
            'shipped' => ['label' => 'Shipped', 'variant' => 'default'],
            'delivered' => ['label' => 'Delivered', 'variant' => 'success'],
            'cancelled' => ['label' => 'Cancelled', 'variant' => 'destructive'],
            default => ['label' => 'Unknown', 'variant' => 'secondary']
        };
    }

    // Helper Methods
    public function canBeUpdated(): bool
    {
        return !in_array($this->status, ['delivered', 'cancelled']);
    }

    public function canBeCancelled(): bool
    {
        return !in_array($this->status, ['delivered', 'cancelled']);
    }

    public function markAsConfirmed(): bool
    {
        if ($this->status === 'pending') {
            return $this->update(['status' => 'confirmed']);
        }
        return false;
    }

    public function markAsShipped(?string $trackingNumber = null): bool
    {
        if (in_array($this->status, ['pending', 'confirmed'])) {
            $data = ['status' => 'shipped'];
            if ($trackingNumber) {
                $data['tracking_number'] = $trackingNumber;
            }
            return $this->update($data);
        }
        return false;
    }

    public function markAsDelivered(): bool
    {
        if ($this->status === 'shipped') {
            return $this->update(['status' => 'delivered']);
        }
        return false;
    }

    public function markAsCancelled(): bool
    {
        if ($this->canBeCancelled()) {
            return $this->update(['status' => 'cancelled']);
        }
        return false;
    }
}
