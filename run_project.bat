@echo off
echo Starting Fraud Detection System...

echo Starting Backend (FastAPI)...
start "FDS Backend" cmd /k "uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Waiting for backend to initialize...
timeout /t 5

echo Starting Frontend (Vite)...
cd vigilant-watch-main
start "FDS Frontend" cmd /k "npm run dev"

echo Project is running!
echo Backend: http://127.0.0.1:8000/docs
echo Frontend: http://localhost:5173 (usually)
pause
