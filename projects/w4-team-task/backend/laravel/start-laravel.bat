@echo off
echo Starting Laravel API...
cd /d "d:\Programs\xampp\htdocs\smart-warehouse-team\backend\laravel"

REM Check if PHP is installed
php --version >nul 2>&1
if errorlevel 1 (
    echo PHP is not installed or not in PATH
    echo Please install PHP or start XAMPP and try again
    pause
    exit /b 1
)

REM Check if Composer is installed
composer --version >nul 2>&1
if errorlevel 1 (
    echo Composer is not installed or not in PATH
    echo Please install Composer and try again
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "vendor" (
    echo Installing Composer dependencies...
    composer install
)

echo Starting Laravel development server on http://localhost:8000
php artisan serve --host=0.0.0.0 --port=8000
