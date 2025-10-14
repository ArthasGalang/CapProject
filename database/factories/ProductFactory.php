<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'UserID' => $this->faker->numberBetween(1, 10),
            'CategoryID' => 1, // You may want to seed categories first and use their IDs
            'SKU' => $this->faker->unique()->ean8(),
            'ProductName' => $this->faker->word(),
            'Description' => $this->faker->sentence(),
            'Price' => $this->faker->randomFloat(2, 10, 1000),
            'Stock' => $this->faker->numberBetween(1, 100),
            'Image' => $this->faker->imageUrl(),
            'isActive' => true,
        ];
    }
}
