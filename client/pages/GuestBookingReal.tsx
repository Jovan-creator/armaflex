import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import StripePayment, { PaymentSuccess } from "@/components/StripePayment";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Check,
  AlertCircle,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Utensils,
  Tv,
  Wind,
  Bath,
  Bed,
} from "lucide-react";

interface Room {
  id: number;
  room_number: string;
  room_type_name: string;
  base_price: number;
  max_occupancy: number;
  amenities?: string;
}

interface Guest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  id_number: string;
}

export default function GuestBookingReal() {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Search, 2: Select Room, 3: Guest Info, 4: Payment, 5: Confirmation

  // Guest information
  const [guest, setGuest] = useState<Guest>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    id_number: "",
  });

  const [specialRequests, setSpecialRequests] = useState("");
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState('');

  // Search for available rooms
  const searchRooms = async () => {
    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates");
      return;
    }

    if (checkInDate >= checkOutDate) {
      setError("Check-out date must be after check-in date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const checkIn = format(checkInDate, "yyyy-MM-dd");
      const checkOut = format(checkOutDate, "yyyy-MM-dd");

      const response = await fetch(
        `/api/hotel/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`,
      );

      if (!response.ok) {
        throw new Error("Failed to search rooms");
      }

      const rooms = await response.json();
      setAvailableRooms(rooms);

      if (rooms.length === 0) {
        setError("No rooms available for the selected dates");
      } else {
        setStep(2);
      }
    } catch (err) {
      setError("Failed to search for available rooms. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total nights and price
  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !selectedRoom) return 0;

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return nights * selectedRoom.base_price;
  };

  // Submit booking
  const submitBooking = async () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) return;

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        guest,
        reservation: {
          room_id: selectedRoom.id,
          check_in_date: format(checkInDate, "yyyy-MM-dd"),
          check_out_date: format(checkOutDate, "yyyy-MM-dd"),
          adults,
          children,
          total_amount: calculateTotal(),
          special_requests: specialRequests,
        },
      };

      const response = await fetch("/api/hotel/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const result = await response.json();
      setReservationId(result.reservation_id);
      setStep(4); // Proceed to payment step
    } catch (err) {
      setError("Failed to create booking. Please try again.");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentIntentId(paymentIntentId);
    setSuccess(`Payment successful! Reservation confirmed.`);
    setStep(5); // Proceed to final confirmation
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setError(error);
  };

  // Amenity icons mapping
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "free wifi":
        return <Wifi className="w-4 h-4" />;
      case "air conditioning":
        return <Wind className="w-4 h-4" />;
      case "tv":
        return <Tv className="w-4 h-4" />;
      case "mini bar":
        return <Coffee className="w-4 h-4" />;
      case "mini fridge":
        return <Coffee className="w-4 h-4" />;
      case "balcony":
        return <MapPin className="w-4 h-4" />;
      case "living area":
        return <Bed className="w-4 h-4" />;
      case "jacuzzi":
        return <Bath className="w-4 h-4" />;
      case "butler service":
        return <Users className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Book Your Stay
        </h1>
        <p className="text-gray-600">
          Experience luxury and comfort at Armaflex Hotel
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num
                    ? "bg-hotel-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 5 && (
                <div
                  className={`w-12 h-0.5 ${step > num ? "bg-hotel-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: Search */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Available Rooms</CardTitle>
            <CardDescription>
              Select your dates and number of guests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Check-in Date */}
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate
                        ? format(checkOutDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      disabled={(date) => date <= (checkInDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Adults */}
              <div className="space-y-2">
                <Label>Adults</Label>
                <Select
                  value={adults.toString()}
                  onValueChange={(value) => setAdults(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Adult{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Children */}
              <div className="space-y-2">
                <Label>Children</Label>
                <Select
                  value={children.toString()}
                  onValueChange={(value) => setChildren(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Child{num > 1 ? "ren" : num === 1 ? "" : "ren"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={searchRooms} disabled={loading} className="w-full">
              {loading ? "Searching..." : "Search Available Rooms"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Room */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Available Rooms</h2>
            <Button variant="outline" onClick={() => setStep(1)}>
              Change Dates
            </Button>
          </div>

          <div className="grid gap-6">
            {availableRooms.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer transition-all ${
                  selectedRoom?.id === room.id
                    ? "ring-2 ring-hotel-500 border-hotel-500"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {room.room_type_name}
                      </h3>
                      <p className="text-gray-600">Room {room.room_number}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-hotel-600">
                        ${room.base_price}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      Up to {room.max_occupancy} guests
                    </Badge>
                  </div>

                  {room.amenities && (
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(room.amenities).map(
                        (amenity: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-1 text-sm text-gray-600"
                          >
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedRoom && (
            <div className="flex justify-end">
              <Button onClick={() => setStep(3)}>
                Continue with {selectedRoom.room_type_name}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Guest Information */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
            <CardDescription>
              Please provide your details for the reservation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={guest.first_name}
                  onChange={(e) =>
                    setGuest({ ...guest, first_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={guest.last_name}
                  onChange={(e) =>
                    setGuest({ ...guest, last_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={guest.email}
                  onChange={(e) =>
                    setGuest({ ...guest, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={guest.phone}
                  onChange={(e) =>
                    setGuest({ ...guest, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={guest.address}
                onChange={(e) =>
                  setGuest({ ...guest, address: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                value={guest.id_number}
                onChange={(e) =>
                  setGuest({ ...guest, id_number: e.target.value })
                }
                placeholder="Passport or ID number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requests">Special Requests (Optional)</Label>
              <Textarea
                id="requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or preferences..."
                rows={3}
              />
            </div>

            {/* Booking Summary */}
            {selectedRoom && checkInDate && checkOutDate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Room:</span>
                    <span>
                      {selectedRoom.room_type_name} (#{selectedRoom.room_number}
                      )
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{format(checkInDate, "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{format(checkOutDate, "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span>
                      {adults} adult{adults > 1 ? "s" : ""}
                      {children > 0
                        ? `, ${children} child${children > 1 ? "ren" : ""}`
                        : ""}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Rooms
              </Button>
              <Button onClick={submitBooking} disabled={loading}>
                {loading ? "Creating Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Payment */}
      {step === 4 && selectedRoom && reservationId && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Complete Your Payment</h2>
            <p className="text-gray-600">Secure payment to confirm your reservation</p>
          </div>

          {/* Booking Summary */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Room:</span>
                  <span>{selectedRoom.room_type_name} (#{selectedRoom.room_number})</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{checkInDate && format(checkInDate, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{checkOutDate && format(checkOutDate, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{adults} adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <StripePayment
            amount={calculateTotal()}
            currency="USD"
            reservationId={reservationId}
            guestName={`${guest.first_name} ${guest.last_name}`}
            description={`Hotel reservation - Room ${selectedRoom.room_number}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />

          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back to Guest Info
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Final Confirmation */}
      {step === 5 && (
        <div className="space-y-6">
          {paymentIntentId && (
            <PaymentSuccess
              paymentIntentId={paymentIntentId}
              amount={calculateTotal()}
              currency="USD"
            />
          )}

          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                Booking Confirmed!
              </CardTitle>
              <CardDescription>
                Thank you for choosing Armaflex Hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {reservationId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Reservation Number</p>
                  <p className="text-xl font-bold">#{reservationId}</p>
                </div>
              )}
              <p className="text-gray-600">
                A confirmation email with your booking details and receipt has been sent to {guest.email}
              </p>
              <Button onClick={() => window.location.reload()} className="w-full">
                Make Another Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
