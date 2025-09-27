@echo off
echo Testing Honeywell Terminal Manager
echo =====================================
echo.

echo 1. Testing Backend Health...
curl -s http://localhost:8001/ 
echo.

echo 2. Testing Chat API...
curl -s -X POST http://localhost:8001/api/chat -H "Content-Type: application/json" -d "{\"message\": \"Hello\", \"operation_type\": \"terminal\"}"
echo.

echo 3. Testing Operation Data API...
curl -s http://localhost:8001/api/operation-data/terminal
echo.

echo 4. Frontend Status...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Frontend is running on http://localhost:3000
) else (
    echo ❌ Frontend not accessible
)

echo.
echo 🎉 Test completed!
echo Access your application at: http://localhost:3000