@echo off
echo PayLockr OCR-Only Mode (No API Keys Needed)

cd document-service

echo Switching to OCR-only extraction...
python -c "
import os
with open('.env', 'r') as f: content = f.read()
content = content.replace('LLM_ENABLED=false', 'LLM_ENABLED=false')
content = content.replace('GEMINI_API_KEY=your_new_gemini_key_here', 'GEMINI_API_KEY=disabled')
content = content.replace('GROQ_API_KEY=your_new_groq_key_here', 'GROQ_API_KEY=disabled')
with open('.env', 'w') as f: f.write(content)
print('✅ OCR-only mode enabled')
"

echo Starting document service...
start "Document Service OCR" cmd /k "python -m uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

cd ..
echo Starting frontend...
start "PayLockr Frontend" cmd /k "npm run dev"

echo.
echo ✅ PayLockr running in OCR-only mode!
echo No API keys needed - uses Tesseract OCR
pause