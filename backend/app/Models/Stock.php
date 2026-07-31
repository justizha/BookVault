<?php
// app/Models/Stock.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    protected $table = 'stock_master';
    protected $primaryKey = 'stock_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'stock_id', 'book_code', 'quantity',
        'shelf_location', 'warehouse', 'last_restocked',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'last_restocked' => 'date',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'book_code', 'book_code');
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('quantity', 0);
    }

    public function scopeLowStock($query, int $threshold = 10)
    {
        return $query->where('quantity', '>', 0)->where('quantity', '<=', $threshold);
    }
}