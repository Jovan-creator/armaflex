import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  DollarSign,
  FileText,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Receipt,
  Wallet,
  Banknote,
  Smartphone,
  Calendar,
  Users,
  Repeat,
  PieChart,
} from "lucide-react";

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  const billingStats = [
    {
      title: "Total Revenue",
      value: "$127,450",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month",
    },
    {
      title: "Pending Payments",
      value: "$8,920",
      change: "-3.2%",
      trend: "down",
      icon: Clock,
      description: "Outstanding",
    },
    {
      title: "Invoices Sent",
      value: "245",
      change: "+8.1%",
      trend: "up",
      icon: FileText,
      description: "This month",
    },
    {
      title: "Payment Success Rate",
      value: "98.5%",
      change: "+0.8%",
      trend: "up",
      icon: CheckCircle,
      description: "Success rate",
    },
  ];

  const invoices = [
    {
      id: "INV-2024-001",
      guest: "Sarah Johnson",
      room: "Deluxe Suite 201",
      amount: 1250.00,
      tax: 125.00,
      total: 1375.00,
      status: "paid",
      paymentMethod: "Credit Card",
      date: "2024-01-15",
      dueDate: "2024-01-20",
      items: [
        { description: "Room Charges (5 nights)", amount: 1000.00, quantity: 5, rate: 200.00 },
        { description: "Breakfast Service", amount: 150.00, quantity: 5, rate: 30.00 },
        { description: "Spa Services", amount: 100.00, quantity: 1, rate: 100.00 },
      ],
    },
    {
      id: "INV-2024-002",
      guest: "Michael Chen",
      room: "Standard Room 105",
      amount: 600.00,
      tax: 60.00,
      total: 660.00,
      status: "pending",
      paymentMethod: null,
      date: "2024-01-16",
      dueDate: "2024-01-21",
      items: [
        { description: "Room Charges (2 nights)", amount: 300.00, quantity: 2, rate: 150.00 },
        { description: "Room Service", amount: 150.00, quantity: 3, rate: 50.00 },
        { description: "Minibar", amount: 150.00, quantity: 1, rate: 150.00 },
      ],
    },
    {
      id: "INV-2024-003",
      guest: "Emily Davis",
      room: "Presidential Suite",
      amount: 4000.00,
      tax: 400.00,
      total: 4400.00,
      status: "overdue",
      paymentMethod: null,
      date: "2024-01-10",
      dueDate: "2024-01-15",
      items: [
        { description: "Suite Charges (5 nights)", amount: 3000.00, quantity: 5, rate: 600.00 },
        { description: "Butler Service", amount: 500.00, quantity: 5, rate: 100.00 },
        { description: "Champagne & Amenities", amount: 500.00, quantity: 1, rate: 500.00 },
      ],
    },
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      type: "payment",
      guest: "Sarah Johnson",
      amount: 1375.00,
      method: "Visa **** 4321",
      status: "completed",
      timestamp: "2024-01-15 14:30",
    },
    {
      id: "TXN-002",
      type: "refund",
      guest: "Robert Wilson",
      amount: -450.00,
      method: "Visa **** 1234",
      status: "completed",
      timestamp: "2024-01-15 12:15",
    },
    {
      id: "TXN-003",
      type: "payment",
      guest: "Maria Garcia",
      amount: 890.00,
      method: "Mastercard **** 5678",
      status: "pending",
      timestamp: "2024-01-15 10:45",
    },
  ];

  const paymentMethods = [
    { name: "Credit Cards", percentage: 65, icon: CreditCard, color: "bg-blue-500" },
    { name: "Cash", percentage: 20, icon: Banknote, color: "bg-green-500" },
    { name: "Mobile Pay", percentage: 10, icon: Smartphone, color: "bg-purple-500" },
    { name: "Bank Transfer", percentage: 5, icon: Wallet, color: "bg-orange-500" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "refund":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-blue-500" />;
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.room.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage invoices, payments, and financial transactions</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Invoice</DialogTitle>
                <DialogDescription>Create a new invoice for guest services and charges</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guest">Guest Name</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="michael">Michael Chen</SelectItem>
                        <SelectItem value="emily">Emily Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="201">Deluxe Suite 201</SelectItem>
                        <SelectItem value="105">Standard Room 105</SelectItem>
                        <SelectItem value="401">Presidential Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>
                <Button className="bg-hotel-500 hover:bg-hotel-600">
                  Generate Invoice
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Process Payment</DialogTitle>
                <DialogDescription>Record a new payment transaction</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="invoice">Invoice</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inv-001">INV-2024-001 - Sarah Johnson</SelectItem>
                      <SelectItem value="inv-002">INV-2024-002 - Michael Chen</SelectItem>
                      <SelectItem value="inv-003">INV-2024-003 - Emily Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mobile">Mobile Payment</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-hotel-500 hover:bg-hotel-600">
                  Process Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {billingStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices, guests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="font-mono text-sm font-medium">{invoice.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {invoice.guest.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{invoice.guest}</span>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.room}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">${invoice.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              Tax: ${invoice.tax.toFixed(2)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)} variant="outline">
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={new Date(invoice.dueDate) < new Date() && invoice.status !== "paid" ? "text-red-600" : ""}>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment activities and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.guest}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{transaction.method}</span>
                          <span>•</span>
                          <span>{transaction.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <Badge
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Payment Methods</span>
                </CardTitle>
                <CardDescription>Breakdown by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <method.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{method.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{method.percentage}%</span>
                      </div>
                      <Progress value={method.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>January 2024</span>
                    <span className="font-medium">$127,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>December 2023</span>
                    <span className="font-medium">$113,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>November 2023</span>
                    <span className="font-medium">$98,750</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Growth Rate</span>
                      <span className="text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment processing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <Input id="tax" type="number" placeholder="10.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Payment Terms (days)</Label>
                  <Input id="terms" type="number" placeholder="30" />
                </div>
                <Button className="bg-hotel-500 hover:bg-hotel-600">
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Connect with external payment processors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">Payment processing</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-6 w-6" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">Digital wallet</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Receipt className="h-6 w-6" />
                    <div>
                      <p className="font-medium">QuickBooks</p>
                      <p className="text-sm text-muted-foreground">Accounting integration</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
