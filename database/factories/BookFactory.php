<?php

namespace Database\Factories;

use App\Models\Author;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_id' => Author::factory(),
            'store_id' => Store::factory(),
            'title' => $this->faker->sentence(rand(3, 7)),
            'isbn' => $this->faker->unique()->isbn13(),
            'publisher' => $this->faker->company(),
            'publish_year' => $this->faker->year(),
            'availability_status' => $this->faker->randomElement(['available', 'rented', 'reserved']),
            'description' => $this->faker->paragraph(),
        ];
    }
}
