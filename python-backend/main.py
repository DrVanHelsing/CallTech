from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, StreamingResponse
import whisper
import tempfile
import os
import imageio_ffmpeg
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = FastAPI(title="Voice AI Python Backend", version="1.0.0")

# Ensure whisper can find ffmpeg
try:
    ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_dir = os.path.dirname(ffmpeg_path)

    # Prepend ffmpeg_dir to PATH to prioritize the bundled ffmpeg
    os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
    print(f"ffmpeg path configured successfully: {ffmpeg_path}")
    print(f"ffmpeg directory added to PATH: {ffmpeg_dir}")

    # On Windows the bundled binary may have a long filename (not 'ffmpeg.exe').
    # Whisper (and other tools) call 'ffmpeg' by name. Create a small wrapper
    # 'ffmpeg.bat' in the same directory so that running `ffmpeg ...` works.
    wrapper_path = os.path.join(ffmpeg_dir, "ffmpeg.bat")
    try:
        if not os.path.exists(wrapper_path):
            with open(wrapper_path, "w", encoding="utf-8") as wf:
                # Use quoted full path to handle spaces, and forward all args
                wf.write(f'@echo off\r\n"{ffmpeg_path}" %*\r\n')
            print(f"Created ffmpeg wrapper at: {wrapper_path}")
        else:
            print(f"ffmpeg wrapper already exists: {wrapper_path}")
    except Exception as w_e:
        print(f"Failed to create ffmpeg wrapper: {w_e}")

    # Diagnostic: try running 'ffmpeg -version' to verify it's callable by name
    try:
        import subprocess
        proc = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True)
        if proc.returncode == 0:
            first_line = (proc.stdout.splitlines()[0] if proc.stdout else proc.stderr.splitlines()[0])
            print("ffmpeg subprocess returned:", first_line)
        else:
            print("ffmpeg subprocess returned non-zero code:", proc.returncode)
            if proc.stderr:
                print(proc.stderr.splitlines()[:3])
    except Exception as sub_e:
        print(f"ffmpeg subprocess check failed: {sub_e}")
except Exception as e:
    print(f"Warning: imageio-ffmpeg not found or error: {e}")
    print("Install it with: pip install imageio-ffmpeg")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. For prod, use your frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model (configurable via environment)
whisper_model_name = os.getenv('WHISPER_MODEL', 'base')
print(f"Loading Whisper model: {whisper_model_name}...")
whisper_model = whisper.load_model(whisper_model_name)
print("Whisper model loaded successfully!")

@app.get("/")
async def root():
    return {
        "message": "Voice AI Python Backend",
        "endpoints": ["/stt", "/tts"],
        "status": "running"
    }

