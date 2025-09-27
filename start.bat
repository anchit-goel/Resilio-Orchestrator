@echo off
echo Starting Honeywell Terminal Manager...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo Installing Python dependencies...
pip install -r requirements.txt

REM Check if npm packages are installed
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install
)

echo.
echo Starting backend server...
start /b python main.py

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend development server...
npm run dev

pause