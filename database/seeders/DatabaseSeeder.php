<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\Rating;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ? Pembersihan database
        $this->command->info('Mempersiapkan database...');
        Schema::disableForeignKeyConstraints();

        DB::table('ratings')->truncate();
        DB::table('book_category')->truncate();
        DB::table('books')->truncate();
        DB::table('authors')->truncate();
        DB::table('categories')->truncate();
        DB::table('stores')->truncate();
        DB::table('users')->truncate();

        Schema::enableForeignKeyConstraints();
        $this->command->info('Database bersih!');

        // ? Seeding data awal
        $users = User::factory(2000)->create();
        $stores = Store::factory(50)->create();
        $authors = Author::factory(1000)->create();
        $categories = Category::factory(3000)->create();

        // ? Ambil ID untuk relasi
        $authorIds = $authors->pluck('id');
        $storeIds = $stores->pluck('id');
        $categoryIds = $categories->pluck('id');
        $userIds = $users->pluck('id');

        // ? Seeding book
        $this->command->info('Seeding 100,000 buku...');
        $bookChunks = [];
        for ($i = 0; $i < 100000; $i++) {
            $bookChunks[] = [
                'author_id' => $authorIds->random(),
                'store_id' => $storeIds->random(),
                'title' => fake()->sentence(rand(3, 7)),
                'isbn' => fake()->unique()->isbn13(),
                'publisher' => fake()->company(),
                'publish_year' => fake()->year(),
                'availability' => fake()->randomElement(['available', 'rented', 'reserved']),
                'created_at' => fake()->dateTimeBetween('-4 years', 'now'),
                'updated_at' => now(),
                'description' => fake()->paragraph()
            ];
        }

        //! Insert tiap 1000 data
        foreach (array_chunk($bookChunks, 1000) as $chunk) {
            Book::insert($chunk);
        }
        $this->command->info('Berhasil seeding buku!');

        // ? Seeding book category
        $this->command->info('Memasukkan kategori pada buku...');
        $bookIds = Book::pluck('id');

        $pivotData = [];
        $chunkSize = 5000;

        foreach ($bookIds as $bookId) {
            $randomCategoryIds = $categoryIds->random(rand(1, 3));

            foreach ($randomCategoryIds as $categoryId) {
                $pivotData[] = [
                    'book_id' => $bookId,
                    'category_id' => $categoryId,
                ];
            }

            if (count($pivotData) > $chunkSize) {
                DB::table('book_category')->insert($pivotData);
                $pivotData = [];
            }
        }

        if (!empty($pivotData)) {
            DB::table('book_category')->insert($pivotData);
        }
        $this->command->info('Buku berhasil diberi kategori!');

        // ? Seeding ratings
        $this->command->info('Seeding 500,000 ratings. This will take the longest time...');
        $ratingChunkSize = 5000;
        $ratingChunks = [];
        $totalRatings = 500000;

        for ($i = 0; $i <= $totalRatings; $i++) {
            $createdAt = fake()->dateTimeBetween('-4 years', 'now');

            $ratingChunks[] = [
                'book_id' => $bookIds->random(),
                'user_id' => $userIds->random(),
                'rating' => rand(1, 10),
                'created_at' => $createdAt->format('Y-m-d H:i:s'),
                'updated_at' => $createdAt->format('Y-m-d H:i:s'),
            ];

            if (count($ratingChunks) === $ratingChunkSize || $i === $totalRatings) {
                DB::table('ratings')->insert($ratingChunks);
                $ratingChunks = [];
            }
        }

        if (!empty($ratingChunks)) {
            DB::table('ratings')->insert($ratingChunks);
        }
        $this->command->info('Berhasil seeding rating!');


        $this->command->info('Seeding database berhasil!');
    }
}
