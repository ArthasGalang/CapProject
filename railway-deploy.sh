#!/bin/bash

echo "🚂 Railway Deployment Script"
echo "=============================="

# Install Composer dependencies
echo "📦 Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

# Install NPM dependencies
echo "📦 Installing NPM dependencies..."
npm ci --include=dev

# Build assets
echo "🔨 Building production assets..."
npm run build

# Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force --no-interaction

# Create storage link
echo "🔗 Creating storage link..."
php artisan storage:link

# Cache configuration
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Deployment complete!"
