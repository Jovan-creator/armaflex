import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import {
  Calendar as CalendarIcon,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  LogIn,
  LogOut,
  Clock,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  MessageSquare,
  CreditCard,
  RefreshCw
} from "lucide-react";

interface Reservation {
  id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  room_number: string;
  room_type_name: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  special_requests?: string;
  created_at: string;
  created_by?: string;
}

export default function ReservationsAdmin() {
  const { user } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState<Date>();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || '';
  };

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/hotel/reservations', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError('Failed to load reservations');
      console.error('Fetch reservations error:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchReservations();
      setLoading(false);
    };

    loadData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update reservation status
  const updateReservationStatus = async (reservationId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/hotel/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }

      setSuccess(`Reservation ${newStatus} successfully`);
      fetchReservations();
      setShowCheckIn(false);
      setShowCheckOut(false);
      setShowDetails(false);
    } catch (err) {
      setError('Failed to update reservation status');
      console.error('Update status error:', err);
    }
  };

  // Cancel reservation
  const cancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`/api/hotel/reservations/${reservationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      setSuccess('Reservation cancelled successfully');
      fetchReservations();
    } catch (err) {
      setError('Failed to cancel reservation');
      console.error('Cancel reservation error:', err);
    }
  };

  // Filter reservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesDate = !filterDate || 
                       new Date(reservation.check_in_date).toDateString() === filterDate.toDateString() ||
                       new Date(reservation.check_out_date).toDateString() === filterDate.toDateString();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'checked_out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'checked_in': return <CheckIn className="w-3 h-3" />;
      case 'checked_out': return <CheckOut className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  // Format date display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  // Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Get today's reservations
  const todaysCheckIns = reservations.filter(r => 
    isToday(new Date(r.check_in_date)) && r.status === 'confirmed'
  );
  const todaysCheckOuts = reservations.filter(r => 
    isToday(new Date(r.check_out_date)) && r.status === 'checked_in'
  );

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
        <div className="text-lg">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservation Management</h1>
          <p className="text-muted-foreground">Manage hotel reservations and guest check-ins</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchReservations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckIn className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{todaysCheckIns.length}</p>
                <p className="text-sm text-muted-foreground">Check-ins Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckOut className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{todaysCheckOuts.length}</p>
                <p className="text-sm text-muted-foreground">Check-outs Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{reservations.filter(r => r.status === 'checked_in').length}</p>
                <p className="text-sm text-muted-foreground">Current Guests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{reservations.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reservations ({filteredReservations.length})</TabsTrigger>
          <TabsTrigger value="checkins">Today's Check-ins ({todaysCheckIns.length})</TabsTrigger>
          <TabsTrigger value="checkouts">Today's Check-outs ({todaysCheckOuts.length})</TabsTrigger>
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
                      placeholder="Search by guest name, email, or room..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="checked_in">Checked In</SelectItem>
                    <SelectItem value="checked_out">Checked Out</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDate ? format(filterDate, "PPP") : "Filter by date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filterDate}
                      onSelect={setFilterDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {filterDate && (
                  <Button variant="ghost" onClick={() => setFilterDate(undefined)}>
                    Clear Date
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reservations List */}
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {reservation.guest_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{reservation.guest_name}</h3>
                        <p className="text-sm text-muted-foreground">{reservation.guest_email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">Room {reservation.room_number}</p>
                        <p className="text-sm text-muted-foreground">{reservation.room_type_name}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatDateDisplay(reservation.check_in_date)} - {formatDateDisplay(reservation.check_out_date)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {calculateNights(reservation.check_in_date, reservation.check_out_date)} nights
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">${reservation.total_amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.adults} adult{reservation.adults > 1 ? 's' : ''}
                          {reservation.children > 0 && `, ${reservation.children} child${reservation.children > 1 ? 'ren' : ''}`}
                        </p>
                      </div>
                      
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusIcon(reservation.status)}
                        <span className="ml-1 capitalize">{reservation.status.replace('_', ' ')}</span>
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {reservation.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowCheckIn(true);
                            }}
                          >
                            <CheckIn className="h-4 w-4 mr-1" />
                            Check In
                          </Button>
                        )}
                        
                        {reservation.status === 'checked_in' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowCheckOut(true);
                            }}
                          >
                            <CheckOut className="h-4 w-4 mr-1" />
                            Check Out
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReservations.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No reservations found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="checkins" className="space-y-4">
          <div className="space-y-4">
            {todaysCheckIns.map((reservation) => (
              <Card key={reservation.id} className="border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {reservation.guest_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{reservation.guest_name}</h3>
                        <p className="text-sm text-muted-foreground">{reservation.guest_email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">Room {reservation.room_number}</p>
                        <p className="text-sm text-muted-foreground">{reservation.room_type_name}</p>
                      </div>
                      
                      <Button
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowCheckIn(true);
                        }}
                      >
                        <CheckIn className="h-4 w-4 mr-2" />
                        Check In
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {todaysCheckIns.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No check-ins scheduled for today.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="checkouts" className="space-y-4">
          <div className="space-y-4">
            {todaysCheckOuts.map((reservation) => (
              <Card key={reservation.id} className="border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {reservation.guest_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{reservation.guest_name}</h3>
                        <p className="text-sm text-muted-foreground">{reservation.guest_email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">Room {reservation.room_number}</p>
                        <p className="text-sm text-muted-foreground">{reservation.room_type_name}</p>
                      </div>
                      
                      <Button
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowCheckOut(true);
                        }}
                      >
                        <CheckOut className="h-4 w-4 mr-2" />
                        Check Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {todaysCheckOuts.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No check-outs scheduled for today.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reservation Details Dialog */}
      {selectedReservation && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reservation Details</DialogTitle>
              <DialogDescription>Reservation #{selectedReservation.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Guest Information */}
              <div>
                <h4 className="font-semibold mb-3">Guest Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Name</Label>
                    <p>{selectedReservation.guest_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{selectedReservation.guest_email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{selectedReservation.guest_phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedReservation.status)}>
                      {selectedReservation.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stay Information */}
              <div>
                <h4 className="font-semibold mb-3">Stay Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Room</Label>
                    <p>Room {selectedReservation.room_number} ({selectedReservation.room_type_name})</p>
                  </div>
                  <div>
                    <Label>Dates</Label>
                    <p>{format(new Date(selectedReservation.check_in_date), 'PPP')} - {format(new Date(selectedReservation.check_out_date), 'PPP')}</p>
                  </div>
                  <div>
                    <Label>Guests</Label>
                    <p>{selectedReservation.adults} adult{selectedReservation.adults > 1 ? 's' : ''}{selectedReservation.children > 0 && `, ${selectedReservation.children} child${selectedReservation.children > 1 ? 'ren' : ''}`}</p>
                  </div>
                  <div>
                    <Label>Total Amount</Label>
                    <p className="font-semibold">${selectedReservation.total_amount}</p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedReservation.special_requests && (
                <div>
                  <h4 className="font-semibold mb-3">Special Requests</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedReservation.special_requests}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                {selectedReservation.status === 'pending' && (
                  <>
                    <Button variant="outline" onClick={() => updateReservationStatus(selectedReservation.id, 'confirmed')}>
                      Confirm
                    </Button>
                    <Button variant="destructive" onClick={() => cancelReservation(selectedReservation.id)}>
                      Cancel
                    </Button>
                  </>
                )}
                {selectedReservation.status === 'confirmed' && (
                  <Button onClick={() => {
                    setShowDetails(false);
                    setShowCheckIn(true);
                  }}>
                    <CheckIn className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                )}
                {selectedReservation.status === 'checked_in' && (
                  <Button onClick={() => {
                    setShowDetails(false);
                    setShowCheckOut(true);
                  }}>
                    <CheckOut className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Check-in Dialog */}
      {selectedReservation && (
        <Dialog open={showCheckIn} onOpenChange={setShowCheckIn}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check In Guest</DialogTitle>
              <DialogDescription>
                Checking in {selectedReservation.guest_name} to Room {selectedReservation.room_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>Are you sure you want to check in this guest?</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCheckIn(false)}>Cancel</Button>
                <Button onClick={() => updateReservationStatus(selectedReservation.id, 'checked_in')}>
                  Confirm Check In
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Check-out Dialog */}
      {selectedReservation && (
        <Dialog open={showCheckOut} onOpenChange={setShowCheckOut}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Check Out Guest</DialogTitle>
              <DialogDescription>
                Checking out {selectedReservation.guest_name} from Room {selectedReservation.room_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>Are you sure you want to check out this guest?</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCheckOut(false)}>Cancel</Button>
                <Button onClick={() => updateReservationStatus(selectedReservation.id, 'checked_out')}>
                  Confirm Check Out
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
