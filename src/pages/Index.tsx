import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { CustomerDatabase } from "@/components/CustomerDatabase";
import { AIRouter } from "@/components/AIRouter";
import { ResponseDisplay } from "@/components/ResponseDisplay";
import { QueryHistory } from "@/components/QueryHistory";
import { Phone, Bot, Database, Zap } from "lucide-react";

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

  const handleQueryComplete = (query: Query) => {
    setCurrentQuery(query);
    setQueries(prev => [query, ...prev]);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              AI Call Center Agent
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Autonomous customer service with intelligent routing, database integration, and instant responses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Input & Current Query */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card shadow-elevated border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Voice Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceRecorder 
                  onQueryComplete={handleQueryComplete}
                  onProcessingStart={handleProcessingStart}
                />
              </CardContent>
            </Card>

            {currentQuery && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AIRouter query={currentQuery} isProcessing={isProcessing} />
                <ResponseDisplay query={currentQuery} isProcessing={isProcessing} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CustomerDatabase />
            <QueryHistory queries={queries.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;