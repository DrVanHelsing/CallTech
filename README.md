# Voice AI Customer Service Application

An intelligent voice-powered customer service system built with React, Node.js, and Python.

## 🎯 **Features**

- **Voice Input**: Record voice queries using browser microphone
- **Speech-to-Text**: Powered by OpenAI Whisper for accurate transcription
- **AI Responses**: Smart customer service responses using Mistral AI
- **Text-to-Speech**: Natural voice responses using browser speech synthesis
- **Customer Database**: Integrated customer lookup and management
- **Interactive Pipeline**: Visual workflow showing processing stages

## 🚀 **Quick Start**

**Development Setup:**

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/DrVanHelsing/CallTech.git

# Step 2: Navigate to the project directory.
cd CallTech

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Set up Python environment and dependencies.
cd python-backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
cd ..

# Step 5: Configure environment variables.
# Create .env files in both root and server directories
# Add your OpenRouter API key to server/.env:
# OPENROUTER_API_KEY=your_api_key_here

# Step 6: Start all development servers.
npm run start:all
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.

## What technologies are used for this project?

This project is built with:

## 🛠 **Tech Stack**

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn-ui
- **Backend API**: Node.js + Express + OpenRouter (Mistral AI)
- **Speech Processing**: Python + FastAPI + OpenAI Whisper
- **Audio**: Browser MediaRecorder + SpeechSynthesis APIs

## 🏗 **Architecture**

```
Voice Input → Whisper STT → Customer Lookup → Mistral AI → Browser TTS → Voice Output
```

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
