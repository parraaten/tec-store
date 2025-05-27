# Usa una imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instala extensiones necesarias para Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_mysql zip mbstring exif pcntl

# Copia archivos al contenedor
COPY . /var/www/html

# Establece permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Habilita Apache mod_rewrite
RUN a2enmod rewrite

# Establece el directorio de trabajo
WORKDIR /var/www/html

# Copia archivo de configuración de Apache si lo tienes (opcional)
# COPY ./docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf
