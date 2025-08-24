# Voice AI Demo - PowerShell Startup Script
Write-Host "=============================================="
Write-Host "  🚀 VOICE AI DEMO - STARTING ALL SERVICES"
Write-Host "=============================================="
Write-Host ""
Write-Host "Starting services:"
Write-Host "  📊 Frontend (React/Vite)"
Write-Host "  🌐 Node.js API Server"
Write-Host "  🎤 Python Backend (Whisper)"
Write-Host ""
Write-Host "Please wait while services initialize..."
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Start all services
npm run start:all
