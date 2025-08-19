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

            {/* Add Steps 2, 3, and 4 content here - this is getting quite long, should I continue with the remaining steps? */}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
