import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Star,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Award,
  Percent,
  Gift,
  ArrowRight,
  CalendarDays,
  BedDouble,
  AlertCircle,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  maxGuests: number;
  size: string;
  amenities: string[];
  features: { icon: any; name: string }[];
  available: boolean;
}

interface BookingFormData {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomId: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    specialRequests: string;
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    billingAddress: string;
  };
}

const sampleRooms: Room[] = [
  {
    id: "1",
    name: "Standard Room",
    price: 150,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Comfortable and elegant accommodation with modern amenities",
    maxGuests: 2,
    size: "25 sqm",
    amenities: ["Free WiFi", "Air conditioning", "Mini refrigerator", "Work desk", "Daily housekeeping"],
    features: [
      { icon: Wifi, name: "Free WiFi" },
      { icon: Coffee, name: "Coffee Maker" },
      { icon: Shield, name: "Safe" },
      { icon: Phone, name: "Phone" },
    ],
    available: true,
  },
  {
    id: "2",
    name: "Deluxe Suite",
    price: 250,
    originalPrice: 300,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Spacious suite with stunning views and luxury amenities",
    maxGuests: 3,
    size: "45 sqm",
    amenities: ["Separate living area", "Ocean view balcony", "Premium bathroom", "Welcome champagne", "Priority service"],
    features: [
      { icon: Wifi, name: "Premium WiFi" },
      { icon: Coffee, name: "Espresso Machine" },
      { icon: Car, name: "Valet Parking" },
      { icon: Utensils, name: "Room Service" },
    ],
    available: true,
  },
  {
    id: "3",
    name: "Presidential Suite",
    price: 800,
    originalPrice: 950,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    description: "Ultimate luxury experience with exclusive services",
    maxGuests: 6,
    size: "120 sqm",
    amenities: ["2 separate bedrooms", "Private terrace", "Personal butler", "Jacuzzi", "Airport limousine"],
    features: [
      { icon: Wifi, name: "Premium WiFi" },
      { icon: Utensils, name: "Private Chef" },
      { icon: Car, name: "Limousine Service" },
      { icon: Award, name: "Butler Service" },
    ],
    available: true,
  },
];

