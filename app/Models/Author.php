<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    /** @use HasFactory<\Database\Factories\AuthorFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function books()
    {
        return $this->hasMany(Book::class);
    }

    public function ratings()
    {
        return $this->hasManyThrough(Rating::class, Book::class);
    }

    public function bestRatedBook()
    {
        return $this->hasOne(Book::class)
            ->orderBy(
                Rating::selectRaw('avg(rating)')
                    ->whereColumn('book_id', 'books.id'),
                'desc'
            );
    }

    public function worstRatedBook()
    {
        return $this->hasOne(Book::class)
            ->orderBy(
                Rating::selectRaw('avg(rating)')
                    ->whereColumn('book_id', 'books.id'),
                direction: 'asc'
            );
    }

    public function ratingsCount()
    {
        return $this->ratings();
    }
}
