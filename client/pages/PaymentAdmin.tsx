import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { format } from "date-fns";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  RefreshCw,
  Download,
  Eye,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Plus,
  Receipt,
  Banknote,
  Calendar
} from "lucide-react";

interface Payment {
  id: number;
  reservation_id: number;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  card_last4?: string;
  card_brand?: string;
  description?: string;
  guest_name: string;
  guest_email: string;
  room_number: string;
  created_at: string;
  updated_at: string;
}

interface PaymentStats {
  totalRevenue: number;
  todayRevenue: number;
  pendingPayments: number;
  successfulPayments: number;
  failedPayments: number;
  refundedAmount: number;
}

export default function PaymentAdmin() {
  const { user } = useUser();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Refund form state
  const [refundForm, setRefundForm] = useState({
    amount: '',
    reason: ''
  });

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || '';
  };

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/hotel/payments', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError('Failed to load payments');
      console.error('Fetch payments error:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPayments();
      setLoading(false);
    };

    loadData();
  }, []);

  // Process refund
  const processRefund = async () => {
    if (!selectedPayment) return;

    try {
      const response = await fetch(`/api/hotel/payments/${selectedPayment.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          amount: refundForm.amount ? parseFloat(refundForm.amount) : undefined,
          reason: refundForm.reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      setSuccess('Refund processed successfully');
      setShowRefundDialog(false);
      setRefundForm({ amount: '', reason: '' });
      fetchPayments();
    } catch (err) {
      setError('Failed to process refund');
      console.error('Refund error:', err);
    }
  };

  // Calculate payment statistics
  const calculateStats = (): PaymentStats => {
    const today = new Date().toDateString();
    
    return {
      totalRevenue: payments
        .filter(p => p.status === 'succeeded')
        .reduce((sum, p) => sum + p.amount, 0),
      todayRevenue: payments
        .filter(p => p.status === 'succeeded' && new Date(p.created_at).toDateString() === today)
        .reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      successfulPayments: payments.filter(p => p.status === 'succeeded').length,
      failedPayments: payments.filter(p => p.status === 'failed').length,
      refundedAmount: payments
        .filter(p => p.status === 'refunded')
        .reduce((sum, p) => sum + p.amount, 0),
    };
  };

  const stats = calculateStats();

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.stripe_payment_intent_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'processing': return <RefreshCw className="w-3 h-3" />;
      case 'failed': return <X className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      case 'refunded': return <RotateCcw className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  // Get card brand icon/text
  const getCardBrand = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return '💳 Visa';
      case 'mastercard': return '💳 Mastercard';
      case 'amex': return '💳 American Express';
      case 'discover': return '💳 Discover';
      default: return '💳 Card';
    }
  };

  // Open refund dialog
  const openRefundDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundForm({ amount: payment.amount.toString(), reason: '' });
    setShowRefundDialog(true);
  };

  // Clear alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage hotel payments and refunds</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchPayments}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</p>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.successfulPayments}</p>
                <p className="text-sm text-muted-foreground">Successful Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.refundedAmount)}</p>
                <p className="text-sm text-muted-foreground">Refunded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments ({filteredPayments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({payments.filter(p => p.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="successful">Successful ({stats.successfulPayments})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({stats.failedPayments})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by guest, email, room, or payment ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="succeeded">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>Recent payment activity and transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{payment.guest_name}</h4>
                        <p className="text-sm text-muted-foreground">{payment.guest_email}</p>
                        <p className="text-sm text-muted-foreground">Room {payment.room_number}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(payment.amount, payment.currency)}</p>
                        {payment.card_last4 && (
                          <p className="text-sm text-muted-foreground">
                            {getCardBrand(payment.card_brand || '')} •••• {payment.card_last4}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(payment.created_at), 'MMM d, yyyy')}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(payment.created_at), 'h:mm a')}</p>
                      </div>
                      
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {payment.status === 'succeeded' && (user?.role === 'admin' || user?.role === 'accountant') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openRefundDialog(payment)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPayments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No payments found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs can show filtered data */}
        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Pending payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="successful">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Successful payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Failed payments will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Details Dialog */}
      {selectedPayment && (
        <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>Payment #{selectedPayment.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Payment Information */}
              <div>
                <h4 className="font-semibold mb-3">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Amount</Label>
                    <p className="font-semibold">{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedPayment.status)}>
                      {selectedPayment.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <p>{selectedPayment.payment_method || 'Card'}</p>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <p className="font-mono text-xs">{selectedPayment.stripe_payment_intent_id}</p>
                  </div>
                  {selectedPayment.card_last4 && (
                    <>
                      <div>
                        <Label>Card</Label>
                        <p>{getCardBrand(selectedPayment.card_brand || '')} •••• {selectedPayment.card_last4}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <Label>Date</Label>
                    <p>{format(new Date(selectedPayment.created_at), 'PPP')}</p>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div>
                <h4 className="font-semibold mb-3">Guest Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Name</Label>
                    <p>{selectedPayment.guest_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{selectedPayment.guest_email}</p>
                  </div>
                  <div>
                    <Label>Room</Label>
                    <p>Room {selectedPayment.room_number}</p>
                  </div>
                  <div>
                    <Label>Reservation</Label>
                    <p>#{selectedPayment.reservation_id}</p>
                  </div>
                </div>
              </div>

              {selectedPayment.description && (
                <div>
                  <h4 className="font-semibold mb-3">Description</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedPayment.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Refund Dialog */}
      {selectedPayment && (
        <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Refund</DialogTitle>
              <DialogDescription>
                Refund for {selectedPayment.guest_name} - {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refundAmount">Refund Amount</Label>
                <Input
                  id="refundAmount"
                  type="number"
                  step="0.01"
                  max={selectedPayment.amount}
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({...refundForm, amount: e.target.value})}
                  placeholder="Enter refund amount"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum: {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refundReason">Reason for Refund</Label>
                <Textarea
                  id="refundReason"
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({...refundForm, reason: e.target.value})}
                  placeholder="Explain the reason for this refund..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRefundDialog(false)}>Cancel</Button>
              <Button onClick={processRefund} disabled={!refundForm.reason.trim()}>
                Process Refund
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