export function GuestBooking() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    roomId: "",
    guestInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      specialRequests: "",
    },
    paymentInfo: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      billingAddress: "",
    },
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    const subtotal = selectedRoom.price * nights;
    const tax = subtotal * 0.1; // 10% tax
    return subtotal + tax;
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setBookingData(prev => ({ ...prev, roomId: room.id }));
    setIsBookingOpen(true);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const processPayment = async () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate confirmation number
    const confirmation = `ARM${Date.now().toString().slice(-6)}`;
    setConfirmationNumber(confirmation);
    setBookingComplete(true);
    setIsProcessingPayment(false);
  };

  const renderRoomCard = (room: Room) => (
    <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <Badge className="bg-hotel-500/90 backdrop-blur-sm mb-2">
            Save {Math.round((1 - room.price / room.originalPrice) * 100)}%
          </Badge>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${room.price}</span>
            <span className="text-lg line-through opacity-70">${room.originalPrice}</span>
            <span className="text-sm">/ night</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-hotel-400 text-hotel-400" />
          ))}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {room.name}
          <Badge variant="outline" className="text-xs">
            Up to {room.maxGuests} guests
          </Badge>
        </CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <BedDouble className="h-4 w-4" />
            <span>{room.size}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{room.maxGuests} guests max</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {room.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <feature.icon className="h-4 w-4 text-hotel-600" />
              <span>{feature.name}</span>
            </div>
          ))}
        </div>

        <Button 
          className="w-full bg-hotel-500 hover:bg-hotel-600 transform hover:scale-105 transition-all duration-200"
          onClick={() => handleRoomSelect(room)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Now
        </Button>
      </CardContent>
    </Card>
  );

  if (bookingComplete) {
    return (
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 py-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your reservation has been successfully processed</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Confirmation Number:</span>
                  <span className="font-mono font-bold text-green-700">{confirmationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room:</span>
                  <span>{selectedRoom?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dates:</span>
                  <span>{bookingData.checkIn} to {bookingData.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                A confirmation email has been sent to {bookingData.guestInfo.email} with your booking details.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button className="w-full bg-hotel-500 hover:bg-hotel-600">
                <Mail className="h-4 w-4 mr-2" />
                Email Confirmation
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsBookingOpen(false);
                  setBookingComplete(false);
                  setCurrentStep(1);
                  setSelectedRoom(null);
                }}
              >
                Book Another Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-8">
      {/* Room Selection */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sampleRooms.map(renderRoomCard)}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Book {selectedRoom?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Complete your reservation in {currentStep === 1 ? "3" : currentStep === 2 ? "2" : "1"} easy steps
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center space-x-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-hotel-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`text-sm ${step <= currentStep ? 'text-hotel-600' : 'text-gray-500'}`}>
                  {step === 1 ? 'Dates & Guests' : step === 2 ? 'Guest Info' : 'Payment'}
                </span>
                {step < 3 && <ArrowRight className="h-4 w-4 text-gray-400" />}
              </div>
            ))}
          </div>

          {/* Step 1: Dates and Guests */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkin">Check-in Date</Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={bookingData.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="checkout">Check-out Date</Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={bookingData.checkOut}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adults">Adults</Label>
                  <Select value={bookingData.adults.toString()} onValueChange={(value) => setBookingData(prev => ({ ...prev, adults: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} Adult{num > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="children">Children</Label>
                  <Select value={bookingData.children.toString()} onValueChange={(value) => setBookingData(prev => ({ ...prev, children: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Child' : 'Children'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedRoom && (
                <Card className="bg-hotel-50 border-hotel-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{selectedRoom.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {calculateNights()} nights • {bookingData.adults + bookingData.children} guests
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Total (incl. taxes)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                className="w-full bg-hotel-500 hover:bg-hotel-600"
                onClick={handleNextStep}
                disabled={!bookingData.checkIn || !bookingData.checkOut || calculateNights() === 0}
              >
                Continue to Guest Information
              </Button>
            </div>
          )}

          {/* Step 2: Guest Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={bookingData.guestInfo.firstName}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      guestInfo: { ...prev.guestInfo, firstName: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={bookingData.guestInfo.lastName}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      guestInfo: { ...prev.guestInfo, lastName: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.guestInfo.email}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      guestInfo: { ...prev.guestInfo, email: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingData.guestInfo.phone}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      guestInfo: { ...prev.guestInfo, phone: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={bookingData.guestInfo.address}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    guestInfo: { ...prev.guestInfo, address: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={bookingData.guestInfo.city}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      guestInfo: { ...prev.guestInfo, city: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={bookingData.guestInfo.country}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      guestInfo: { ...prev.guestInfo, country: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="requests">Special Requests</Label>
                <Textarea
                  id="requests"
                  placeholder="Any special requirements or requests..."
                  value={bookingData.guestInfo.specialRequests}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    guestInfo: { ...prev.guestInfo, specialRequests: e.target.value }
                  }))}
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button 
                  className="flex-1 bg-hotel-500 hover:bg-hotel-600"
                  onClick={handleNextStep}
                  disabled={!bookingData.guestInfo.firstName || !bookingData.guestInfo.lastName || !bookingData.guestInfo.email}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  value={bookingData.paymentInfo.cardholderName}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    paymentInfo: { ...prev.paymentInfo, cardholderName: e.target.value }
                  }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={bookingData.paymentInfo.cardNumber}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    paymentInfo: { ...prev.paymentInfo, cardNumber: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={bookingData.paymentInfo.expiryDate}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      paymentInfo: { ...prev.paymentInfo, expiryDate: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={bookingData.paymentInfo.cvv}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      paymentInfo: { ...prev.paymentInfo, cvv: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>{selectedRoom?.name}</span>
                    <span>${selectedRoom?.price}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{calculateNights()} nights</span>
                    <span>${(selectedRoom?.price || 0) * calculateNights()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes & fees</span>
                    <span>${((selectedRoom?.price || 0) * calculateNights() * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and cancellation policy
                </Label>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button 
                  className="flex-1 bg-hotel-500 hover:bg-hotel-600"
                  onClick={processPayment}
                  disabled={isProcessingPayment || !bookingData.paymentInfo.cardNumber || !bookingData.paymentInfo.cardholderName}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Booking - ${calculateTotal().toFixed(2)}
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CreditCard className="h-3 w-3" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
