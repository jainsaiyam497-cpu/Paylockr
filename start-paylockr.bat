@echo off
title PayLockr - Starting Services
color 0A

echo.
echo  $$$$$$\  $$$$$$\  $$\     $$\ $$\       $$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$\  
echo $$  __$$\ $$  __$$\ \$$\   $$  |$$ |     $$  __$$\ $$  __$$\ $$ | $$  |$$  __$$\ 
echo $$ /  $$ |$$ /  $$ | \$$\ $$  / $$ |     $$ /  $$ |$$ /  \__|$$ |$$  / $$ |  $$ |
echo $$$$$$$$ |$$$$$$$$ |  \$$$$  /  $$ |     $$ |  $$ |$$ |      $$$$$  /  $$$$$$$  |
echo $$  __$$ |$$  __$$ |   \$$  /   $$ |     $$ |  $$ |$$ |      $$  $$<   $$  __$$< 
echo $$ |  $$ |$$ |  $$ |    $$ |    $$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\  $$ |  $$ |
echo $$ |  $$ |$$ |  $$ |    $$ |    $$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\ $$ |  $$ |
echo \__|  \__|\__|  \__|    \__|    \________|\______/  \______/ \__|  \__|\__|  \__|
echo.
echo                    AI-Powered Tax Management for Indian Freelancers
echo                                    Starting Services...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Node.js and Python found
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
if not exist "node_modules" (
    npm install
) else (
    echo Frontend dependencies already installed
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating .env.local from template...
    copy .env.example .env.local
    echo.
    echo ⚠️  Please edit .env.local and add your API keys:
    echo    - VITE_GEMINI_API_KEY (get from https://makersuite.google.com/app/apikey)
    echo    - VITE_GROQ_API_KEY (get from https://console.groq.com/keys)
    echo.
    echo Press any key after adding your API keys...
    pause >nul
)

REM Setup backend
echo 🐍 Setting up backend service...
cd document-service

REM Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating Python virtual environment...
    python -m venv .venv
)

REM Activate virtual environment and install dependencies
call .venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1

REM Check backend .env
if not exist ".env" (
    copy .env.example .env
    echo ⚠️  Backend .env created. Using Gemini API key from frontend.
)

cd ..

echo.
echo 🚀 Starting PayLockr services...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

REM Start backend in background
start "PayLockr Backend" cmd /c "cd document-service && .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🌐 Starting frontend...
npm run dev