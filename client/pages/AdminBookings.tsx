import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  CalendarDays, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Types for bookings
interface Booking {
  id: string;
  booking_reference: string;
  booking_type: 'room' | 'dining' | 'event' | 'facility' | 'package';
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  special_requests?: string;
  internal_notes?: string;
  
  // Guest information
  guests: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
  };
  
  // Service-specific information
  check_in_date?: string;
  check_out_date?: string;
  adults?: number;
  children?: number;
  
  dining_date?: string;
  dining_time?: string;
  party_size?: number;
  dining_venues?: { name: string };
  
  event_date?: string;
  event_start_time?: string;
  event_end_time?: string;
  event_type?: string;
  attendees?: number;
  event_spaces?: { name: string };
  
  service_date?: string;
  service_time?: string;
  facility_services?: { name: string };
  
  rooms?: { 
    room_number: string;
    room_types: { name: string };
  };
  
  payments?: Array<{
    id: string;
    payment_method: string;
    provider: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  checked_in: 'bg-green-100 text-green-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-gray-100 text-gray-800'
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  partial: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800'
};

const bookingTypeIcons = {
  room: '🏨',
  dining: '🍽️',
  event: '📅',
  facility: '🏊',
  package: '📦'
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    payment_status: '',
    internal_notes: ''
  });
  
  const { toast } = useToast();

  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          guests (*),
          rooms (room_number, room_types (name)),
          dining_venues (name),
          event_spaces (name),
          facility_services (name),
          payments (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBookings(data || []);
      setFilteredBookings(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search and filter criteria
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guests.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guests.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guests.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guests.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(booking => booking.booking_type === filterType);
    }

    // Payment status filter
    if (filterPaymentStatus !== 'all') {
      filtered = filtered.filter(booking => booking.payment_status === filterPaymentStatus);
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = booking.check_in_date || booking.dining_date || 
                           booking.event_date || booking.service_date;
        return bookingDate && bookingDate.startsWith(selectedDate);
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, filterStatus, filterType, filterPaymentStatus, selectedDate]);

  // Update booking status
  const updateBookingStatus = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: updateData.status || selectedBooking.status,
          payment_status: updateData.payment_status || selectedBooking.payment_status,
          internal_notes: updateData.internal_notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking updated successfully"
      });

      setIsUpdateOpen(false);
      fetchBookings(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      });
      console.error('Error updating booking:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'UGX') => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get service details based on booking type
  const getServiceDetails = (booking: Booking) => {
    switch (booking.booking_type) {
      case 'room':
        return {
          title: `${booking.rooms?.room_types?.name} - Room ${booking.rooms?.room_number}`,
          details: `${booking.adults} adult(s), ${booking.children} children`,
          dates: booking.check_in_date && booking.check_out_date 
            ? `${format(parseISO(booking.check_in_date), 'MMM dd')} - ${format(parseISO(booking.check_out_date), 'MMM dd')}`
            : 'N/A'
        };
      case 'dining':
        return {
          title: booking.dining_venues?.name || 'Dining Reservation',
          details: `${booking.party_size} guest(s)`,
          dates: booking.dining_date && booking.dining_time
            ? `${format(parseISO(booking.dining_date), 'MMM dd, yyyy')} at ${booking.dining_time}`
            : 'N/A'
        };
      case 'event':
        return {
          title: booking.event_spaces?.name || 'Event Booking',
          details: `${booking.event_type} - ${booking.attendees} attendees`,
          dates: booking.event_date && booking.event_start_time
            ? `${format(parseISO(booking.event_date), 'MMM dd, yyyy')} at ${booking.event_start_time}`
            : 'N/A'
        };
      case 'facility':
        return {
          title: booking.facility_services?.name || 'Facility Booking',
          details: 'Service booking',
          dates: booking.service_date && booking.service_time
            ? `${format(parseISO(booking.service_date), 'MMM dd, yyyy')} at ${booking.service_time}`
            : 'N/A'
        };
      default:
        return {
          title: 'Unknown Service',
          details: '',
          dates: 'N/A'
        };
    }
  };

  // Statistics calculations
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + b.total_amount, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">Manage all hotel bookings and reservations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Notifications
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.revenue)}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Service Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="room">Accommodation</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="facility">Facilities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Payment</Label>
              <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterType('all');
                  setFilterPaymentStatus('all');
                  setSelectedDate('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const serviceDetails = getServiceDetails(booking);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.booking_reference}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.guests.first_name} {booking.guests.last_name}</p>
                          <p className="text-sm text-gray-500">{booking.guests.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{bookingTypeIcons[booking.booking_type]}</span>
                          <span className="capitalize">{booking.booking_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{serviceDetails.title}</p>
                          <p className="text-xs text-gray-500">{serviceDetails.details}</p>
                          <p className="text-xs text-gray-500">{serviceDetails.dates}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(booking.total_amount, booking.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={paymentStatusColors[booking.payment_status]}>
                          {booking.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(parseISO(booking.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setUpdateData({
                                status: booking.status,
                                payment_status: booking.payment_status,
                                internal_notes: booking.internal_notes || ''
                              });
                              setIsUpdateOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information for booking {selectedBooking?.booking_reference}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              {/* Guest Information */}
              <div>
                <h4 className="font-semibold mb-2">Guest Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Name</Label>
                    <p>{selectedBooking.guests.first_name} {selectedBooking.guests.last_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{selectedBooking.guests.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{selectedBooking.guests.phone}</p>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <p>{selectedBooking.guests.country}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h4 className="font-semibold mb-2">Service Details</h4>
                <div className="bg-gray-50 p-3 rounded">
                  {getServiceDetails(selectedBooking).title}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Total Amount</Label>
                    <p>{formatCurrency(selectedBooking.total_amount, selectedBooking.currency)}</p>
                  </div>
                  <div>
                    <Label>Payment Status</Label>
                    <Badge className={paymentStatusColors[selectedBooking.payment_status]}>
                      {selectedBooking.payment_status}
                    </Badge>
                  </div>
                </div>
                
                {selectedBooking.payments && selectedBooking.payments.length > 0 && (
                  <div className="mt-3">
                    <Label>Payment History</Label>
                    <div className="space-y-2 mt-1">
                      {selectedBooking.payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <span>{payment.payment_method} - {payment.provider}</span>
                          <span>{formatCurrency(payment.amount)} - {payment.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              {selectedBooking.special_requests && (
                <div>
                  <Label>Special Requests</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedBooking.special_requests}</p>
                </div>
              )}

              {/* Internal Notes */}
              {selectedBooking.internal_notes && (
                <div>
                  <Label>Internal Notes</Label>
                  <p className="text-sm bg-yellow-50 p-3 rounded mt-1">{selectedBooking.internal_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Booking Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking</DialogTitle>
            <DialogDescription>
              Update status and add notes for booking {selectedBooking?.booking_reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Booking Status</Label>
              <Select value={updateData.status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Payment Status</Label>
              <Select value={updateData.payment_status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, payment_status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Internal Notes</Label>
              <Textarea
                value={updateData.internal_notes}
                onChange={(e) => setUpdateData(prev => ({ ...prev, internal_notes: e.target.value }))}
                placeholder="Add internal notes..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateBookingStatus}>
                Update Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
