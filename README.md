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
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
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
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

## 🛠 **Tech Stack**

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn-ui
- **Backend API**: Node.js + Express + OpenRouter (Mistral AI)
- **Speech Processing**: Python + FastAPI + OpenAI Whisper
- **Audio**: Browser MediaRecorder + SpeechSynthesis APIs

## 📦 **Deployment**

The application is configured for deployment on:
- **Frontend**: Vercel (React/Vite hosting)
- **Backend Services**: Railway (Node.js + Python)

See `deployment-guide.md` for detailed deployment instructions.

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
