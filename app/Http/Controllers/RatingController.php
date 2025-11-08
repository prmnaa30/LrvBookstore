<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRatingRequest;
use App\Models\Author;
use App\Models\Book;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RatingController extends Controller
{
    public function create(Request $request)
    {
        $authors = Author::select('id', 'name')->get();
        $books = collect();

        $selectedAuthorId = $request->author_id;

        if ($selectedAuthorId) {
            $books = Book::where('author_id', $selectedAuthorId)->select('id', 'title as name')->get();
        }

        return Inertia::render('Ratings/Create', [
            'authors' => $authors,
            'books' => $books,
            'selectedAuthorId' => $selectedAuthorId,
        ]);
    }

    public function store(StoreRatingRequest $request)
    {
        $request->validate([
            'author_id' => 'required|integer|exists:authors,id',
            'book_id' => 'required|integer|exists:books,id',
            'rating' => 'required|integer|min:1|max:10'
        ]);

        $rating = Rating::create([
            'user_id' => $request->user()->id,
            'book_id' => $request->input('book_id'),
            'rating' => $request->input('rating'),
        ]);

        $rating->save();

        return redirect()->route('index')->with('success', 'Rating berhasil diberikan!');
    }
}
