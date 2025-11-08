<?php

use App\Http\Controllers\AuthorController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RatingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [BookController::class, 'index'])->name('index');

Route::get('/top-authors', [AuthorController::class, 'index'])->name('authors.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rate book route
    Route::get('/rate-book', [RatingController::class, 'create'])->name('ratings.create');
    Route::post('/rate-book', [RatingController::class, 'store'])->name('ratings.store');
});

require __DIR__.'/auth.php';
