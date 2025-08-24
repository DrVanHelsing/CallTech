# Python Speech Backend (FastAPI)

This backend provides:
- `/stt` — Speech-to-text using Whisper (POST audio, get transcript)
- `/tts` — Text-to-speech using Coqui TTS (POST text, get mp3 audio)

## Setup

1. Install dependencies (ideally in a virtualenv):
   ```bash
   cd python-backend
   pip install -r requirements.txt
   ```

2. Run the server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Endpoints

### POST `/stt`
- **Body:** `audio` (file, wav/ogg/webm)
- **Returns:** `{ "transcript": "..." }`

### POST `/tts`
- **Body:** `text` (form field)
- **Returns:** mp3 audio stream

## Example curl

**STT:**
```bash
curl -F "audio=@yourfile.wav" http://localhost:8000/stt
```

**TTS:**
```bash
curl -X POST -F "text=Hello world!" http://localhost:8000/tts --output out.mp3
```
