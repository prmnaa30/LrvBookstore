<?php

namespace App\Http\Controllers;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\Rating;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        // dd($request);
        $filters = $request->validate([
            'search' => 'nullable|string|max:100',
            'sort' => 'nullable|string|in:rating_desc,votes_desc,recent_popularity,alphabetical_asc',
            'categories' => 'nullable|array',
            'categories.*' => 'integer|exists:categories,id',
            'category_logic' => 'nullable|string|in:AND,OR',
            'authors' => 'nullable|array',
            'authors.*' => 'integer|exists:authors,id',
            'stores' => 'nullable|array',
            'stores.*' => 'integer|exists:stores,id',
            'status' => 'nullable|array',
            'status.*' => 'string|in:available,rented,reserved',
            'year_min' => 'nullable|integer|min:1900',
            'year_max' => 'nullable|integer|max:' . date('Y'),
            'rating_min' => 'nullable|integer|min:1',
            'rating_max' => 'nullable|integer|max:10',
        ]);

        // Main query
        $query = Book::query()
            ->select('books.*')
            ->with(['author', 'categories'])
            ->withAvg('ratings', 'rating')
            ->withCount('ratings');

        // Weighted avg rating
        // WR = (v / (v + m)) * R + (m / (v + m)) * C
        // m = minimum vote yang diperlukan ($minRate)
        // v = ratings_count (dari withCount ratings)
        // R = ratings_average_rating (dari withAvg ratings)
        // C = pembulatan dari globalAvgRating.
        $minRate = 10;
        $globalAvgRating = Rating::avg('rating');
        $C = round($globalAvgRating, 2);

        // Filter by popularity
        $sevenDaysAgo = now()->subDays(7);
        $fourteenDaysAgo = now()->subDays(14);

        $query->selectSub(function ($sub) use ($sevenDaysAgo) {
            $sub->from('ratings')
                ->whereColumn('book_id', 'books.id')
                ->where('created_at', '>=', $sevenDaysAgo)
                ->selectRaw('AVG(rating)');
        }, 'avg_rating_last_7_days');

        $query->selectSub(function ($sub) use ($fourteenDaysAgo) {
            $sub->from('ratings')
                ->whereColumn('book_id', 'books.id')
                ->where('created_at', '>=', $fourteenDaysAgo)
                ->selectRaw('AVG(rating)');
        }, 'avg_rating_prev_7_days');

        // Recent popularity (30 days)
        $query->withCount([
            'ratings as recent_ratings_count' => function ($q) {
                $q->where('created_at', '>=', now()->subDays(30));
            }
        ]);

        // Filter by category
        if (!empty($filters['categories'])) {
            $logic = $filters['category_logic'] ?? 'OR';
            $categoryIds = $filters['categories'];

            if ($logic === 'OR') {
                $query->whereHas('categories', fn($q) => $q->whereIn('categories.id', $categoryIds));
            } else {
                $query->whereHas('categories', fn($q) => $q->whereIn('categories.id', $categoryIds), '=', count($categoryIds));
            }
        }

        // Filter by author, store, and status
        $query->when($filters['authors'] ?? null, function ($q, $authorIds) {
            $q->whereIn('id', $authorIds);
        });

        $query->when($filters['stores'] ?? null, function ($q, $storeIds) {
            $q->whereIn('id', $storeIds);
        });

        $query->when($filters['status'] ?? null, function ($q, $statuses) {
            $q->whereIn('availability', $statuses);
        });

        // Filter by date range
        $query->when($filters['year_min'] ?? null, fn($q, $min) => $q->where('publish_year', '>=', $min));
        $query->when($filters['year_max'] ?? null, fn($q, $max) => $q->where('publish_year', '<=', $max));

        // Filter by rating range
        $query->when($filters['rating_min'] ?? null, fn($q, $min) => $q->having('ratings_avg_rating', '>=', $min));
        $query->when($filters['rating_max'] ?? null, fn($q, $max) => $q->having('ratings_avg_rating', '<=', $max));

        // Searching logic
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($subQuery) use ($search) {
                $subQuery->where('title', 'like', '%' . $search . '%')
                    ->orWhereHas('author', fn($authorQuery) => $authorQuery->where('name', 'like', '%' . $search . '%'))
                    ->orWhere('isbn', 'like', '%' . $search . '%')
                    ->orWhere('publisher', 'like', '%' . $search . '%');
            });
        });

        // Sorting logic
        $sortOrder = $filters['sort'] ?? 'rating_desc';

        match ($sortOrder) {
            'rating_desc' => $query->orderByRaw('
                ( (COALESCE(ratings_count, 0) / (COALESCE(ratings_count, 0) + ?)) * COALESCE(ratings_avg_rating, 0) + ( ? / (COALESCE(ratings_count, 0) + ?)) * ? ) DESC',
                [$minRate, $minRate, $minRate, $C]
            ),
            'votes_desc' => $query->orderBy('ratings_count', 'DESC'),
            'recent_popularity' => $query->orderBy('recent_ratings_count', 'DESC'),
            'alphabetical_asc' => $query->orderBy('title', 'ASC'),
        };

        // Paginate
        $books = $query->paginate(18)->withQueryString();

        $filterData = [
            'categories' => Category::whereHas('books')->select('id', 'name')->get(),
            'authors' => Author::whereHas('books')->select('id', 'name')->get(),
            'stores' => Store::select('id', 'name')->get(),
            'year_range' => [
                'min' => (int) Book::min('publish_year'),
                'max' => (int) Book::max('publish_year'),
            ],
            'rating_range' => [
                'min' => 1,
                'max' => 10,
            ],
        ];

        return Inertia::render('Books/Index', [
            'books' => $books,
            'filters' => $filters,
            'filterData' => $filterData,
        ]);
    }
}
