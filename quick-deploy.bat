@echo off
echo ========================================
echo   PayLockr - Quick Deploy
echo ========================================
echo.
echo Choose deployment platform:
echo   1. Vercel (Recommended)
echo   2. Netlify
echo   3. Both
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto both
goto end

:vercel
echo.
echo Deploying to Vercel...
call deploy-vercel.bat
goto end

:netlify
echo.
echo Deploying to Netlify...
call deploy-netlify.bat
goto end

:both
echo.
echo Deploying to both platforms...
call deploy-vercel.bat
echo.
echo ----------------------------------------
echo.
call deploy-netlify.bat
goto end

:end
echo.
echo Done!
pause
