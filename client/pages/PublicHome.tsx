import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Hotel,
  Star,
  Calendar,
  Users,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Shield,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Quote,
} from "lucide-react";

export default function PublicHome() {
  const features = [
    {
      icon: Wifi,
      title: "Free WiFi",
      description: "High-speed internet throughout the property",
    },
    {
      icon: Car,
      title: "Valet Parking",
      description: "Complimentary parking with valet service",
    },
    {
      icon: Utensils,
      title: "Fine Dining",
      description: "Award-winning restaurant and 24/7 room service",
    },
    {
      icon: Dumbbell,
      title: "Fitness Center",
      description: "State-of-the-art gym and wellness facilities",
    },
    {
      icon: Shield,
      title: "Security",
      description: "24/7 security and concierge services",
    },
    {
      icon: Users,
      title: "Event Spaces",
      description: "Premium venues for meetings and celebrations",
    },
  ];

  const roomTypes = [
    {
      name: "Standard Room",
      price: "$150",
      image: "/placeholder.svg",
      features: ["King Size Bed", "City View", "Free WiFi", "Mini Bar"],
      description: "Comfortable and elegant accommodation with modern amenities",
    },
    {
      name: "Deluxe Suite",
      price: "$250",
      image: "/placeholder.svg",
      features: ["Separate Living Area", "Ocean View", "Balcony", "Premium Bath"],
      description: "Spacious suite with stunning views and luxury amenities",
    },
    {
      name: "Presidential Suite",
      price: "$800",
      image: "/placeholder.svg",
      features: ["2 Bedrooms", "Private Terrace", "Butler Service", "Jacuzzi"],
      description: "Ultimate luxury experience with exclusive services",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, NY",
      rating: 5,
      comment: "Absolutely incredible experience! The staff was amazing and the room was perfect. Will definitely be back!",
      date: "2 days ago",
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      rating: 5,
      comment: "The attention to detail and service quality exceeded all expectations. A truly luxury experience.",
      date: "1 week ago",
    },
    {
      name: "Emily Davis",
      location: "Los Angeles, CA",
      rating: 5,
      comment: "Perfect for our anniversary celebration. The presidential suite was breathtaking!",
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-luxury-900 via-luxury-800 to-luxury-900 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <Badge className="mb-4 bg-hotel-500/20 text-hotel-300 border-hotel-500/30">
            ⭐ Luxury Hotel Experience
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to
            <span className="block text-hotel-400">Armaflex Hotel</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            Experience unparalleled luxury and comfort in the heart of the city. 
            Where every moment becomes a cherished memory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-hotel-500 hover:bg-hotel-600 text-white">
              <Calendar className="h-5 w-5 mr-2" />
              Book Your Stay
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-luxury-900">
              <ArrowRight className="h-5 w-5 mr-2" />
              Explore Rooms
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">World-Class Amenities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our exceptional facilities and services designed to make your stay unforgettable
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-hotel-100 flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-hotel-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Luxurious Accommodations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully designed rooms and suites, each offering comfort and elegance
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map((room, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge className="bg-hotel-500 mb-2">
                      From {room.price}/night
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>{room.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, fIndex) => (
                        <Badge key={fIndex} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-hotel-500 hover:bg-hotel-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read reviews from our valued guests who have experienced our hospitality
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-hotel-500 text-hotel-500" />
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.date}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <Quote className="h-6 w-6 text-hotel-500 mb-2" />
                    <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hotel-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Perfect Stay?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Book now and experience the epitome of luxury hospitality. Special rates available for early bookings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-hotel-600 hover:bg-gray-100">
              <Calendar className="h-5 w-5 mr-2" />
              Book Your Stay
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-hotel-600">
              <Phone className="h-5 w-5 mr-2" />
              Call +1 (555) 123-HOTEL
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-8 bg-luxury-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-6 w-6 text-hotel-400" />
              <div>
                <p className="font-medium">24/7 Reception</p>
                <p className="text-sm text-gray-300">Always at your service</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="h-6 w-6 text-hotel-400" />
              <div>
                <p className="font-medium">Prime Location</p>
                <p className="text-sm text-gray-300">Heart of the city</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-6 w-6 text-hotel-400" />
              <div>
                <p className="font-medium">Best Rate Guarantee</p>
                <p className="text-sm text-gray-300">Lowest prices online</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
