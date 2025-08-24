#!/usr/bin/env python3
"""
Test script to verify STT functionality with a known audio sample.
"""
import requests
import numpy as np
import soundfile as sf
import tempfile
import os

def create_test_audio():
    """Create a simple test audio file with a beep tone."""
    # Generate a 2-second sine wave at 440 Hz (A note)
    duration = 2.0  # seconds
    sample_rate = 16000
    frequency = 440  # Hz
    
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    # Create a simple sine wave
    audio = np.sin(2 * np.pi * frequency * t) * 0.5
    
    # Add a fade in/out to avoid clicks
    fade_samples = int(0.1 * sample_rate)  # 0.1 second fade
    audio[:fade_samples] *= np.linspace(0, 1, fade_samples)
    audio[-fade_samples:] *= np.linspace(1, 0, fade_samples)
    
    return audio, sample_rate

def test_stt_endpoint():
    """Test the STT endpoint with synthetic audio."""
    print("Creating test audio...")
    audio_data, sample_rate = create_test_audio()
    
    # Save to temporary WAV file
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
        wav_path = tmp_file.name
        sf.write(wav_path, audio_data, sample_rate)
    
    try:
        print(f"Saved test audio to: {wav_path}")
        print(f"Audio duration: {len(audio_data) / sample_rate:.2f} seconds")
        
        # Test the STT endpoint
        url = "http://localhost:8001/stt"
        
        with open(wav_path, 'rb') as audio_file:
            files = {'audio': ('test_audio.wav', audio_file, 'audio/wav')}
            
            print(f"Sending test audio to {url}...")
            response = requests.post(url, files=files)
            
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                transcript = result.get('transcript', '')
                print(f"Transcript: '{transcript}'")
                if transcript.strip():
                    print("✅ STT endpoint working - detected speech!")
                else:
                    print("⚠️  STT endpoint working but no speech detected (expected for beep tone)")
            else:
                print(f"❌ STT endpoint failed: {response.text}")
                
    except Exception as e:
        print(f"❌ Error testing STT: {e}")
    finally:
        # Clean up
        if os.path.exists(wav_path):
            os.remove(wav_path)
            print(f"Cleaned up: {wav_path}")

if __name__ == "__main__":
    test_stt_endpoint()
