import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Route, CheckCircle, Clock } from "lucide-react";
import { Query } from "@/pages/Index";

interface AIRouterProps {
  query: Query;
  isProcessing: boolean;
}

const routeConfig = {
  billing: {
    name: "Billing Agent",
    color: "bg-blue-500",
    description: "Handles billing inquiries, payment issues, and account charges"
  },
  technical: {
    name: "Technical Support",
    color: "bg-green-500", 
    description: "Resolves connectivity, device, and service technical issues"
  },
  account: {
    name: "Account Management",
    color: "bg-purple-500",
    description: "Manages account settings, profile updates, and access issues"
  },
  cancellation: {
    name: "Retention Specialist",
    color: "bg-orange-500",
    description: "Handles cancellation requests and retention offers"
  }
};

export const AIRouter = ({ query, isProcessing }: AIRouterProps) => {
  const routeInfo = routeConfig[query.route as keyof typeof routeConfig] || {
    name: "General Support",
    color: "bg-gray-500",
    description: "Handles general inquiries and routing"
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          AI Router
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query Analysis */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Query Analysis</span>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            "{query.transcript}"
          </div>
        </div>

        {/* Routing Decision */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {isProcessing ? (
              <Clock className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 text-accent" />
            )}
            <span className="text-sm font-medium">
              {isProcessing ? "Analyzing..." : "Route Determined"}
            </span>
          </div>

          {!isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${routeInfo.color}`}></div>
                  <span className="font-medium">{routeInfo.name}</span>
                </div>
                <Badge variant="secondary">
                  {Math.round(query.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <Progress value={query.confidence * 100} className="h-2" />
              
              <p className="text-xs text-muted-foreground">
                {routeInfo.description}
              </p>
            </div>
          )}
        </div>

        {/* Processing Steps */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Processing Pipeline</span>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-accent" />
              <span>Speech-to-text completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-accent" />
              <span>Intent classification completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {isProcessing ? (
                <Clock className="h-3 w-3 text-muted-foreground animate-spin" />
              ) : (
                <CheckCircle className="h-3 w-3 text-accent" />
              )}
              <span>Database query {isProcessing ? "in progress" : "completed"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {isProcessing ? (
                <Clock className="h-3 w-3 text-muted-foreground animate-spin" />
              ) : (
                <CheckCircle className="h-3 w-3 text-accent" />
              )}
              <span>Response generation {isProcessing ? "in progress" : "completed"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};