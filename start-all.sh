#!/bin/bash

# Voice AI Demo - Start All Services
echo "=============================================="
echo "  🚀 VOICE AI DEMO - STARTING ALL SERVICES"
echo "=============================================="
echo ""
echo "Starting services:"
echo "  📊 Frontend (React/Vite)"
echo "  🌐 Node.js API Server"
echo "  🎤 Python Backend (Whisper)"
echo ""
echo "Please wait while services initialize..."
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Start all services
npm run start:all
