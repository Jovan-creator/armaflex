import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Thermometer,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Star,
  Phone,
  MessageSquare,
  Sun,
  Cloud,
  Wind,
  Eye,
  ChevronRight,
  Bell,
  Gift,
  Coffee,
  Newspaper,
  Camera,
} from "lucide-react";

// Mock data - in real app this would come from APIs
const mockReservation = {
  id: "ARM-2024-001",
  room: "Deluxe Suite 201",
  checkIn: "2024-01-15T15:00:00",
  checkOut: "2024-01-18T11:00:00",
  guests: 2,
  status: "checked-in",
  totalAmount: 847.50,
  remainingAmount: 0,
};

const mockWeather = {
  temperature: 72,
  condition: "Partly Cloudy",
  humidity: 65,
  wind: "8 mph",
  icon: Cloud,
};

const mockActivities = [
  {
    title: "Pool Opens",
    time: "6:00 AM",
    location: "Rooftop Pool",
    icon: Dumbbell,
  },
  {
    title: "Breakfast Service",
    time: "7:00 AM - 11:00 AM",
    location: "Armaflex Restaurant",
    icon: Utensils,
  },
  {
    title: "Spa Treatment",
    time: "2:00 PM",
    location: "Luxury Spa",
    icon: Star,
    booked: true,
  },
  {
    title: "Room Service Available",
    time: "24/7",
    location: "Your Room",
    icon: Coffee,
  },
];

const mockServices = [
  {
    title: "Room Service",
    description: "Order food to your room",
    icon: Utensils,
    href: "/guest/services?category=room-service",
    badge: "24/7",
  },
  {
    title: "Housekeeping",
    description: "Request cleaning service",
    icon: Clock,
    href: "/guest/services?category=housekeeping",
    badge: null,
  },
  {
    title: "Concierge",
    description: "Local recommendations",
    icon: MapPin,
    href: "/guest/concierge",
    badge: null,
  },
  {
    title: "Spa & Wellness",
    description: "Book spa treatments",
    icon: Star,
    href: "/guest/amenities?category=spa",
    badge: "Popular",
  },
  {
    title: "Transportation",
    description: "Airport shuttle & car service",
    icon: Car,
    href: "/guest/services?category=transport",
    badge: null,
  },
  {
    title: "Laundry",
    description: "Laundry and dry cleaning",
    icon: Clock,
    href: "/guest/services?category=laundry",
    badge: null,
  },
];

const mockHotelInfo = {
  wifi: {
    network: "ArmafleXGuest",
    password: "Welcome2024",
  },
  phone: "+1-555-ARMAFLEX",
  concierge: "+1-555-CONCIERGE",
  emergency: "911",
  checkout: "11:00 AM",
  checkin: "3:00 PM",
};

const mockNews = [
  {
    title: "New Rooftop Bar Opening",
    description: "Join us this Friday for the grand opening of our new rooftop bar with city views.",
    time: "2 hours ago",
    image: "/placeholder.svg",
  },
  {
    title: "Spa Weekend Special",
    description: "Enjoy 20% off all spa services this weekend. Book now to secure your slot.",
    time: "1 day ago",
    image: "/placeholder.svg",
  },
  {
    title: "Local Food Festival",
    description: "Don't miss the annual food festival happening just 2 blocks away this weekend.",
    time: "2 days ago",
    image: "/placeholder.svg",
  },
];

export default function GuestDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const checkInDate = new Date(mockReservation.checkIn);
  const checkOutDate = new Date(mockReservation.checkOut);
  const totalStayDays = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysCompleted = Math.ceil((currentTime.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const stayProgress = Math.min(Math.max((daysCompleted / totalStayDays) * 100, 0), 100);

  const WeatherIcon = mockWeather.icon;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-hotel-500 to-hotel-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Sarah!</h1>
            <p className="text-hotel-100">
              {currentTime.toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{mockReservation.room}</div>
            <div className="text-hotel-200">Suite 201</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Reservation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Current Stay</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{mockReservation.room}</p>
                  <p className="text-sm text-gray-600">Confirmation: {mockReservation.id}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {mockReservation.status === 'checked-in' ? 'Checked In' : 'Reserved'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Check-in</p>
                  <p className="font-medium">{checkInDate.toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{checkInDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div>
                  <p className="text-gray-600">Check-out</p>
                  <p className="font-medium">{checkOutDate.toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{checkOutDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Stay Progress</span>
                  <span className="text-sm font-medium">{Math.round(stayProgress)}%</span>
                </div>
                <Progress value={stayProgress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Day {Math.max(daysCompleted, 1)} of {totalStayDays}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button asChild size="sm" className="flex-1">
                  <Link to="/guest/reservations">View Details</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/guest/services">Request Service</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Services */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Services</CardTitle>
              <CardDescription>Access popular hotel services instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      key={service.title}
                      to={service.href}
                      className="flex flex-col items-center p-4 rounded-lg border hover:border-hotel-300 hover:bg-hotel-50 transition-colors group"
                    >
                      <div className="h-12 w-12 rounded-full bg-hotel-100 flex items-center justify-center mb-2 group-hover:bg-hotel-200 transition-colors">
                        <Icon className="h-6 w-6 text-hotel-600" />
                      </div>
                      <h4 className="text-sm font-medium text-center">{service.title}</h4>
                      <p className="text-xs text-gray-500 text-center">{service.description}</p>
                      {service.badge && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {service.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Today's Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.booked ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          activity.booked ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{activity.time}</p>
                        {activity.booked && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Booked
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>Local Weather</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <WeatherIcon className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold">{mockWeather.temperature}°F</div>
                <div className="text-gray-600 mb-4">{mockWeather.condition}</div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span>{mockWeather.humidity}% humidity</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span>{mockWeather.wind}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotel Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Hotel Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium flex items-center space-x-2">
                  <Wifi className="h-4 w-4" />
                  <span>WiFi Access</span>
                </h4>
                <p className="text-sm text-gray-600">Network: {mockHotelInfo.wifi.network}</p>
                <p className="text-sm text-gray-600">Password: {mockHotelInfo.wifi.password}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hotel Phone:</span>
                  <a href={`tel:${mockHotelInfo.phone}`} className="text-hotel-600 hover:underline">
                    {mockHotelInfo.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span>Concierge:</span>
                  <a href={`tel:${mockHotelInfo.concierge}`} className="text-hotel-600 hover:underline">
                    {mockHotelInfo.concierge}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span>Check-out Time:</span>
                  <span>{mockHotelInfo.checkout}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotel News */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5" />
                <span>Hotel News</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNews.map((item, index) => (
                <div key={index} className="border-b last:border-b-0 pb-3 last:pb-0">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Newspaper className="h-4 w-4 mr-2" />
                View All News
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Emergency Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
                onClick={() => window.open('tel:911', '_self')}
              >
                Emergency: 911
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(`tel:${mockHotelInfo.phone}`, '_self')}
              >
                Hotel Security: {mockHotelInfo.phone}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
