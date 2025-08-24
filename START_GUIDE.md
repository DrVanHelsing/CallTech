# 🚀 Voice AI Demo - Quick Start Guide

## Single Command Startup

### Option 1: Batch File (Windows)
```bash
./start-all.bat
```

### Option 2: NPM Script
```bash
npm run start:all
```

### Option 3: Shell Script (Cross-platform)
```bash
chmod +x start-all.sh
./start-all.sh
```

## What Happens

The startup command will launch all three services simultaneously:

1. **🌐 Node.js API Server** (Port 3001)
   - Customer database API
   - OpenRouter/AI chat integration
   - Speech service tokens

2. **🎤 Python Backend** (Port 8001)
   - Whisper speech-to-text
   - Audio processing with FFmpeg
   - Text-to-speech endpoints

3. **📊 Frontend** (Port 8080/8081)
   - React voice recorder UI
   - Real-time transcription display
   - Voice AI interaction interface

## Access URLs

After startup, access your voice AI demo at:
- **Local**: http://localhost:8080/ (or 8081 if 8080 is busy)
- **Network**: http://172.17.144.122:8080/

## Service Status

Watch the colored console output:
- 🔵 **Blue**: API Server logs
- 🟢 **Green**: Python Backend logs  
- 🟡 **Yellow**: Frontend (Vite) logs

## Stop All Services

Press `Ctrl+C` in the terminal to stop all services.

## Troubleshooting

If any service fails to start:
1. Check that ports 3001, 8001, and 8080/8081 are available
2. Ensure Python virtual environment is activated
3. Verify environment variables in `.env` file
4. Check individual service logs for specific errors

## Manual Startup (if needed)

Start services individually:
```bash
# Terminal 1 - API Server
npm run start:server

# Terminal 2 - Python Backend  
npm run start:python

# Terminal 3 - Frontend
npm run dev
```
