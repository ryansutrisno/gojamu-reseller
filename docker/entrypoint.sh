#!/bin/sh
set -e

# Run migrations at startup
echo "Running migrations..."
php artisan migrate --force

# Cache config, routes, and views
echo "Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Execute the container's main command
exec "$@"
