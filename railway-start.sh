#!/bin/bash

echo "🚀 Starting Railway deployment..."

# Run migrations
echo "📊 Running migrations..."
php artisan migrate --force

# Check if we should seed (only if APP_SEED environment variable is true)
if [ "$APP_SEED" = "true" ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force
    echo "✅ Database seeded successfully!"
else
    echo "⏭️  Skipping database seeding (APP_SEED not set to true)"
fi

# Start the application
echo "🚀 Starting application server..."
php artisan serve --host=0.0.0.0 --port=$PORT
