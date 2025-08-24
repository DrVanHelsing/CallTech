from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, StreamingResponse
import whisper
import tempfile
import os
import librosa
import soundfile as sf
from pydub import AudioSegment
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. For prod, use your frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model (base for speed, change to 'small' or 'medium' for accuracy)
print("Loading Whisper model...")
whisper_model = whisper.load_model('base')
print("Whisper model loaded successfully!")

@app.post("/stt")
async def stt(audio: UploadFile = File(...)):
    tmp_path = None
    wav_path = None
    try:
        print(f"Received audio file: {audio.filename}, content_type: {audio.content_type}")
        
        # Save uploaded audio to temp file
        audio_content = await audio.read()
        print(f"Audio file size: {len(audio_content)} bytes")
        
        # Save as the original format first
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp:
            tmp.write(audio_content)
            tmp_path = tmp.name
        
        print(f"Saved audio to temp file: {tmp_path}")
        
        # Convert webm to wav using pydub
        wav_path = tmp_path.replace('.webm', '.wav')
        try:
            print("Converting audio using pydub...")
            audio_segment = AudioSegment.from_file(tmp_path, format="webm")
            audio_segment.export(wav_path, format="wav")
            print(f"Successfully converted to: {wav_path}")
            
            # Use whisper with the wav file
            print("Starting Whisper transcription...")
            result = whisper_model.transcribe(wav_path)
            print(f"Transcription result: {result['text']}")
            return {"transcript": result["text"]}
            
        except Exception as conv_error:
            print(f"Audio conversion error: {conv_error}")
            # Fallback to librosa approach
            print("Falling back to librosa...")
            audio_data, sr = librosa.load(tmp_path, sr=16000)
            sf.write(wav_path, audio_data, sr)
            print(f"Fallback conversion successful: {wav_path}")
            
            result = whisper_model.transcribe(wav_path)
            print(f"Transcription result: {result['text']}")
            return {"transcript": result["text"]}
            
    except Exception as e:
        error_msg = str(e)
        print(f"Error in STT: {error_msg}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"STT processing failed: {error_msg}"}
        )
    finally:
        # Clean up temp files
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
            print(f"Cleaned up: {tmp_path}")
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)
            print(f"Cleaned up: {wav_path}")

@app.post("/tts")
async def tts(text: str = Form(...)):
    # Simplified TTS - just return success for now
    return {"message": "TTS not implemented yet", "text": text}

@app.get("/")
def root():
    return {"ok": True, "msg": "Python speech backend running"}