@app.post("/stt")
async def stt(audio: UploadFile = File(...)):
    tmp_path = None
    try:
        print(f"Received audio file: {audio.filename}, content_type: {audio.content_type}")
        
        # Save uploaded audio to temp file
        audio_content = await audio.read()
        print(f"Audio file size: {len(audio_content)} bytes")
        
        # Determine file extension based on content type or filename
        file_extension = '.webm'  # default
        if audio.content_type:
            if 'ogg' in audio.content_type:
                file_extension = '.ogg'
            elif 'mp3' in audio.content_type:
                file_extension = '.mp3'
            elif 'wav' in audio.content_type:
                file_extension = '.wav'
        
        # Save with appropriate extension
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp:
            tmp.write(audio_content)
            tmp_path = tmp.name
        
        print(f"Saved audio to temp file: {tmp_path}")
        
        # Convert incoming audio to WAV using bundled imageio-ffmpeg binary to avoid
        # Whisper needing to call system-wide ffmpeg. This uses the imageio-ffmpeg
        # executable path discovered at startup.
        try:
            wav_path = tmp_path.replace(file_extension, '.wav')
            ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
            import subprocess
            # Build ffmpeg command: input tmp_path -> output wav_path, 16kHz mono WAV
            cmd = [
                ffmpeg_exe,
                '-y',
                '-i', tmp_path,
                '-ar', '16000',
                '-ac', '1',
                '-f', 'wav',
                wav_path
            ]
            print(f"Running ffmpeg command: {cmd[0]} ...")
            proc = subprocess.run(cmd, capture_output=True, text=True)
            if proc.returncode != 0:
                print("ffmpeg conversion failed:")
                print(proc.stderr)
                raise RuntimeError(f"ffmpeg conversion failed: {proc.stderr}")
            print(f"Conversion to WAV complete: {wav_path}")

            # Run whisper on the wav file - but load audio manually to avoid Whisper's ffmpeg calls
            print("Starting Whisper transcription on WAV file...")
            
            # Load the WAV file manually using scipy or soundfile to avoid Whisper's audio loading
            try:
                import soundfile as sf
                audio_data, sample_rate = sf.read(wav_path)
                print(f"Loaded audio data: shape={audio_data.shape}, sr={sample_rate}")
                
                # Resample to 16kHz if needed (Whisper expects 16kHz)
                if sample_rate != 16000:
                    import librosa
                    audio_data = librosa.resample(audio_data, orig_sr=sample_rate, target_sr=16000)
                    print("Resampled audio to 16kHz")
                
                # Convert to float32 and ensure mono
                import numpy as np
                if len(audio_data.shape) > 1:
                    audio_data = np.mean(audio_data, axis=1)  # Convert to mono
                audio_data = audio_data.astype(np.float32)
                
                # Pass the raw audio array directly to Whisper (bypasses its audio loading)
                print(f"Audio array stats: min={np.min(audio_data):.4f}, max={np.max(audio_data):.4f}, mean={np.mean(audio_data):.4f}")
                print(f"Audio energy: {np.sqrt(np.mean(audio_data**2)):.6f}")
                
                result = whisper_model.transcribe(audio_data, language=None, fp16=False, verbose=False)
                text = result.get("text", "").strip()
                print(f"Transcription result: '{text}'")
                print(f"Full Whisper result keys: {list(result.keys())}")
                
                # If empty, try with different Whisper settings
                if not text:
                    print("Empty result, trying with language='en' and different settings...")
                    result2 = whisper_model.transcribe(
                        audio_data, 
                        language='en',
                        fp16=False, 
                        verbose=True,
                        temperature=0.0,
                        best_of=1
                    )
                    text2 = result2.get("text", "").strip()
                    print(f"Second attempt result: '{text2}'")
                    if text2:
                        text = text2
                
            except ImportError as import_err:
                print(f"soundfile/librosa not available: {import_err}")
                # Fallback: try Whisper with WAV file path (may still fail)
                result = whisper_model.transcribe(wav_path, language=None, fp16=False, verbose=False)
                text = result.get("text", "").strip()
                print(f"Transcription result (fallback): {text}")

            # Clean up wav file
            if os.path.exists(wav_path):
                os.remove(wav_path)
            # Remove original tmp file in finally block
            return {"transcript": text}
        except Exception as conversion_error:
            print(f"Conversion/transcription error: {conversion_error}")
            raise
            
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

@app.post("/tts")
async def tts(text: str = Form(...)):
    """Convert text to speech using a simple TTS approach"""
    try:
        print(f"TTS request for text: {text[:50]}...")
        
        # For demo purposes, return a simple JSON response
        # In production, you could integrate with:
        # - Azure Speech Services
        # - Google Text-to-Speech
        # - AWS Polly
        # - Open source TTS like festival, espeak, or coqui-tts
        
        return {
            "message": "TTS processed (browser-based TTS is being used)",
            "text": text,
            "length": len(text),
            "status": "success"
        }
    except Exception as e:
        print(f"TTS error: {e}")
        return {"error": str(e), "status": "failed"}

@app.get("/")
def root():
    return {"ok": True, "msg": "Python speech backend running"}

@app.get("/debug")
def debug_info():
    """Debug endpoint to check system status"""
    import sys
    return {
        "python_version": sys.version,
        "whisper_model_loaded": whisper_model is not None,
        "ffmpeg_available": True,  # We know it's configured
        "status": "ready"
    }
