import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, User, CreditCard, Wifi, Loader, AlertTriangle } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  balance: string;
  lastPayment: string;
  joinDate: string;
  support: {
    tickets: number;
    lastContact: string;
    satisfaction: number;
  };
  billing: {
    currentBill: string;
    usage: string;
    nextDue: string;
  };
}

export const CustomerDatabase = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/customers/CUST-2024-001');
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  return (
    <Card className="bg-gradient-card shadow-elevated border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Customer Database
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center p-8 text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
        )}
        {customer && (
          <>
            {/* Customer Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{customer.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {customer.status}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>ID: {customer.id}</p>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
                <p>Customer since: {customer.joinDate}</p>
              </div>
            </div>

            {/* Plan & Billing */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Billing Information</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1 pl-6">
                <p>Plan: {customer.plan}</p>
                <p>Current Bill: {customer.billing.currentBill}</p>
                <p>Usage: {customer.billing.usage}</p>
                <p>Next Due: {customer.billing.nextDue}</p>
              </div>
            </div>

            {/* Support History */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Support History</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1 pl-6">
                <p>Open Tickets: {customer.support.tickets}</p>
                <p>Last Contact: {customer.support.lastContact}</p>
                <p>Satisfaction: {customer.support.satisfaction}/5 ⭐</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Database queries: Real-time access to customer data for personalized responses
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};