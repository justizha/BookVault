<?php
// app/Models/Book.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $table = 'books_master';
    protected $primaryKey = 'book_code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'book_code', 'title', 'author', 'publisher',
        'publication_year', 'isbn', 'category',
        'page_count', 'language', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'publication_year' => 'integer',
        'page_count' => 'integer',
    ];

    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class, 'book_code', 'book_code');
    }

    public function prices(): HasMany
    {
        return $this->hasMany(Price::class, 'book_code', 'book_code');
    }

    // convenience: current effective price only
    public function currentPrice(): HasOne
    {
        return $this->hasOne(Price::class, 'book_code', 'book_code')
            ->where('effective_date', '<=', now())
            ->latest('effective_date');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}