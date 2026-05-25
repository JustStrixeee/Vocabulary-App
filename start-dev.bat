@echo off
title Vocabulary App Launcher

echo Starting Vocabulary App...
echo.

echo Starting backend...
start "Vocabulary Backend" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 >nul

echo Starting frontend...
start "Vocabulary Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo Wait a few seconds, then open:
echo http://localhost:5173
echo.

pause