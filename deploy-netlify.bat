@echo off
echo ========================================
echo   PayLockr - Netlify Deployment
echo ========================================
echo.

echo [1/4] Installing Netlify CLI...
call npm install -g netlify-cli

echo.
echo [2/4] Building project...
call npm run build

echo.
echo [3/4] Deploying to Netlify...
echo.
echo IMPORTANT: Set these environment variables in Netlify dashboard:
echo   - VITE_GEMINI_API_KEY
echo   - VITE_GROQ_API_KEY
echo   - VITE_DOCUMENT_SERVICE_URL
echo.
pause

call netlify deploy --prod --dir=dist

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://app.netlify.com
echo 2. Click on your site
echo 3. Go to Site settings ^> Environment variables
echo 4. Add your API keys
echo 5. Trigger redeploy if needed
echo.
pause
