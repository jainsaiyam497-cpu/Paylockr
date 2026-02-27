@echo off
title PayLockr - Frontend Service
color 0B

echo ========================================
echo    PAYLOCKR - STARTING FRONTEND ONLY
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)

echo [2/3] Starting development server...
echo.
echo ==========================================
echo   FRONTEND RUNNING ON PORT 5173
echo ==========================================
echo.
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop the service
echo.

echo [3/3] Launching React app...
npm run dev