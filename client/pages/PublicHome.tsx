import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PublicHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero background images
  const heroImages = [
    {
      url: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
      title: "Luxury Rooms & Suites",
      subtitle: "Experience comfort like never before",
    },
    {
      url: "https://cdn.pixabay.com/photo/2017/03/22/17/39/kitchen-2165756_1280.jpg",
      title: "Fine Dining Experience",
      subtitle: "Culinary excellence at its finest",
    },
    {
      url: "https://cdn.pixabay.com/photo/2016/11/29/03/53/architecture-1867187_1280.jpg",
      title: "Stunning City Views",
      subtitle: "Breathtaking panoramas from every window",
    },
    {
      url: "https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg",
      title: "Wellness & Spa",
      subtitle: "Rejuvenate your mind, body and soul",
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );
  };

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
      description:
        "Comfortable and elegant accommodation with modern amenities",
    },
    {
      name: "Deluxe Suite",
      price: "$250",
      image: "/placeholder.svg",
      features: [
        "Separate Living Area",
        "Ocean View",
        "Balcony",
        "Premium Bath",
      ],
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
      comment:
        "Absolutely incredible experience! The staff was amazing and the room was perfect. Will definitely be back!",
      date: "2 days ago",
      avatar: "/placeholder.svg",
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      rating: 5,
      comment:
        "The attention to detail and service quality exceeded all expectations. A truly luxury experience.",
      date: "1 week ago",
      avatar: "/placeholder.svg",
    },
    {
      name: "Emily Davis",
      location: "Los Angeles, CA",
      rating: 5,
      comment:
        "Perfect for our anniversary celebration. The presidential suite was breathtaking!",
      date: "2 weeks ago",
      avatar: "/placeholder.svg",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section with Sliding Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white border-white/20"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white border-white/20"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-hotel-400 scale-125"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-hotel-400/30 rounded-full animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-3 h-3 bg-white/20 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-4 h-4 bg-hotel-300/20 rounded-full animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-60 right-40 w-2 h-2 bg-white/30 rounded-full animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-hotel-500/20 text-hotel-300 border-hotel-500/30 animate-slide-up">
              ⭐ Luxury Hotel Experience
            </Badge>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Welcome to
              <span className="block text-hotel-400 animate-glow">
                Armaflex Hotel
              </span>
            </h1>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-xl md:text-2xl mb-4 text-hotel-300 font-medium">
                {heroImages[currentSlide].title}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                {heroImages[currentSlide].subtitle}
              </p>
            </div>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                size="lg"
                className="bg-hotel-500 hover:bg-hotel-600 text-white transform hover:scale-105 transition-all duration-200"
                asChild
              >
                <a href="/book">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Your Stay
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-luxury-900 transform hover:scale-105 transition-all duration-200"
                asChild
              >
                <a href="/guest/login">
                  <Hotel className="h-5 w-5 mr-2" />
                  Guest Portal
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-luxury-900 transform hover:scale-105 transition-all duration-200"
              >
                <Play className="h-5 w-5 mr-2" />
                Virtual Tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Animations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              World-Class Amenities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our exceptional facilities and services designed to make
              your stay unforgettable
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-hotel-100 flex items-center justify-center group-hover:bg-hotel-200 transition-colors duration-300 group-hover:scale-110 transform">
                      <feature.icon className="h-8 w-8 text-hotel-600 group-hover:text-hotel-700 transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-hotel-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section with Staggered Animations */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Luxurious Accommodations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully designed rooms and suites, each offering
              comfort and elegance
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map((room, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group animate-slide-in-from-bottom"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge className="bg-hotel-500/90 backdrop-blur-sm mb-2 animate-pulse">
                      From {room.price}/night
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-hotel-400 text-hotel-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-hotel-600 transition-colors duration-300">
                    {room.name}
                  </CardTitle>
                  <CardDescription>{room.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, fIndex) => (
                        <Badge
                          key={fIndex}
                          variant="secondary"
                          className="text-xs group-hover:bg-hotel-100 group-hover:text-hotel-700 transition-colors duration-300"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-hotel-500 hover:bg-hotel-600 transform hover:scale-105 transition-all duration-200">
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

      {/* Testimonials Section with Rotation Animation */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Guests Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read reviews from our valued guests who have experienced our
              hospitality
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 transform hover:rotate-1 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-hotel-500 text-hotel-500 animate-twinkle"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs group-hover:bg-hotel-100 transition-colors duration-300"
                    >
                      {testimonial.date}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <Quote className="h-6 w-6 text-hotel-500 mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-muted-foreground italic">
                      "{testimonial.comment}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-hotel-200 group-hover:ring-hotel-400 transition-all duration-300">
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium group-hover:text-hotel-600 transition-colors duration-300">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Animated CTA Section */}
      <section className="py-16 bg-gradient-to-r from-hotel-500 to-hotel-600 text-white relative overflow-hidden">
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zM0 0h20v20H0V0zm20 20h20v20H20V20z"/%3E%3C/g%3E%3C/svg%3E\')] animate-pulse'
          }
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-bounce-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Your Perfect Stay?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Book now and experience the epitome of luxury hospitality. Special
              rates available for early bookings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-hotel-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 animate-pulse"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Your Stay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-hotel-600 transform hover:scale-105 transition-all duration-200"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call +1 (555) 123-HOTEL
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar with Sliding Animation */}
      <section className="py-8 bg-luxury-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div
              className="flex items-center justify-center space-x-3 animate-slide-in-left"
              style={{ animationDelay: "0.2s" }}
            >
              <Clock className="h-6 w-6 text-hotel-400 animate-spin-slow" />
              <div>
                <p className="font-medium">24/7 Reception</p>
                <p className="text-sm text-gray-300">Always at your service</p>
              </div>
            </div>
            <div
              className="flex items-center justify-center space-x-3 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <MapPin className="h-6 w-6 text-hotel-400 animate-bounce" />
              <div>
                <p className="font-medium">Prime Location</p>
                <p className="text-sm text-gray-300">Heart of the city</p>
              </div>
            </div>
            <div
              className="flex items-center justify-center space-x-3 animate-slide-in-right"
              style={{ animationDelay: "0.6s" }}
            >
              <CheckCircle className="h-6 w-6 text-hotel-400 animate-pulse" />
              <div>
                <p className="font-medium">Best Rate Guarantee</p>
                <p className="text-sm text-gray-300">Lowest prices online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-from-bottom {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce-in {
          from { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
          50% { text-shadow: 0 0 30px rgba(251, 191, 36, 0.8); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-in-from-bottom { animation: slide-in-from-bottom 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.8s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 1.5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}
