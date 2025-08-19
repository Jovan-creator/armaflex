import React, { useState, useEffect } from 'react';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { CalendarDays, Users, Clock, MapPin, Phone, Mail, Wifi, Car, Utensils, Dumbbell, Waves, TreePine, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Types for different booking services
interface BookingData {
  serviceType: 'accommodation' | 'dining' | 'events' | 'spa' | 'facilities';
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    nationality: string;
  };
  // Accommodation specific
  roomType?: string;
  checkIn?: Date;
  checkOut?: Date;
  adults?: number;
  children?: number;
  // Dining specific
  diningVenue?: string;
  diningDate?: Date;
  diningTime?: string;
  partySize?: number;
  // Events specific
  eventSpace?: string;
  eventDate?: Date;
  eventStartTime?: string;
  eventEndTime?: string;
  eventType?: string;
  attendees?: number;
  // Spa/Facilities specific
  serviceName?: string;
  serviceDate?: Date;
  serviceTime?: string;
  // Common
  specialRequests?: string;
  totalAmount: number;
  currency: string;
}

// Service data based on Armaflex Hotel information
const serviceCategories = {
  accommodation: {
    title: 'Accommodation',
    icon: '🏨',
    description: 'Book your perfect stay with us',
    items: [
      {
        id: 'standard',
        name: 'Standard Room',
        description: 'Cozy accommodations ideal for solo travelers or couples',
        price: 180000,
        maxOccupancy: 2,
        amenities: ['AC', 'Private Bathroom', 'Balcony', 'City View', 'Satellite TV', 'WiFi', 'Refrigerator'],
        image: '/api/placeholder/400/250'
      },
      {
        id: 'twin',
        name: 'Twin Bedroom',
        description: 'Equipped with two single beds, suitable for friends or colleagues',
        price: 200000,
        maxOccupancy: 2,
        amenities: ['AC', 'Private Bathroom', 'Balcony', 'City View', 'Satellite TV', 'WiFi', 'Refrigerator'],
        image: '/api/placeholder/400/250'
      },
      {
        id: 'executive',
        name: 'Executive Room',
        description: 'Spacious rooms with extra space and upgraded amenities',
        price: 350000,
        maxOccupancy: 3,
        amenities: ['AC', 'Private Bathroom', 'Balcony', 'City View', 'Satellite TV', 'WiFi', 'Refrigerator', 'Work Desk', 'Minibar'],
        image: '/api/placeholder/400/250'
      },
      {
        id: 'deluxe',
        name: 'Deluxe Room',
        description: 'Luxurious rooms with plush bedding and elegant décor',
        price: 450000,
        maxOccupancy: 4,
        amenities: ['AC', 'Private Bathroom', 'Balcony', 'City View', 'Satellite TV', 'WiFi', 'Refrigerator', 'Living Area', 'Premium Bedding'],
        image: '/api/placeholder/400/250'
      }
    ]
  },
  dining: {
    title: 'Dining',
    icon: '🍽️',
    description: 'Experience our culinary excellence',
    items: [
      {
        id: 'fine_dining',
        name: 'Fine Dining Restaurant',
        description: 'Exquisite culinary journey with sophisticated ambiance',
        price: 75000,
        capacity: 80,
        openingHours: '18:00-23:00',
        cuisine: 'International & Local',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'casual_dining',
        name: 'Casual Dining',
        description: 'Relaxed venue for hearty meals throughout the day',
        price: 35000,
        capacity: 120,
        openingHours: '06:00-23:00',
        cuisine: 'Continental & Local',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'bar_lounge',
        name: 'Bar & Lounge',
        description: 'Stylish space with cocktails, wine, and light bites',
        price: 25000,
        capacity: 60,
        openingHours: '16:00-02:00',
        cuisine: 'Cocktails & Snacks',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'private_dining',
        name: 'Private Dining',
        description: 'Customized menus for special occasions and corporate events',
        price: 150000,
        capacity: 50,
        openingHours: 'By Appointment',
        cuisine: 'Customized Menu',
        image: '/api/placeholder/400/250'
      }
    ]
  },
  events: {
    title: 'Events & Meetings',
    icon: '📅',
    description: 'Perfect venues for your special occasions',
    items: [
      {
        id: 'conference_hall',
        name: 'Conference Hall',
        description: 'Large conference space with modern AV equipment',
        price: 300000,
        capacity: 200,
        area: 250,
        equipment: ['Projector', 'Sound System', 'Microphones', 'WiFi', 'AC'],
        image: '/api/placeholder/400/250'
      },
      {
        id: 'meeting_room',
        name: 'Meeting Room',
        description: 'Intimate meeting space for business discussions',
        price: 150000,
        capacity: 20,
        area: 50,
        equipment: ['TV Screen', 'Conference Phone', 'WiFi', 'AC'],
        image: '/api/placeholder/400/250'
      },
      {
        id: 'banquet_hall',
        name: 'Banquet Hall',
        description: 'Elegant space for weddings and celebrations',
        price: 500000,
        capacity: 300,
        area: 400,
        equipment: ['Stage', 'Sound System', 'Lighting', 'Dance Floor'],
        image: '/api/placeholder/400/250'
      },
      {
        id: 'outdoor_space',
        name: 'Outdoor Garden',
        description: 'Beautiful outdoor venue for ceremonies and receptions',
        price: 400000,
        capacity: 150,
        area: 300,
        equipment: ['Gazebo', 'Lighting', 'Garden Setting'],
        image: '/api/placeholder/400/250'
      }
    ]
  },
  spa: {
    title: 'Spa & Wellness',
    icon: '🧘',
    description: 'Rejuvenate your body and mind',
    items: [
      {
        id: 'massage',
        name: 'Therapeutic Massage',
        description: 'Professional massage therapy for relaxation',
        price: 80000,
        duration: 60,
        category: 'massage',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'spa_package',
        name: 'Full Spa Package',
        description: 'Complete wellness experience with multiple treatments',
        price: 200000,
        duration: 180,
        category: 'spa',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'sauna',
        name: 'Sauna Session',
        description: 'Relax in our traditional sauna facility',
        price: 35000,
        duration: 45,
        category: 'wellness',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'fitness',
        name: 'Personal Training',
        description: 'One-on-one fitness session with certified trainer',
        price: 60000,
        duration: 60,
        category: 'fitness',
        image: '/api/placeholder/400/250'
      }
    ]
  },
  facilities: {
    title: 'Facilities',
    icon: '🏊',
    description: 'Enjoy our premium facilities',
    items: [
      {
        id: 'pool',
        name: 'Swimming Pool Access',
        description: 'Day pass for our outdoor infinity pool',
        price: 25000,
        duration: 480, // 8 hours
        category: 'recreation',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'business_center',
        name: 'Business Center',
        description: 'Access to computers, printers, and meeting facilities',
        price: 15000,
        duration: 240, // 4 hours
        category: 'business',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'airport_transfer',
        name: 'Airport Transfer',
        description: 'Comfortable transportation to/from the airport',
        price: 50000,
        duration: 0,
        category: 'transport',
        image: '/api/placeholder/400/250'
      },
      {
        id: 'laundry',
        name: 'Laundry Service',
        description: 'Professional laundry and dry cleaning service',
        price: 20000,
        duration: 0,
        category: 'service',
        image: '/api/placeholder/400/250'
      }
    ]
  }
};

