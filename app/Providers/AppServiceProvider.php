<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);

        // Auto-seed categories if missing
        try {
            if (\Schema::hasTable('categories') && \DB::table('categories')->count() === 0) {
                $categoryNames = [
                    'Electronics', 'Books', 'Clothing', 'Home', 'Toys', 'Groceries', 'Beauty', 'Sports', 'Automotive', 'Pets', 'Others'
                ];
                foreach ($categoryNames as $catName) {
                    \DB::table('categories')->insert([
                        'CategoryName' => $catName,
                        'Description' => $catName . ' category',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        } catch (\Throwable $e) {
            // Ignore errors (e.g., during migrations)
        }
    }
}
