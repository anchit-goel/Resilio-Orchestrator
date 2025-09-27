@echo off
title Honeywell Terminal Manager Startup
echo.
echo ================================================================
echo           🚀 Honeywell Terminal Manager Startup
echo ================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo ✅ Python and Node.js detected
echo.

REM Install Python dependencies if needed
echo 📦 Installing Python dependencies...
python -m pip install fastapi uvicorn python-multipart requests pydantic >nul 2>&1

REM Install Node dependencies if needed
if not exist "node_modules\" (
    echo 📦 Installing Node.js dependencies...
    npm install >nul 2>&1
)

echo ✅ Dependencies installed
echo.

REM Create data directory
if not exist "data\" mkdir data

echo 🔧 Starting Backend Server (Port 8002)...
start /min cmd /k "title Backend Server & python simple_server.py"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

REM Test backend
python -c "import requests; requests.get('http://localhost:8002')" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend server started successfully
) else (
    echo ⚠️  Backend may still be starting up...
)

echo.
echo 🌐 Starting Frontend Server (Port 3000)...
start /min cmd /k "title Frontend Server & npm run dev"

echo ⏳ Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo ================================================================
echo                    🎉 STARTUP COMPLETE!
echo ================================================================
echo.
echo 📱 Access your application:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8002
echo    API Docs:  http://localhost:8002/docs
echo.
echo 🎯 Quick Actions:
echo    1. Open http://localhost:3000 in your browser
echo    2. Navigate to Settings to upload datasets
echo    3. Use the AI chatbot for intelligent insights
echo    4. Switch between operation workflows
echo.
echo 🔧 Servers are running in separate windows.
echo    Close those windows to stop the servers.
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000

echo.
echo Happy coding! 🚀