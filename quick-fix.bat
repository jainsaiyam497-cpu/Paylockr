@echo off
echo Starting PayLockr Quick Fix...

echo.
echo 1. Starting Document Service...
cd "document-service"
start "Document Service" cmd /k "python -m uvicorn app.main:app --reload --port 8000"

echo.
echo 2. Waiting 5 seconds for service to start...
timeout /t 5 /nobreak >nul

echo.
echo 3. Starting Frontend...
cd ..
start "PayLockr Frontend" cmd /k "npm run dev"

echo.
echo ✅ PayLockr is starting!
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo.
echo Press any key to close this window...
pause >nul