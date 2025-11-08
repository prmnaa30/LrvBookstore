<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    protected $fillable = [
        'author_id',
        'store_id',
        'title',
        'isbn',
        'publisher',
        'publish_year',
        'availibility',
        'description',
    ];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'book_category');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
