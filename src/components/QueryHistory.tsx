import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MessageCircle } from "lucide-react";
import { Query } from "@/pages/Index";

interface QueryHistoryProps {
  queries: Query[];
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const getRouteColor = (route: string) => {
  const colors = {
    billing: "bg-blue-500",
    technical: "bg-green-500",
    account: "bg-purple-500",
    cancellation: "bg-orange-500"
  };
  return colors[route as keyof typeof colors] || "bg-gray-500";
};

export const QueryHistory = ({ queries }: QueryHistoryProps) => {
  if (queries.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Queries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No queries yet. Start by recording a voice query above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Queries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {queries.map((query) => (
              <div
                key={query.id}
                className="p-3 rounded-lg bg-background/50 border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(query.timestamp)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getRouteColor(query.route)}`}></div>
                    <Badge variant="secondary" className="text-xs">
                      {query.route}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm font-medium line-clamp-2">
                  {query.transcript}
                </p>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {query.response}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {Math.round(query.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};