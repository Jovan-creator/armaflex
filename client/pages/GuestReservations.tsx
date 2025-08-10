import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CreditCard,
  Download,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Phone,
  Mail,
  QrCode,
  Share,
} from "lucide-react";

// Mock data
const mockReservations = [
  {
    id: "ARM-2024-001",
    confirmationCode: "ARM123456",
    status: "checked-in",
    room: {
      number: "201",
      type: "Deluxe Suite",
      floor: 2,
      view: "City View",
      amenities: ["King Bed", "Balcony", "Mini Bar", "Free WiFi", "Room Service"],
    },
    dates: {
      checkIn: "2024-01-15T15:00:00",
      checkOut: "2024-01-18T11:00:00",
      nights: 3,
    },
    guests: {
      adults: 2,
      children: 0,
      names: ["Sarah Johnson", "Michael Johnson"],
    },
    payment: {
      total: 847.50,
      paid: 847.50,
      pending: 0,
      method: "Credit Card",
      status: "paid",
    },
    services: [
      { name: "Airport Pickup", date: "2024-01-15", status: "completed", amount: 50.00 },
      { name: "Spa Treatment", date: "2024-01-16", status: "confirmed", amount: 150.00 },
    ],
    specialRequests: "Late check-out requested, celebrating anniversary",
  },
  {
    id: "ARM-2024-045",
    confirmationCode: "ARM789012",
    status: "upcoming",
    room: {
      number: "305",
      type: "Presidential Suite",
      floor: 3,
      view: "Ocean View",
      amenities: ["King Bed", "Living Room", "Jacuzzi", "Butler Service", "Free WiFi"],
    },
    dates: {
      checkIn: "2024-03-15T15:00:00",
      checkOut: "2024-03-20T11:00:00",
      nights: 5,
    },
    guests: {
      adults: 2,
      children: 1,
      names: ["Sarah Johnson", "Michael Johnson", "Emma Johnson"],
    },
    payment: {
      total: 2250.00,
      paid: 450.00,
      pending: 1800.00,
      method: "Credit Card",
      status: "partial",
    },
    services: [],
    specialRequests: "Crib needed for child, vegetarian meals preferred",
  },
];

const mockPastReservations = [
  {
    id: "ARM-2023-234",
    confirmationCode: "ARM345678",
    status: "completed",
    room: {
      number: "102",
      type: "Standard Room",
      floor: 1,
      view: "Garden View",
    },
    dates: {
      checkIn: "2023-12-20T15:00:00",
      checkOut: "2023-12-23T11:00:00",
      nights: 3,
    },
    guests: {
      adults: 2,
      children: 0,
    },
    payment: {
      total: 675.00,
      paid: 675.00,
      status: "paid",
    },
    rating: 5,
    review: "Excellent stay! The staff was incredibly helpful and the room was spotless.",
  },
];

export default function GuestReservations() {
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <Badge className="bg-green-100 text-green-800">Checked In</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateStayProgress = (checkIn: string, checkOut: string) => {
    const now = new Date();
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Reservations</h1>
        <p className="text-gray-600">Manage your current and upcoming stays</p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current & Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Stays</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {mockReservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-hotel-50 to-hotel-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{reservation.room.type} - Room {reservation.room.number}</span>
                      {getStatusBadge(reservation.status)}
                    </CardTitle>
                    <CardDescription>
                      Confirmation: {reservation.confirmationCode}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${reservation.payment.total}</div>
                    <div className="text-sm text-gray-600">{reservation.dates.nights} nights</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Stay Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Check-in</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reservation.dates.checkIn).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">After 3:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reservation.dates.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">Before 11:00 AM</p>
                    </div>
                  </div>
                </div>

                {/* Stay Progress (only for checked-in) */}
                {reservation.status === 'checked-in' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Stay Progress</span>
                      <span className="text-sm text-gray-600">
                        {calculateStayProgress(reservation.dates.checkIn, reservation.dates.checkOut)}%
                      </span>
                    </div>
                    <Progress 
                      value={calculateStayProgress(reservation.dates.checkIn, reservation.dates.checkOut)} 
                      className="h-2"
                    />
                  </div>
                )}

                <Separator />

                {/* Room Details */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Room Details</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Room Type</p>
                      <p className="font-medium">{reservation.room.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">View</p>
                      <p className="font-medium">{reservation.room.view}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Floor</p>
                      <p className="font-medium">Floor {reservation.room.floor}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Guests</p>
                      <p className="font-medium">{reservation.guests.adults} Adults, {reservation.guests.children} Children</p>
                    </div>
                  </div>
                  
                  {reservation.room.amenities && (
                    <div className="mt-3">
                      <p className="text-gray-600 text-sm mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {reservation.room.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Payment Information */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Information</span>
                    {getPaymentStatusBadge(reservation.payment.status)}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="font-medium">${reservation.payment.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Paid</p>
                      <p className="font-medium text-green-600">${reservation.payment.paid}</p>
                    </div>
                    {reservation.payment.pending > 0 && (
                      <div>
                        <p className="text-gray-600">Remaining</p>
                        <p className="font-medium text-red-600">${reservation.payment.pending}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Method</p>
                      <p className="font-medium">{reservation.payment.method}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                {reservation.services.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Additional Services</h4>
                      <div className="space-y-2">
                        {reservation.services.map((service, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-600">{new Date(service.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${service.amount}</p>
                              <Badge variant={service.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                {service.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Special Requests */}
                {reservation.specialRequests && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Special Requests</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {reservation.specialRequests}
                      </p>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reservation QR Code</DialogTitle>
                      </DialogHeader>
                      <div className="text-center py-8">
                        <div className="w-48 h-48 bg-gray-100 mx-auto rounded-lg flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-gray-400" />
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                          Show this QR code at check-in
                        </p>
                        <p className="text-xs text-gray-500">
                          Confirmation: {reservation.confirmationCode}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>

                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>

                  {reservation.status === 'upcoming' && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Modify
                    </Button>
                  )}

                  {reservation.payment.pending > 0 && (
                    <Button size="sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Remaining
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {mockPastReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{reservation.room.type} - Room {reservation.room.number}</span>
                      {getStatusBadge(reservation.status)}
                    </CardTitle>
                    <CardDescription>
                      {new Date(reservation.dates.checkIn).toLocaleDateString()} - {new Date(reservation.dates.checkOut).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">${reservation.payment.total}</div>
                    {reservation.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < reservation.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {reservation.review && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">"{reservation.review}"</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Again
                  </Button>
                  {!reservation.review && (
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-2" />
                      Write Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
