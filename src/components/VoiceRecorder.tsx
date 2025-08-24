import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square } from "lucide-react";
import { Query } from "@/pages/Index";

interface VoiceRecorderProps {
  onQueryComplete: (query: Query) => void;
  onProcessingStart: () => void;
}

export const VoiceRecorder = ({ onQueryComplete, onProcessingStart }: VoiceRecorderProps) => {
// ...existing code above...


  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    setIsRecording(true);
    setTranscript("");
    setAudioChunks([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const supportedType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : '';
      const recorder = supportedType ? new MediaRecorder(stream, { mimeType: supportedType }) : new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        onProcessingStart();
        const type = recorder.mimeType || 'audio/webm';
        const ext = type.includes('ogg') ? 'ogg' : 'webm';
        const audioBlob = new Blob(chunks, { type });
        setAudioChunks([]);

        // Send audio to Python backend for transcription
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording.${ext}`);

        const PYTHON_API = 'https://super-duper-enigma-9w57j6xx6xwhxrj5-8000.app.github.dev';
        const NODE_API = 'https://super-duper-enigma-9w57j6xx6xwhxrj5-3001.app.github.dev';
        try {
          // 1. Speech-to-text (Python backend)
          const transcriptRes = await fetch(`${PYTHON_API}/stt`, {
            method: 'POST',
            body: formData
          });
          if (!transcriptRes.ok) {
            const errText = await transcriptRes.text();
            throw new Error(`speech-to-text failed: ${errText}`);
          }
          const transcriptData = await transcriptRes.json();
          setTranscript(transcriptData.transcript);

          // 2. Fetch customer data (Node backend)
          const customerRes = await fetch(`${NODE_API}/api/customers/CUST-2024-001`);
          if (!customerRes.ok) {
            const errText = await customerRes.text();
            throw new Error(`customer fetch failed: ${errText}`);
          }
          const customer = await customerRes.json();

          // 3. Send transcript and customer to AI endpoint (Node backend)
          const aiRes = await fetch(`${NODE_API}/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: transcriptData.transcript, customer })
          });
          if (!aiRes.ok) {
            const errText = await aiRes.text();
            throw new Error(`ai/chat failed: ${errText}`);
          }
          const aiData = await aiRes.json();

          // 4. Text-to-speech (Python backend)
          const ttsForm = new FormData();
          ttsForm.append('text', aiData.response);
          const ttsRes = await fetch(`${PYTHON_API}/tts`, {
            method: 'POST',
            body: ttsForm
          });
          if (ttsRes.ok) {
            const audioUrl = URL.createObjectURL(await ttsRes.blob());
            const audio = new Audio(audioUrl);
            audio.play();
          }

          const query: Query = {
            id: Date.now().toString(),
            timestamp: new Date(),
            transcript: transcriptData.transcript,
            route: 'ai',
            response: aiData.response,
            confidence: 1
          };
          onQueryComplete(query);
        } catch (err: any) {
          console.error(err);
          setTranscript('Error processing audio or AI response.');
        }
        setIsProcessing(false);
      };

      recorder.start();
    } catch (err) {
      setTranscript('Microphone access denied or not available.');
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Recording Button */}
      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`h-24 w-24 rounded-full transition-all duration-300 ${
            isRecording 
              ? "bg-destructive hover:bg-destructive/90 animate-pulse shadow-elevated" 
              : "bg-gradient-primary hover:scale-105 shadow-card"
          }`}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : isRecording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        
        <div className="text-center">
          {isProcessing ? (
            <p className="text-sm text-muted-foreground">Processing query...</p>
          ) : isRecording ? (
            <>
              <p className="text-sm font-medium text-destructive">Recording</p>
              <p className="text-xs text-muted-foreground">Click to stop</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Ready to listen</p>
              <p className="text-xs text-muted-foreground">Click to start recording</p>
            </>
          )}
        </div>
      </div>

      {/* Live Transcript */}
      {(transcript || isRecording) && (
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MicOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Live Transcript</span>
              {isRecording && (
                <Badge variant="destructive" className="text-xs">
                  Recording
                </Badge>
              )}
            </div>
            <p className="text-foreground min-h-[2rem] leading-relaxed">
              {transcript || (isRecording ? "Listening..." : "")}
              {isRecording && (
                <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse"></span>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};