<?php
// app/Models/Price.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Price extends Model
{
    protected $table = 'price_master';
    protected $primaryKey = 'price_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'price_id', 'book_code', 'price',
        'currency', 'discount_percent', 'effective_date',
    ];

    protected $casts = [
        'price' => 'integer',
        'discount_percent' => 'integer',
        'effective_date' => 'date',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'book_code', 'book_code');
    }

    public function getFinalPriceAttribute(): float
    {
        return round($this->price - ($this->price * $this->discount_percent / 100), 2);
    }

    public function scopeEffective($query)
    {
        return $query->where('effective_date', '<=', now());
    }
}
