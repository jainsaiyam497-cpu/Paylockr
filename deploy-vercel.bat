@echo off
echo ========================================
echo   PayLockr - Vercel Deployment
echo ========================================
echo.

echo [1/4] Installing Vercel CLI...
call npm install -g vercel

echo.
echo [2/4] Building project...
call npm run build

echo.
echo [3/4] Deploying to Vercel...
echo.
echo IMPORTANT: Set these environment variables in Vercel dashboard:
echo   - VITE_GEMINI_API_KEY
echo   - VITE_GROQ_API_KEY
echo   - VITE_DOCUMENT_SERVICE_URL
echo.
pause

call vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com/dashboard
echo 2. Click on your project
echo 3. Go to Settings ^> Environment Variables
echo 4. Add your API keys
echo 5. Redeploy if needed
echo.
pause
