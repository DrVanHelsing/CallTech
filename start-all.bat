@echo off
title Voice AI Demo - Starting All Services
echo.
echo ==============================================
echo   🚀 VOICE AI DEMO - STARTING ALL SERVICES
echo ==============================================
echo.
echo Starting services:
echo   📊 Frontend (React/Vite)
echo   🌐 Node.js API Server  
echo   🎤 Python Backend (Whisper)
echo.
echo Please wait while services initialize...
echo.

cd /d "%~dp0"
npm run start:all