const countries = [
  'Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan', 'Democratic Republic of Congo',
  'Nigeria', 'Ghana', 'South Africa', 'Egypt', 'Morocco', 'United States', 'United Kingdom',
  'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Sweden', 'Other'
];

export default function PublicBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof serviceCategories>('accommodation');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceType: 'accommodation',
    guestInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: 'Uganda',
      city: '',
      nationality: ''
    },
    totalAmount: 0,
    currency: 'UGX'
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'bank_transfer'>('mobile_money');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate total amount based on selections
  useEffect(() => {
    if (selectedService) {
      let total = selectedService.price;
      
      if (selectedCategory === 'accommodation' && bookingData.checkIn && bookingData.checkOut) {
        const nights = Math.ceil((bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) / (1000 * 60 * 60 * 24));
        total = selectedService.price * Math.max(1, nights);
      }
      
      setBookingData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [selectedService, selectedCategory, bookingData.checkIn, bookingData.checkOut]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setBookingData(prev => ({
      ...prev,
      serviceType: selectedCategory,
      [selectedCategory === 'accommodation' ? 'roomType' : 
       selectedCategory === 'dining' ? 'diningVenue' :
       selectedCategory === 'events' ? 'eventSpace' :
       'serviceName']: service.id
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Here you would integrate with your booking API
      console.log('Booking Data:', bookingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Booking Successful!",
        description: `Your booking reference is ARM-${Date.now()}. Check your email for confirmation.`,
      });
      
      // Reset form or redirect
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Armaflex Hotel</h1>
                <p className="text-sm text-gray-500">Book Your Experience</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>+256 392004134</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>info@armaflexhotel.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center space-x-8 mb-8">
          {[
            { step: 1, title: 'Select Service', icon: '🏨' },
            { step: 2, title: 'Details', icon: '📝' },
            { step: 3, title: 'Guest Info', icon: '👤' },
            { step: 4, title: 'Payment', icon: '💳' }
          ].map((item) => (
            <div key={item.step} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
                currentStep >= item.step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > item.step ? '✓' : item.icon}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.title}
                </p>
              </div>
              {item.step < 4 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Service</h2>
                  <p className="text-gray-600">Select the type of experience you'd like to book</p>
                </div>

                <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as keyof typeof serviceCategories)}>
                  <TabsList className="grid w-full grid-cols-5">
                    {Object.entries(serviceCategories).map(([key, category]) => (
                      <TabsTrigger key={key} value={key} className="text-xs">
                        <span className="mr-1">{category.icon}</span>
                        {category.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(serviceCategories).map(([key, category]) => (
                    <TabsContent key={key} value={key} className="mt-6">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {category.items.map((item) => (
                          <Card 
                            key={item.id} 
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              selectedService?.id === item.id 
                                ? 'ring-2 ring-blue-500 bg-blue-50' 
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => handleServiceSelect(item)}
                          >
                            <CardContent className="p-6">
                              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                                📷 Image
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
                              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                              
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                  {formatCurrency(item.price)}
                                </span>
                                {key === 'accommodation' && (
                                  <Badge variant="secondary">
                                    Up to {item.maxOccupancy} guests
                                  </Badge>
                                )}
                                {(key === 'dining' || key === 'events') && (
                                  <Badge variant="secondary">
                                    Capacity: {item.capacity}
                                  </Badge>
                                )}
                                {(key === 'spa' || key === 'facilities') && item.duration && (
                                  <Badge variant="secondary">
                                    {item.duration} mins
                                  </Badge>
                                )}
                              </div>

                              {key === 'accommodation' && item.amenities && (
                                <div className="flex flex-wrap gap-1">
                                  {item.amenities.slice(0, 4).map((amenity) => (
                                    <Badge key={amenity} variant="outline" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {item.amenities.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.amenities.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {key === 'events' && item.equipment && (
                                <div className="flex flex-wrap gap-1">
                                  {item.equipment.slice(0, 3).map((eq) => (
                                    <Badge key={eq} variant="outline" className="text-xs">
                                      {eq}
                                    </Badge>
                                  ))}
                                  {item.equipment.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.equipment.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={handleNext} 
                    disabled={!selectedService}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Details
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && selectedService && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Details</h2>
                  <p className="text-gray-600">Provide specific details for your {selectedService.name} booking</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedService.name}</h3>
                      <p className="text-gray-600 text-sm">{selectedService.description}</p>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(selectedService.price)}
                    </span>
                  </div>
                </div>

                {/* Accommodation Details */}
                {selectedCategory === 'accommodation' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="checkin">Check-in Date</Label>
                      <Input
                        id="checkin"
                        type="date"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        value={bookingData.checkIn ? format(bookingData.checkIn, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          checkIn: e.target.value ? new Date(e.target.value) : undefined
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout">Check-out Date</Label>
                      <Input
                        id="checkout"
                        type="date"
                        min={bookingData.checkIn ? format(addDays(bookingData.checkIn, 1), 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                        value={bookingData.checkOut ? format(bookingData.checkOut, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          checkOut: e.target.value ? new Date(e.target.value) : undefined
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="adults">Adults</Label>
                      <Select value={bookingData.adults?.toString() || '1'} onValueChange={(value) => setBookingData(prev => ({ ...prev, adults: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: selectedService.maxOccupancy }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} Adult{i > 0 ? 's' : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="children">Children</Label>
                      <Select value={bookingData.children?.toString() || '0'} onValueChange={(value) => setBookingData(prev => ({ ...prev, children: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 4 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i} Child{i !== 1 ? 'ren' : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Dining Details */}
                {selectedCategory === 'dining' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="diningdate">Dining Date</Label>
                      <Input
                        id="diningdate"
                        type="date"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        value={bookingData.diningDate ? format(bookingData.diningDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          diningDate: e.target.value ? new Date(e.target.value) : undefined
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="diningtime">Preferred Time</Label>
                      <Select value={bookingData.diningTime || ''} onValueChange={(value) => setBookingData(prev => ({ ...prev, diningTime: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i < 10 ? `0${i}` : `${i}`;
                            return (
                              <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="partysize">Party Size</Label>
                      <Select value={bookingData.partySize?.toString() || '2'} onValueChange={(value) => setBookingData(prev => ({ ...prev, partySize: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: Math.min(selectedService.capacity, 20) }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} Guest{i > 0 ? 's' : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Events Details */}
                {selectedCategory === 'events' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="eventdate">Event Date</Label>
                      <Input
                        id="eventdate"
                        type="date"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        value={bookingData.eventDate ? format(bookingData.eventDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          eventDate: e.target.value ? new Date(e.target.value) : undefined
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventtype">Event Type</Label>
                      <Select value={bookingData.eventType || ''} onValueChange={(value) => setBookingData(prev => ({ ...prev, eventType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Business Meeting</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="birthday">Birthday Party</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="seminar">Seminar/Workshop</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="starttime">Start Time</Label>
                      <Input
                        id="starttime"
                        type="time"
                        value={bookingData.eventStartTime || ''}
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventStartTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endtime">End Time</Label>
                      <Input
                        id="endtime"
                        type="time"
                        value={bookingData.eventEndTime || ''}
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventEndTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attendees">Expected Attendees</Label>
                      <Select value={bookingData.attendees?.toString() || ''} onValueChange={(value) => setBookingData(prev => ({ ...prev, attendees: parseInt(value) }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of attendees" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: Math.min(selectedService.capacity / 10, 20) }, (_, i) => {
                            const count = (i + 1) * 10;
                            return (
                              <SelectItem key={count} value={count.toString()}>{count} People</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Spa & Facilities Details */}
                {(selectedCategory === 'spa' || selectedCategory === 'facilities') && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="servicedate">Service Date</Label>
                      <Input
                        id="servicedate"
                        type="date"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        value={bookingData.serviceDate ? format(bookingData.serviceDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          serviceDate: e.target.value ? new Date(e.target.value) : undefined
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="servicetime">Preferred Time</Label>
                      <Select value={bookingData.serviceTime || ''} onValueChange={(value) => setBookingData(prev => ({ ...prev, serviceTime: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const hour = i + 8; // Start from 8 AM
                            const time12 = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                            const time24 = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                            return (
                              <SelectItem key={time24} value={time24}>{time12}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    placeholder="Any special requirements or requests..."
                    value={bookingData.specialRequests || ''}
                    onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Total Amount Display */}
                {bookingData.totalAmount > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(bookingData.totalAmount)}
                      </span>
                    </div>
                    {selectedCategory === 'accommodation' && bookingData.checkIn && bookingData.checkOut && (
                      <p className="text-sm text-gray-600 mt-2">
                        {Math.ceil((bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) / (1000 * 60 * 60 * 24))} night(s) × {formatCurrency(selectedService.price)}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={
                      (selectedCategory === 'accommodation' && (!bookingData.checkIn || !bookingData.checkOut)) ||
                      (selectedCategory === 'dining' && (!bookingData.diningDate || !bookingData.diningTime)) ||
                      (selectedCategory === 'events' && (!bookingData.eventDate || !bookingData.eventStartTime)) ||
                      ((selectedCategory === 'spa' || selectedCategory === 'facilities') && (!bookingData.serviceDate || !bookingData.serviceTime))
                    }
                  >
                    Continue to Guest Info
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Guest Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest Information</h2>
                  <p className="text-gray-600">Please provide your contact details</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstname">First Name *</Label>
                    <Input
                      id="firstname"
                      value={bookingData.guestInfo.firstName}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        guestInfo: { ...prev.guestInfo, firstName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastname">Last Name *</Label>
                    <Input
                      id="lastname"
                      value={bookingData.guestInfo.lastName}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        guestInfo: { ...prev.guestInfo, lastName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
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
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+256 700 000 000"
                      value={bookingData.guestInfo.phone}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        guestInfo: { ...prev.guestInfo, phone: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={bookingData.guestInfo.country}
                      onValueChange={(value) => setBookingData(prev => ({
                        ...prev,
                        guestInfo: { ...prev.guestInfo, country: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  <div className="md:col-span-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={bookingData.guestInfo.nationality}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        guestInfo: { ...prev.guestInfo, nationality: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={
                      !bookingData.guestInfo.firstName ||
                      !bookingData.guestInfo.lastName ||
                      !bookingData.guestInfo.email ||
                      !bookingData.guestInfo.phone
                    }
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
                  <p className="text-gray-600">Choose your payment method and complete your booking</p>
                </div>

                {/* Booking Summary */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      {selectedCategory === 'accommodation' && bookingData.checkIn && bookingData.checkOut && (
                        <>
                          <div className="flex justify-between">
                            <span>Check-in:</span>
                            <span>{format(bookingData.checkIn, 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Check-out:</span>
                            <span>{format(bookingData.checkOut, 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Guests:</span>
                            <span>{bookingData.adults} adult(s), {bookingData.children} child(ren)</span>
                          </div>
                        </>
                      )}
                      {selectedCategory === 'dining' && (
                        <>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{bookingData.diningDate && format(bookingData.diningDate, 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span>{bookingData.diningTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Party Size:</span>
                            <span>{bookingData.partySize} guest(s)</span>
                          </div>
                        </>
                      )}
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-blue-600">{formatCurrency(bookingData.totalAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <div>
                  <Label className="text-base font-medium">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)} className="mt-3">
                    <div className="space-y-3">
                      <Card className={`cursor-pointer transition-colors ${paymentMethod === 'mobile_money' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="mobile_money" id="mobile_money" />
                            <Label htmlFor="mobile_money" className="flex items-center space-x-2 cursor-pointer">
                              <Smartphone className="h-5 w-5" />
                              <span>Mobile Money (MTN/Airtel)</span>
                            </Label>
                          </div>
                          {paymentMethod === 'mobile_money' && (
                            <div className="mt-3 pl-6">
                              <Input
                                placeholder="Enter your mobile money number"
                                className="mb-2"
                              />
                              <p className="text-xs text-gray-600">
                                You will receive a prompt on your phone to approve the payment
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className={`cursor-pointer transition-colors ${paymentMethod === 'card' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                              <CreditCard className="h-5 w-5" />
                              <span>Credit/Debit Card</span>
                            </Label>
                          </div>
                          {paymentMethod === 'card' && (
                            <div className="mt-3 pl-6 space-y-3">
                              <Input placeholder="Card Number" />
                              <div className="grid grid-cols-2 gap-3">
                                <Input placeholder="MM/YY" />
                                <Input placeholder="CVV" />
                              </div>
                              <Input placeholder="Cardholder Name" />
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className={`cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                            <Label htmlFor="bank_transfer" className="flex items-center space-x-2 cursor-pointer">
                              <span>🏦</span>
                              <span>Bank Transfer</span>
                            </Label>
                          </div>
                          {paymentMethod === 'bank_transfer' && (
                            <div className="mt-3 pl-6">
                              <Alert>
                                <AlertDescription>
                                  Bank details will be provided after booking confirmation
                                </AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </RadioGroup>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : `Pay ${formatCurrency(bookingData.totalAmount)}`}
                  </Button>
                </div>
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
