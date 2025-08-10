import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Eye,
  Calendar,
  DollarSign,
  Receipt,
  Utensils,
  Car,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Mail,
  Phone,
} from "lucide-react";

// Mock billing data
const mockBilling = {
  currentStay: {
    reservationId: "ARM-2024-001",
    room: "Deluxe Suite 201",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    nights: 3,
    baseAmount: 750.0,
    taxes: 97.5,
    total: 847.5,
    paid: 847.5,
    balance: 0,
    paymentMethod: "****1234",
  },
  charges: [
    {
      id: "CHG-001",
      date: "2024-01-15",
      time: "15:30",
      description: "Room Charge - Deluxe Suite 201",
      category: "accommodation",
      amount: 250.0,
      status: "posted",
    },
    {
      id: "CHG-002",
      date: "2024-01-15",
      time: "20:45",
      description: "Room Service - Dinner",
      category: "dining",
      amount: 65.5,
      status: "posted",
    },
    {
      id: "CHG-003",
      date: "2024-01-16",
      time: "08:30",
      description: "Room Service - Breakfast",
      category: "dining",
      amount: 25.0,
      status: "posted",
    },
    {
      id: "CHG-004",
      date: "2024-01-16",
      time: "14:20",
      description: "Spa Treatment - Massage",
      category: "spa",
      amount: 150.0,
      status: "posted",
    },
    {
      id: "CHG-005",
      date: "2024-01-16",
      time: "15:00",
      description: "Room Charge - Deluxe Suite 201",
      category: "accommodation",
      amount: 250.0,
      status: "pending",
    },
    {
      id: "CHG-006",
      date: "2024-01-16",
      time: "19:30",
      description: "Minibar - Beverages",
      category: "minibar",
      amount: 35.0,
      status: "pending",
    },
  ],
  receipts: [
    {
      id: "RCP-001",
      date: "2024-01-15",
      description: "Initial Payment",
      amount: 847.5,
      method: "Credit Card ****1234",
      status: "completed",
    },
  ],
  summary: {
    accommodation: 500.0,
    dining: 90.5,
    spa: 150.0,
    minibar: 35.0,
    other: 0,
  },
};

const categoryIcons = {
  accommodation: Calendar,
  dining: Utensils,
  spa: Star,
  minibar: CreditCard,
  transport: Car,
  other: Clock,
};

const categoryColors = {
  accommodation: "bg-blue-100 text-blue-800",
  dining: "bg-orange-100 text-orange-800",
  spa: "bg-purple-100 text-purple-800",
  minibar: "bg-green-100 text-green-800",
  transport: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800",
};

export default function GuestBilling() {
  const [selectedCharge, setSelectedCharge] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "posted":
        return <Badge className="bg-green-100 text-green-800">Posted</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "disputed":
        return <Badge className="bg-red-100 text-red-800">Disputed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryBadge = (category: string) => {
    const colorClass =
      categoryColors[category as keyof typeof categoryColors] ||
      categoryColors.other;
    return (
      <Badge className={colorClass}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bills & Payments</h1>
        <p className="text-gray-600">View your charges and payment history</p>
      </div>

      {/* Current Stay Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Current Stay Summary</span>
          </CardTitle>
          <CardDescription>
            {mockBilling.currentStay.room} • {mockBilling.currentStay.checkIn}{" "}
            to {mockBilling.currentStay.checkOut}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Room Charges ({mockBilling.currentStay.nights} nights)
                  </span>
                  <span>${mockBilling.currentStay.baseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>${mockBilling.currentStay.taxes}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>${mockBilling.currentStay.total}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid</span>
                  <span>${mockBilling.currentStay.paid}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Balance Due</span>
                  <span
                    className={
                      mockBilling.currentStay.balance > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    ${mockBilling.currentStay.balance}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Charges by Category</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(mockBilling.summary).map(
                    ([category, amount]) =>
                      amount > 0 && (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(category)}
                            <span className="capitalize">{category}</span>
                          </div>
                          <span>${amount}</span>
                        </div>
                      ),
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                {mockBilling.currentStay.balance > 0 && (
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Balance
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="charges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="charges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Charges</CardTitle>
              <CardDescription>
                All charges for your current stay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBilling.charges.map((charge) => (
                  <div
                    key={charge.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getCategoryIcon(charge.category)}
                      </div>
                      <div>
                        <h4 className="font-medium">{charge.description}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>
                            {new Date(charge.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{charge.time}</span>
                          <span>•</span>
                          {getCategoryBadge(charge.category)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold">${charge.amount}</div>
                        {getStatusBadge(charge.status)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCharge(charge)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All payments made for this reservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBilling.receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{receipt.description}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>
                            {new Date(receipt.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{receipt.method}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          ${receipt.amount}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {receipt.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Receipts</CardTitle>
              <CardDescription>Download or email your receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Receipt className="h-10 w-10 text-gray-600" />
                    <div>
                      <h4 className="font-medium">Hotel Invoice</h4>
                      <p className="text-sm text-gray-600">
                        Complete itemized bill
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Receipt className="h-10 w-10 text-gray-600" />
                    <div>
                      <h4 className="font-medium">Payment Receipt</h4>
                      <p className="text-sm text-gray-600">Proof of payment</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Charge Detail Dialog */}
      <Dialog
        open={selectedCharge !== null}
        onOpenChange={() => setSelectedCharge(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Charge Details</DialogTitle>
          </DialogHeader>

          {selectedCharge && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {selectedCharge.description}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2">
                      {new Date(selectedCharge.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2">{selectedCharge.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 capitalize">
                      {selectedCharge.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 capitalize">
                      {selectedCharge.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Amount:</span>
                <span className="text-xl font-bold">
                  ${selectedCharge.amount}
                </span>
              </div>

              <Separator />

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Dispute Charge
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Front Desk
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
