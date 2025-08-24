from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, StreamingResponse
import whisper
import tempfile
import os
from TTS.api import TTS
from pydub import AudioSegment
from io import BytesIO

app = FastAPI()

# Load Whisper model (base for speed, change to 'small' or 'medium' for accuracy)
whisper_model = whisper.load_model('base')

# Load Coqui TTS model (use default English model)
tts_model = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)

def convert_wav_to_mp3(wav_bytes):
    audio = AudioSegment.from_file(BytesIO(wav_bytes), format="wav")
    mp3_io = BytesIO()
    audio.export(mp3_io, format="mp3")
    mp3_io.seek(0)
    return mp3_io

@app.post("/stt")
async def stt(audio: UploadFile = File(...)):
    # Save uploaded audio to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name
    try:
        result = whisper_model.transcribe(tmp_path)
        return {"transcript": result["text"]}
    finally:
        os.remove(tmp_path)

@app.post("/tts")
async def tts(text: str = Form(...)):
    # Synthesize speech to wav
    wav_bytes = tts_model.tts(text=text, speaker=tts_model.speakers[0], language=tts_model.languages[0], return_bytes=True)
    # Convert wav to mp3 for browser compatibility
    mp3_io = convert_wav_to_mp3(wav_bytes)
    return StreamingResponse(mp3_io, media_type="audio/mpeg")

@app.get("/")
def root():
    return {"ok": True, "msg": "Python speech backend running"}
