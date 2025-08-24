import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square, Volume2 } from "lucide-react";
import { Query } from "@/pages/Index";

const NODE_API = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3001';

interface VoiceRecorderProps {
  onQueryComplete: (query: Query) => void;
  onProcessingStart: () => void;
  selectedCustomerId?: string;
  onCustomerSelected?: (customerId: string) => void;
  onAIProcessingStart?: () => void;
  onTTSStart?: () => void;
  onComplete?: () => void;
}

export const VoiceRecorder = ({ 
  onQueryComplete, 
  onProcessingStart, 
  selectedCustomerId, 
  onCustomerSelected,
  onAIProcessingStart,
  onTTSStart,
  onComplete
}: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'user' | 'ai', message: string, timestamp: Date}>>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean text for TTS to avoid reading special characters literally
  const cleanTextForTTS = (text: string): string => {
    return text
      // Replace common symbols with words
      .replace(/\$/g, ' dollar ')
      .replace(/%/g, ' percent ')
      .replace(/@/g, ' at ')
      .replace(/#/g, ' number ')
      .replace(/&/g, ' and ')
      .replace(/\*/g, ' star ')
      .replace(/\+/g, ' plus ')
      .replace(/=/g, ' equals ')
      .replace(/</g, ' less than ')
      .replace(/>/g, ' greater than ')
      .replace(/\|/g, ' ')
      .replace(/\\/g, ' ')
      .replace(/\//g, ' slash ')
      // Remove brackets and braces
      .replace(/[\[\]{}]/g, ' ')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Clean up any extra spaces
      .trim();
  };

  // Text-to-Speech function
  const speakResponse = (text: string, onComplete?: () => void) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Clean the text for better TTS pronunciation
      const cleanedText = cleanTextForTTS(text);
      
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      
      // Configure voice settings for more natural speech
      utterance.rate = 0.85; // Slightly slower for more natural pace
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Try to use a natural female voice
      const voices = window.speechSynthesis.getVoices();
      
      // Priority order for natural female voices
      const preferredVoiceNames = [
        'Microsoft Zira Desktop',     // Windows natural female voice
        'Microsoft Zira',             // Windows Zira
        'Microsoft Eva Mobile',       // Windows Eva
        'Google UK English Female',   // Google female
        'Google US English Female',   // Google female US
        'Samantha',                   // macOS natural female
        'Victoria',                   // macOS Victoria
        'Allison',                    // macOS Allison
        'Ava',                        // macOS Ava
        'Serena',                     // macOS Serena
        'Alex'                        // Fallback - good quality voice
      ];
      
      // Find the best available female voice
      let selectedVoice = null;
      
      // First, try exact name matches
      for (const voiceName of preferredVoiceNames) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes(voiceName.toLowerCase())
        );
        if (selectedVoice) break;
      }
      
      // If no exact match, try to find any high-quality female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.toLowerCase().includes('female') ||
           voice.name.toLowerCase().includes('woman') ||
           voice.name.toLowerCase().includes('zira') ||
           voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('microsoft'))
        );
      }
      
      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Selected voice:', selectedVoice.name, selectedVoice.lang);
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onComplete?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        onComplete?.();
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // If speech synthesis is not available, call the callback immediately
      onComplete?.();
    }
  };

  // Handle customer identification through voice
  const handleCustomerIdentification = async (transcript: string) => {
    try {
      // Look for phone numbers in the transcript
      const phoneMatch = transcript.match(/\b\d{4}\b/); // Look for 4-digit sequences
      if (phoneMatch) {
        const phoneDigits = phoneMatch[0];
        const response = await fetch(`${NODE_API}/api/customers/lookup/phone/${phoneDigits}`);
        if (response.ok) {
          const customer = await response.json();
          onCustomerSelected?.(customer.id);
          const welcomeMessage = `Customer identified: ${customer.name}. How can I help you today?`;
          setTranscript(welcomeMessage);
          speakResponse(welcomeMessage, () => setIsProcessing(false));
          return;
        }
      }

      // Look for customer names in the transcript
      const names = ['sarah', 'john', 'maria'];
      const foundName = names.find(name => 
        transcript.toLowerCase().includes(name)
      );
      if (foundName) {
        let customerId = '';
        switch (foundName) {
          case 'sarah': customerId = 'CUST-2024-001'; break;
          case 'john': customerId = 'CUST-2024-002'; break;
          case 'maria': customerId = 'CUST-2024-003'; break;
        }
        if (customerId) {
          onCustomerSelected?.(customerId);
          const response = await fetch(`${NODE_API}/api/customers/${customerId}`);
          const customer = await response.json();
          const welcomeMessage = `Hello ${customer.name}! I've accessed your account. How can I help you today?`;
          setTranscript(welcomeMessage);
          speakResponse(welcomeMessage, () => setIsProcessing(false));
          return;
        }
      }

      // If no identification found, ask for it
      const helpMessage = "Hello! To help you today, I need to identify your account. Please say your phone number's last 4 digits, or say your first name.";
      setTranscript(helpMessage);
      speakResponse(helpMessage, () => setIsProcessing(false));
    } catch (error) {
      console.error('Customer identification error:', error);
      const errorMessage = "Hello! I'm having trouble accessing customer information. Please try saying your name or phone number again.";
      setTranscript(errorMessage);
      speakResponse(errorMessage, () => setIsProcessing(false));
    }
  };

  // Stop speaking function
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startRecording = async () => {
    // Stop any ongoing speech before recording
    stopSpeaking();
    
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

        // Use environment variables or fallback to localhost
        const PYTHON_API = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8001';
        const NODE_API = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3001';
        
        console.log('API URLs:', { PYTHON_API, NODE_API });
        
        try {
          // 1. Speech-to-text (Python backend)
          console.log('Sending audio to:', `${PYTHON_API}/stt`);
          const transcriptRes = await fetch(`${PYTHON_API}/stt`, {
            method: 'POST',
            body: formData
          });
          if (!transcriptRes.ok) {
            const errText = await transcriptRes.text();
            throw new Error(`speech-to-text failed: ${errText}`);
          }
          const transcriptData = await transcriptRes.json();
          console.log('Transcript received:', transcriptData.transcript);
          setTranscript(transcriptData.transcript);

          // Check if transcript is empty
          if (!transcriptData.transcript || transcriptData.transcript.trim() === '') {
            throw new Error('No speech detected in the recording. Please try speaking more clearly or louder.');
          }

          // Handle customer identification if not selected
          if (!selectedCustomerId) {
            await handleCustomerIdentification(transcriptData.transcript);
            return;
          }

          // 2. Fetch customer data (Node backend)
          const customerRes = await fetch(`${NODE_API}/api/customers/${selectedCustomerId}`);
          if (!customerRes.ok) {
            const errText = await customerRes.text();
            throw new Error(`customer fetch failed: ${errText}`);
          }
          const customer = await customerRes.json();

          // 3. Send transcript and customer to AI endpoint (Node backend)
          onAIProcessingStart?.();
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

          // 4. Speak the AI response
          onTTSStart?.();
          speakResponse(aiData.response, () => {
            // Processing is complete only after speech finishes
            setIsProcessing(false);
            onComplete?.();
          });

          // Add to conversation history
          setConversationHistory(prev => [
            ...prev,
            { type: 'user', message: transcriptData.transcript, timestamp: new Date() },
            { type: 'ai', message: aiData.response, timestamp: new Date() }
          ]);

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
          setIsProcessing(false);
        }
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
    <div className="space-y-3">
      {/* Compact Recording Button */}
      <div className="flex flex-col items-center gap-2">
        <Button
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || isSpeaking}
          className={`h-16 w-16 rounded-full transition-all duration-300 ${
            isSpeaking
              ? "bg-blue-500 hover:bg-blue-600 animate-pulse shadow-elevated"
              : isRecording 
              ? "bg-destructive hover:bg-destructive/90 animate-pulse shadow-elevated" 
              : "bg-gradient-primary hover:scale-105 shadow-card"
          }`}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : isSpeaking ? (
            <div className="flex items-center justify-center">
              <div className="w-1.5 h-4 bg-white rounded-full animate-pulse mx-0.5"></div>
              <div className="w-1.5 h-6 bg-white rounded-full animate-pulse mx-0.5" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1.5 h-4 bg-white rounded-full animate-pulse mx-0.5" style={{animationDelay: '0.4s'}}></div>
            </div>
          ) : isRecording ? (
            <Square className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        
        <div className="text-center">
          {isProcessing ? (
            <p className="text-xs text-muted-foreground">Processing...</p>
          ) : isSpeaking ? (
            <p className="text-xs font-medium text-blue-600">AI Speaking</p>
          ) : isRecording ? (
            <p className="text-xs font-medium text-destructive">Recording</p>
          ) : (
            <p className="text-xs font-medium">Ready</p>
          )}
        </div>
      </div>

      {/* Compact Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Volume2 className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Chat</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setConversationHistory([])}
              className="ml-auto h-4 px-1 text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {conversationHistory.slice(-4).map((item, index) => (
              <div key={index} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded text-xs ${
                  item.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  {item.message.length > 60 ? item.message.substring(0, 60) + '...' : item.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compact Live Transcript */}
      {(transcript || isRecording) && transcript && (
        <div className="p-2 bg-muted/50 rounded text-xs">
          <div className="flex items-center gap-1 mb-1">
            <MicOff className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">Transcript</span>
            {isRecording && (
              <Badge variant="destructive" className="text-xs h-4">
                •
              </Badge>
            )}
          </div>
          <p className="text-foreground leading-relaxed">
            {transcript && transcript.length > 80 ? transcript.substring(0, 80) + '...' : transcript}
            {isRecording && (
              <span className="inline-block w-1 h-3 bg-primary ml-1 animate-pulse"></span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};