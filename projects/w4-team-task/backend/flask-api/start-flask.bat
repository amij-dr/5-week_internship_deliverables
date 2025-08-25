@echo off
echo Starting Flask API...
cd /d "d:\Programs\xampp\htdocs\smart-warehouse-team\backend\flask-api"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python and try again
    pause
    exit /b 1
)

REM Install requirements if needed
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing requirements...
pip install -r requirements.txt

echo Starting Flask server on http://localhost:5001
python app.py
