import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Volume2, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Query } from "@/pages/Index";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ResponseDisplayProps {
  query: Query;
  isProcessing: boolean;
}

export const ResponseDisplay = ({ query, isProcessing }: ResponseDisplayProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(query.response);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support speech synthesis.",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query.response);
    toast({
      title: "Response copied",
      description: "The response has been copied to your clipboard.",
    });
  };

  const handleFeedback = (positive: boolean) => {
    toast({
      title: "Feedback recorded",
      description: `Thank you for your ${positive ? 'positive' : 'negative'} feedback!`,
    });
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Generating response...</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Response Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generated Response</span>
                <Badge variant="secondary" className="text-xs">
                  {query.response.split(' ').length} words
                </Badge>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed text-foreground">
                  {query.response}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {isSpeaking ? "Speaking..." : "Speak"}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>

            {/* Response Quality */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Response Quality</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <Badge variant={query.confidence > 0.9 ? "default" : "secondary"}>
                    {Math.round(query.confidence * 100)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFeedback(true)}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFeedback(false)}
                    className="h-8 w-8 p-0"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Response Metadata */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Response Time: 2.1s</span>
                <span>Agent: {query.route.charAt(0).toUpperCase() + query.route.slice(1)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};