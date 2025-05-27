FROM php:8.2-apache

WORKDIR /var/www/html

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl libpng-dev sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar el código
COPY . .

# Instalar dependencias y preparar Laravel
RUN cp .env.example .env && \
    composer install && \
    php artisan key:generate && \
    php artisan migrate --seed && \
    php artisan storage:link

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=8080
