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

// Mock speech recognition for demo
const mockTranscripts = [
  "Why is my bill so high this month?",
  "I can't access my account online",
  "When is my next payment due?",
  "I want to cancel my service",
  "How do I change my billing address?",
  "My internet connection is very slow",
  "Can you help me with my password reset?"
];

const mockRoutes = [
  { type: "billing", confidence: 0.92 },
  { type: "technical", confidence: 0.89 },
  { type: "account", confidence: 0.95 },
  { type: "cancellation", confidence: 0.87 },
  { type: "billing", confidence: 0.91 },
  { type: "technical", confidence: 0.85 },
  { type: "account", confidence: 0.93 }
];

const mockResponses = [
  "I can see your bill increased due to additional data usage this month. You used 15GB over your plan limit at $10/GB. Would you like me to explain the charges or help you upgrade to an unlimited plan?",
  "I can help you reset your account access. I see you last logged in 3 days ago. Let me send a secure reset link to your registered email address ending in ...@gmail.com.",
  "Your next payment of $89.99 is due on March 15th, 2024. You're currently set up for auto-pay on your Visa ending in 1234. Would you like to change the payment method?",
  "I understand you'd like to cancel your service. Before we proceed, I can see you're a valued customer for 3 years. Let me check if there are any retention offers available for you.",
  "I can update your billing address right away. For security, I'll need to verify a few details first. Can you confirm the last 4 digits of your social security number?",
  "I can see there are network issues in your area affecting speeds. Our technicians are working on it and expect resolution by 6 PM today. I can also schedule a technician visit if needed.",
  "I'll help you reset your password. For security, I'm sending a verification code to your phone ending in 5678. Please enter the code when you receive it."
];

export const VoiceRecorder = ({ onQueryComplete, onProcessingStart }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    onProcessingStart();
    
    // Simulate recording and transcription
    const randomIndex = Math.floor(Math.random() * mockTranscripts.length);
    const mockTranscript = mockTranscripts[randomIndex];
    const route = mockRoutes[randomIndex];
    const response = mockResponses[randomIndex];
    
    // Simulate real-time transcription
    let currentText = "";
    const words = mockTranscript.split(" ");
    
    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += (index > 0 ? " " : "") + word;
        setTranscript(currentText);
      }, index * 200);
    });
    
    // Auto-stop after transcript is complete and process
    timeoutRef.current = setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        const query: Query = {
          id: Date.now().toString(),
          timestamp: new Date(),
          transcript: mockTranscript,
          route: route.type,
          response: response,
          confidence: route.confidence
        };
        
        onQueryComplete(query);
        setIsProcessing(false);
        setTranscript("");
      }, 2000);
    }, words.length * 200 + 1000);
  };

  const stopRecording = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsRecording(false);
    setIsProcessing(false);
    setTranscript("");
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
              {transcript || "Listening..."}
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