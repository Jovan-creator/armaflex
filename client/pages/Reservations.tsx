import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const reservations = [
    {
      id: "RES-001",
      confirmationCode: "AC7B2F",
      guest: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 123-4567",
        avatar: "/placeholder.svg",
      },
      room: {
        number: "201",
        type: "Deluxe Suite",
      },
      dates: {
        checkIn: "2024-01-15",
        checkOut: "2024-01-20",
        nights: 5,
      },
      guests: {
        adults: 2,
        children: 1,
      },
      amount: {
        total: 1250,
        paid: 1250,
        balance: 0,
      },
      status: "confirmed",
      bookedDate: "2024-01-10",
      source: "website",
      specialRequests: "Late check-in, high floor",
    },
    {
      id: "RES-002",
      confirmationCode: "BD8C3G",
      guest: {
        name: "Michael Chen",
        email: "m.chen@email.com",
        phone: "+1 (555) 987-6543",
        avatar: "/placeholder.svg",
      },
      room: {
        number: "105",
        type: "Standard Room",
      },
      dates: {
        checkIn: "2024-01-16",
        checkOut: "2024-01-18",
        nights: 2,
      },
      guests: {
        adults: 1,
        children: 0,
      },
      amount: {
        total: 300,
        paid: 150,
        balance: 150,
      },
      status: "pending",
      bookedDate: "2024-01-12",
      source: "phone",
      specialRequests: "",
    },
    {
      id: "RES-003",
      confirmationCode: "CE9D4H",
      guest: {
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "+1 (555) 456-7890",
        avatar: "/placeholder.svg",
      },
      room: {
        number: "401",
        type: "Presidential Suite",
      },
      dates: {
        checkIn: "2024-01-20",
        checkOut: "2024-01-25",
        nights: 5,
      },
      guests: {
        adults: 2,
        children: 0,
      },
      amount: {
        total: 4000,
        paid: 2000,
        balance: 2000,
      },
      status: "confirmed",
      bookedDate: "2024-01-08",
      source: "booking.com",
      specialRequests: "Airport transfer, champagne service",
    },
    {
      id: "RES-004",
      confirmationCode: "DF0E5I",
      guest: {
        name: "Robert Wilson",
        email: "r.wilson@email.com",
        phone: "+1 (555) 321-9876",
        avatar: "/placeholder.svg",
      },
      room: {
        number: "305",
        type: "Family Suite",
      },
      dates: {
        checkIn: "2024-01-14",
        checkOut: "2024-01-16",
        nights: 2,
      },
      guests: {
        adults: 2,
        children: 2,
      },
      amount: {
        total: 600,
        paid: 600,
        balance: 0,
      },
      status: "checked-in",
      bookedDate: "2024-01-05",
      source: "website",
      specialRequests: "Crib requested",
    },
    {
      id: "RES-005",
      confirmationCode: "EG1F6J",
      guest: {
        name: "Maria Garcia",
        email: "maria.g@email.com",
        phone: "+1 (555) 654-3210",
        avatar: "/placeholder.svg",
      },
      room: {
        number: "102",
        type: "Standard Room",
      },
      dates: {
        checkIn: "2024-01-18",
        checkOut: "2024-01-22",
        nights: 4,
      },
      guests: {
        adults: 1,
        children: 0,
      },
      amount: {
        total: 600,
        paid: 0,
        balance: 600,
      },
      status: "cancelled",
      bookedDate: "2024-01-13",
      source: "expedia",
      specialRequests: "",
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
        };
      case "checked-in":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Users,
        };
      case "checked-out":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircle,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = 
      reservation.guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.room.number.includes(searchTerm) ||
      reservation.guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    const matchesTab = activeTab === "all" || reservation.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const reservationStats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === "confirmed").length,
    pending: reservations.filter(r => r.status === "pending").length,
    checkedIn: reservations.filter(r => r.status === "checked-in").length,
    cancelled: reservations.filter(r => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">Manage bookings, check-ins, and guest information</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-hotel-500 hover:bg-hotel-600">
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{reservationStats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{reservationStats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{reservationStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Checked In</p>
                <p className="text-2xl font-bold text-blue-600">{reservationStats.checkedIn}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{reservationStats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reservations, guests, confirmation codes..."
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Reservations</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="checked-in">Checked In</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Confirmation</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => {
                  const statusConfig = getStatusConfig(reservation.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={reservation.guest.avatar} />
                            <AvatarFallback>
                              {reservation.guest.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{reservation.guest.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span>{reservation.guest.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm font-medium">
                          {reservation.confirmationCode}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Booked: {new Date(reservation.bookedDate).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">Room {reservation.room.number}</p>
                          <p className="text-sm text-muted-foreground">{reservation.room.type}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(reservation.dates.checkIn).toLocaleDateString()} -
                            {new Date(reservation.dates.checkOut).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reservation.dates.nights} nights
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{reservation.guests.adults} adults</p>
                          {reservation.guests.children > 0 && (
                            <p className="text-muted-foreground">{reservation.guests.children} children</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">${reservation.amount.total}</p>
                          {reservation.amount.balance > 0 && (
                            <p className="text-xs text-red-600">
                              Balance: ${reservation.amount.balance}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig.color} variant="outline">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {reservation.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
