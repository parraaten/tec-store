# Tec Store

Proyecto de e-commerce con Laravel (API) + Vue 3 (Frontend).

## Requisitos
- PHP 8.2
- Node.js 22.15.0
- XAMPP (MySQL)
- Composer

---

## Configuración Inicial

### 1. Base de Datos (MySQL con XAMPP)
1. Abre **XAMPP Control Panel**.
2. Inicia `Apache` y `MySQL`.
3. Haz clic en `Admin` de MySQL (abrirá phpMyAdmin).
4. Crea una nueva base de datos llamada **`tec_store`**.

### 2. Backend (Laravel API)
```bash
cd api
cp .env.example .env  # Configura tus variables de DB en .env (DB_DATABASE=tec_store)
composer install
php artisan key:generate
php artisan migrate --seed  # Ejecuta migraciones con datos de prueba
php artisan storage:link   # Para manejar archivos
php artisan serve          # Inicia servidor en http://localhost:8000
```

### 3. Frontend (Vue 3)
```bash
cd ui
npm install
npm run dev  # Inicia servidor en http://localhost:5173
```

## 📌 Notas adicionales:
1. **Para XAMPP**: Asegúrate de que en `.env` de Laravel tengas:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=tec_store
   DB_USERNAME=root
   DB_PASSWORD=
   ```