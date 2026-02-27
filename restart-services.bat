@echo off
echo ========================================
echo   Restarting PayLockr Services
echo ========================================
echo.

echo Stopping any running services...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Document Service (Backend)...
cd document-service
start "PayLockr Backend" cmd /k "python -m uvicorn app.main:app --reload --port 8000"
cd ..

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend...
start "PayLockr Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
