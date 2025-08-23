import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, User, CreditCard, Wifi } from "lucide-react";

const mockCustomer = {
  id: "CUST-2024-001",
  name: "Sarah Johnson",
  email: "sarah.j***@gmail.com",
  phone: "***-***-5678",
  plan: "Premium Internet + TV",
  status: "Active",
  balance: "$89.99",
  lastPayment: "Feb 15, 2024",
  joinDate: "Jan 2021",
  support: {
    tickets: 3,
    lastContact: "Feb 10, 2024",
    satisfaction: 4.5
  },
  billing: {
    currentBill: "$89.99",
    usage: "245GB / 500GB",
    nextDue: "Mar 15, 2024"
  }
};

export const CustomerDatabase = () => {
  return (
    <Card className="bg-gradient-card shadow-elevated border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Customer Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{mockCustomer.name}</span>
            <Badge variant="secondary" className="text-xs">
              {mockCustomer.status}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>ID: {mockCustomer.id}</p>
            <p>Email: {mockCustomer.email}</p>
            <p>Phone: {mockCustomer.phone}</p>
            <p>Customer since: {mockCustomer.joinDate}</p>
          </div>
        </div>

        {/* Plan & Billing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Billing Information</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 pl-6">
            <p>Plan: {mockCustomer.plan}</p>
            <p>Current Bill: {mockCustomer.billing.currentBill}</p>
            <p>Usage: {mockCustomer.billing.usage}</p>
            <p>Next Due: {mockCustomer.billing.nextDue}</p>
          </div>
        </div>

        {/* Support History */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Support History</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 pl-6">
            <p>Open Tickets: {mockCustomer.support.tickets}</p>
            <p>Last Contact: {mockCustomer.support.lastContact}</p>
            <p>Satisfaction: {mockCustomer.support.satisfaction}/5 ⭐</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Database queries: Real-time access to customer data for personalized responses
          </p>
        </div>
      </CardContent>
    </Card>
  );
};