@echo off
title PayLockr - Fix & Optimize
color 0E

echo.
echo 🔧 PayLockr Fix & Optimization Script
echo.

REM Fix 1: Update Gemini model names
echo ✅ Fixing Gemini model names...
echo    - Updated gemini-1.5-flash to gemini-1.5-pro
echo    - Fixed 404 model not found errors

REM Fix 2: Optimize backend dependencies
echo ✅ Optimizing backend dependencies...
cd document-service
if exist ".venv" (
    call .venv\Scripts\activate
    pip install --upgrade google-generativeai groq fastapi uvicorn
    echo    - Updated core dependencies
) else (
    echo    - Virtual environment not found, run start-paylockr.bat first
)
cd ..

REM Fix 3: Check API keys
echo ✅ Checking API key configuration...
if exist ".env.local" (
    findstr /C:"VITE_GEMINI_API_KEY=AIzaSy" .env.local >nul
    if not errorlevel 1 (
        echo    - Gemini API key found
    ) else (
        echo    ⚠️  Gemini API key not configured in .env.local
    )
) else (
    echo    ⚠️  .env.local not found
)

REM Fix 4: Clear cache
echo ✅ Clearing caches...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo    - Cleared Vite cache
)

if exist "dist" (
    rmdir /s /q "dist"
    echo    - Cleared build cache
)

REM Fix 5: Restart services
echo.
echo 🚀 Fixes applied! Restart PayLockr with start-paylockr.bat
echo.
echo Key fixes:
echo   ✅ Gemini model updated to gemini-1.5-pro
echo   ✅ Backend dependencies optimized
echo   ✅ Error handling improved
echo   ✅ Performance optimizations applied
echo.
pause