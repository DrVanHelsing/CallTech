import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { CustomerDatabase } from "@/components/CustomerDatabase";
import { CustomerIdentification } from "@/components/CustomerIdentification";
import { AIRouter } from "@/components/AIRouter";
import { ResponseDisplay } from "@/components/ResponseDisplay";
import { QueryHistory } from "@/components/QueryHistory";
import { Phone, Bot, Database, Zap, Mic, MessageSquare, ArrowDown, ArrowRight, CheckCircle } from "lucide-react";

export interface Query {
  id: string;
  timestamp: Date;
  transcript: string;
  route: string;
  response: string;
  confidence: number;
}

const Index = () => {
  const [currentQuery, setCurrentQuery] = useState<Query | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Sample customer data for identification
  const customers = [
    { id: "CUST-2024-001", name: "Sarah Johnson", phone: "***-***-5678", plan: "Premium Internet + TV Bundle" },
    { id: "CUST-2024-002", name: "John Doe", phone: "***-***-1234", plan: "Basic Internet" },
    { id: "CUST-2024-003", name: "Maria Rodriguez", phone: "***-***-9876", plan: "Family Bundle Plus" }
  ];

  const handleQueryComplete = (query: Query) => {
    setCurrentQuery(query);
    setQueries(prev => [query, ...prev]);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  const handleCustomerSelected = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  return (
    <div className="min-h-screen bg-gradient-bg relative">
      <div className="container mx-auto p-6 pb-40">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              AI Voice Processing Pipeline
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time voice-to-AI processing with customer identification and intelligent routing
          </p>
        </div>

        {/* Processing Pipeline - Main Focus */}
        <div className="mb-8">
          <Card className="bg-gradient-card shadow-elevated border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Processing Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 py-8">
                {/* Step 1: Voice Input */}
                <div className="flex flex-col items-center space-y-3 min-w-[140px]">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isProcessing ? 'bg-blue-500 animate-pulse' : 'bg-muted'
                  }`}>
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">Voice Input</div>
                    <div className="text-xs text-muted-foreground">Speech Recognition</div>
                  </div>
                  <div className="h-6 flex items-center">
                    {isProcessing && (
                      <Badge variant="secondary" className="animate-pulse text-xs">Processing...</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground hidden lg:block" />
                  <ArrowDown className="h-6 w-6 text-muted-foreground lg:hidden" />
                </div>

                {/* Step 2: Customer ID */}
                <div className="flex flex-col items-center space-y-3 min-w-[140px]">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    selectedCustomerId ? 'bg-green-500' : isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-muted'
                  }`}>
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">Customer ID</div>
                    <div className="text-xs text-muted-foreground">Database Lookup</div>
                  </div>
                  <div className="h-6 flex items-center">
                    {selectedCustomerId && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        {customers.find(c => c.id === selectedCustomerId)?.name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground hidden lg:block" />
                  <ArrowDown className="h-6 w-6 text-muted-foreground lg:hidden" />
                </div>

                {/* Step 3: AI Processing */}
                <div className="flex flex-col items-center space-y-3 min-w-[140px]">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentQuery ? 'bg-purple-500' : isProcessing ? 'bg-purple-400 animate-pulse' : 'bg-muted'
                  }`}>
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">AI Processing</div>
                    <div className="text-xs text-muted-foreground">OpenRouter/Mistral</div>
                  </div>
                  <div className="h-6 flex items-center">
                    {currentQuery && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                        Response Ready
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground hidden lg:block" />
                  <ArrowDown className="h-6 w-6 text-muted-foreground lg:hidden" />
                </div>

                {/* Step 4: Voice Output */}
                <div className="flex flex-col items-center space-y-3 min-w-[140px]">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentQuery ? 'bg-green-500' : 'bg-muted'
                  }`}>
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">Voice Output</div>
                    <div className="text-xs text-muted-foreground">Text-to-Speech</div>
                  </div>
                  <div className="h-6 flex items-center">
                    {currentQuery && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Query Display */}
        {currentQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <AIRouter query={currentQuery} isProcessing={isProcessing} />
            <ResponseDisplay query={currentQuery} isProcessing={isProcessing} />
          </div>
        )}

        {/* Stats and History */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Queries Today</p>
                  <p className="text-2xl font-bold">{queries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">2.3s</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">DB Queries</p>
                  <p className="text-2xl font-bold">1.2k</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compact Voice Chatbot - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-72 bg-gradient-card shadow-elevated border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Mic className="h-4 w-4" />
              Voice Assistant
              {selectedCustomerId && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {customers.find(c => c.id === selectedCustomerId)?.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <VoiceRecorder 
              onQueryComplete={handleQueryComplete}
              onProcessingStart={handleProcessingStart}
              selectedCustomerId={selectedCustomerId}
              onCustomerSelected={handleCustomerSelected}
            />
            
            {/* Demo Customer Helper */}
            {!selectedCustomerId && (
              <div className="mt-4 p-3 bg-muted/50 rounded text-xs">
                <div className="font-medium mb-2">Try saying:</div>
                <div className="space-y-1 text-muted-foreground">
                  <div>• "My name is Sarah"</div>
                  <div>• "I'm John"</div>
                  <div>• "Phone ends in 5678"</div>
                </div>
              </div>
            )}

            {/* Reset Customer Button */}
            {selectedCustomerId && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCustomerId(null)}
                  className="w-full text-xs"
                >
                  Reset Customer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;