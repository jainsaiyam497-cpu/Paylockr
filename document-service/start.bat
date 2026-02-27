@echo off
echo Starting PayLockr Document Service...
echo.

REM Check if virtual environment exists
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
call .venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo Please edit .env file and add your API keys:
    echo - GEMINI_API_KEY
    echo - GROQ_API_KEY
    echo.
    pause
)

REM Start the server
echo Starting server on http://localhost:8000
echo API docs available at http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --port 8000