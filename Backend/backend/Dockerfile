FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git \
    nginx \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel source
COPY . .

# Install PHP dependencies
RUN composer install

# Permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

CMD php artisan serve --host=0.0.0.0 --port=8000
