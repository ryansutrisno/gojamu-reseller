# Stage 1: Build frontend assets
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Install Composer dependencies
FROM composer:2.8 AS php-builder
WORKDIR /app
COPY composer*.json ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

# Stage 3: Production environment
FROM php:8.4-fpm-alpine
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    bash \
    mysql-client

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql bcmath zip opcache gd

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy application files
COPY --chown=www-data:www-data . .

# Copy built assets and composer vendor files from previous stages
COPY --from=node-builder --chown=www-data:www-data /app/public/build ./public/build
COPY --from=php-builder --chown=www-data:www-data /app/vendor ./vendor

# Optimize Composer autoload
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
RUN composer dump-autoload --no-dev --classmap-authoritative

# Ensure storage and bootstrap/cache directories are writable
RUN mkdir -p storage/framework/{sessions,views,caches} \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80 for Nginx
EXPOSE 80

# Run entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start Supervisor to run both PHP-FPM and Nginx
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
