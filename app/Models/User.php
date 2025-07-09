<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'photo',
        'bio',
        'national_id',
        'phone',
        'gender',
        'country',
        'city',
        'payment_method',
        'bank_name',
        'rib_number',
        'active',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's full name.
     */
    public function getNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->photo) {
            return str_starts_with($this->photo, 'http')
                ? $this->photo
                : asset('storage/' . $this->photo);
        }
        return null;
    }

    /**
     * Get the user's photo URL for display.
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->getAvatarUrlAttribute();
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function productList()
    {
        return $this->belongsToMany(Product::class, 'user_product_list');
    }
}
