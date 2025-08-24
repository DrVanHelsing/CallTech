import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, User, CreditCard } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  plan: string;
}

interface CustomerIdentificationProps {
  onCustomerSelected: (customerId: string) => void;
  customers: Customer[];
}

export const CustomerIdentification = ({ onCustomerSelected, customers }: CustomerIdentificationProps) => {
  const [identificationMethod, setIdentificationMethod] = useState<"phone" | "account" | "select">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const handlePhoneNumberSubmit = async () => {
    try {
      // Call the phone lookup API
      const response = await fetch(`http://localhost:3001/api/customers/lookup/phone/${phoneNumber}`);
      
      if (response.ok) {
        const customer = await response.json();
        onCustomerSelected(customer.id);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Customer not found' }));
        alert(`Customer not found: ${errorData.message || 'Please check your phone number or try another method.'}`);
      }
    } catch (error) {
      console.error('Phone lookup error:', error);
      alert('Error looking up customer. Please try again or use another method.');
    }
  };

  const handleAccountNumberSubmit = () => {
    // In a real system, this would lookup the customer by account number
    // For demo, we'll use the account number as customer ID
    const customer = customers.find(c => c.id.includes(accountNumber));
    if (customer) {
      onCustomerSelected(customer.id);
    } else {
      alert("Account not found. Please check your account number.");
    }
  };

  const handleCustomerSelect = () => {
    if (selectedCustomerId) {
      onCustomerSelected(selectedCustomerId);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" />
          Customer Identification
        </CardTitle>
        <p className="text-sm text-gray-600">Please identify yourself to access your account</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={identificationMethod === "phone" ? "default" : "outline"}
            size="sm"
            onClick={() => setIdentificationMethod("phone")}
            className="flex items-center gap-1"
          >
            <Phone className="h-4 w-4" />
            Phone
          </Button>
          <Button
            variant={identificationMethod === "account" ? "default" : "outline"}
            size="sm"
            onClick={() => setIdentificationMethod("account")}
            className="flex items-center gap-1"
          >
            <CreditCard className="h-4 w-4" />
            Account
          </Button>
          <Button
            variant={identificationMethod === "select" ? "default" : "outline"}
            size="sm"
            onClick={() => setIdentificationMethod("select")}
            className="flex items-center gap-1"
          >
            <User className="h-4 w-4" />
            Select
          </Button>
        </div>

        {identificationMethod === "phone" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handlePhoneNumberSubmit} 
              className="w-full"
              disabled={!phoneNumber.trim()}
            >
              Verify Phone Number
            </Button>
          </div>
        )}

        {identificationMethod === "account" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="account">Account Number</Label>
              <Input
                id="account"
                type="text"
                placeholder="CUST-2024-001"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleAccountNumberSubmit} 
              className="w-full"
              disabled={!accountNumber.trim()}
            >
              Verify Account
            </Button>
          </div>
        )}

        {identificationMethod === "select" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="customer-select">Select Customer (Demo)</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose your account" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleCustomerSelect} 
              className="w-full"
              disabled={!selectedCustomerId}
            >
              Access Account
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p><strong>Demo Phone Numbers:</strong></p>
          <p>• 5678 for Sarah Johnson</p>
          <p>• 1234 for John Doe</p>
          <p>• 9876 for Maria Rodriguez</p>
        </div>
      </CardContent>
    </Card>
  );
};
