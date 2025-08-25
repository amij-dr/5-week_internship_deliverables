@echo off
echo Starting Smart Warehouse Backend Services...
echo.

REM Start Flask API in a new command window
echo Starting Flask API (Port 5001)...
start "Flask API" cmd /k "cd /d d:\Programs\xampp\htdocs\smart-warehouse-team\backend\flask-api && start-flask.bat"

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start Laravel API in a new command window
echo Starting Laravel API (Port 8000)...
start "Laravel API" cmd /k "cd /d d:\Programs\xampp\htdocs\smart-warehouse-team\backend\laravel && start-laravel.bat"

echo.
echo Both services are starting in separate windows...
echo.
echo Flask API: http://localhost:5001
echo Laravel API: http://localhost:8000
echo.
echo Check the opened command windows for status updates.
echo Press any key to exit this window...
pause >nul
