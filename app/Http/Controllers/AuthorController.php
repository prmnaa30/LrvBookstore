<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $currentTab = $request->input('tab', 'popularity');

        $query = Author::query();

        switch ($currentTab) {
            case 'rating':
                $query->withAvg('ratings', 'rating')
                    ->orderBy('ratings_avg_rating', 'DESC');
                break;
            case 'trending':
                $thirtyDaysAgo = now()->subDays(30);
                $sixtyDaysAgo = now()->subDays(60);

                $query->join('books', 'books.author_id', '=', 'authors.id')
                    ->join('ratings', 'books.id', '=', 'ratings.book_id');
                $query->selectRaw('authors.*')
                    ->selectRaw('AVG(CASE WHEN ratings.created_at >= ? THEN ratings.rating ELSE NULL END) AS avg_recent', [$thirtyDaysAgo])
                    ->selectRaw('AVG(CASE WHEN ratings.created_at >= ? AND ratings.created_at < ? THEN ratings.rating ELSE NULL END) AS avg_prev', [$sixtyDaysAgo, $thirtyDaysAgo])
                    ->selectRaw('COUNT(CASE WHEN ratings.created_at >= ? THEN 1 ELSE NULL END) AS recent_voters', [$thirtyDaysAgo])
                    ->selectRaw('
                        (COALESCE(
                            AVG(CASE WHEN ratings.created_at >= ? THEN ratings.rating ELSE NULL END), 0
                        ) - COALESCE(
                            AVG(CASE WHEN ratings.created_at >= ? AND ratings.created_at < ? THEN ratings.rating ELSE NULL END), 0
                        ) * COALESCE(
                            COUNT(CASE WHEN ratings.created_at >= ? THEN 1 ELSE NULL END), 0
                        )) AS trending_score
                        ', [$thirtyDaysAgo, $sixtyDaysAgo, $thirtyDaysAgo, $thirtyDaysAgo])
                    ->groupBy('authors.id')
                    ->orderBy('trending_score', 'DESC');
                break;
            case 'popularity':
            default:
                $query->withCount([
                    'ratings as popularity_count' => function ($query) {
                        $query->where('rating', '>', 5);
                    }
                ])
                    ->orderBy('popularity_count', 'DESC');
                break;
        }

        $topAuthors = $query
            ->with(['bestRatedBook', 'worstRatedBook'])
            ->withCount('ratings')
            ->take(20)
            ->get();

        // dd($topAuthors);

        return Inertia::render('Authors/Index', [
            'authors' => $topAuthors,
            'currentTab' => $currentTab,
        ]);
    }
}
