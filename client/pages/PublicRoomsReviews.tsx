import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GuestBooking } from "@/components/GuestBooking";
import {
  Users,
  Star,
  Calendar,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Tv,
  Coffee,
  Shield,
  BedDouble,
  Bath,
  Quote,
  MapPin,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Public Rooms Page
export function PublicRoomsPage() {
  const roomTypes = [
    {
      id: 1,
      name: "Standard Room",
      price: "$150",
      originalPrice: "$180",
      image: "/placeholder.svg",
      size: "25 sqm",
      occupancy: "2 guests",
      bed: "King Size Bed",
      view: "City View",
      features: [
        { icon: Wifi, name: "Free WiFi" },
        { icon: Tv, name: "Smart TV" },
        { icon: Coffee, name: "Coffee Maker" },
        { icon: Shield, name: "Safe" },
      ],
      amenities: [
        "Air conditioning",
        "Mini refrigerator", 
        "Work desk",
        "Blackout curtains",
        "Daily housekeeping",
        "24/7 room service",
      ],
      description: "Comfortable and elegant accommodation with modern amenities and city views.",
      popular: false,
    },
    {
      id: 2,
      name: "Deluxe Suite",
      price: "$250",
      originalPrice: "$300",
      image: "/placeholder.svg",
      size: "45 sqm",
      occupancy: "3 guests",
      bed: "King Size Bed + Sofa Bed",
      view: "Ocean View",
      features: [
        { icon: Wifi, name: "Free WiFi" },
        { icon: Tv, name: "Smart TV" },
        { icon: Coffee, name: "Espresso Machine" },
        { icon: Bath, name: "Premium Bath" },
      ],
      amenities: [
        "Separate living area",
        "Ocean view balcony",
        "Premium bathroom amenities",
        "Bathrobe and slippers",
        "Welcome champagne",
        "Priority room service",
      ],
      description: "Spacious suite with stunning ocean views and luxury amenities for the perfect getaway.",
      popular: true,
    },
    {
      id: 3,
      name: "Presidential Suite",
      price: "$800",
      originalPrice: "$950",
      image: "/placeholder.svg",
      size: "120 sqm",
      occupancy: "6 guests",
      bed: "2 King Size Bedrooms",
      view: "Panoramic Ocean View",
      features: [
        { icon: Wifi, name: "Premium WiFi" },
        { icon: Tv, name: "Entertainment System" },
        { icon: Utensils, name: "Kitchenette" },
        { icon: Users, name: "Butler Service" },
      ],
      amenities: [
        "2 separate bedrooms",
        "Private terrace",
        "Dining area for 8",
        "Personal butler service",
        "Jacuzzi and rain shower",
        "Airport limousine service",
      ],
      description: "Ultimate luxury experience with exclusive services and breathtaking panoramic views.",
      popular: false,
    },
  ];

  const facilities = [
    { icon: Wifi, name: "High-Speed WiFi", description: "Complimentary throughout property" },
    { icon: Car, name: "Valet Parking", description: "Free parking with valet service" },
    { icon: Utensils, name: "Fine Dining", description: "Award-winning restaurant" },
    { icon: Dumbbell, name: "Fitness Center", description: "24/7 gym access" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-luxury-900 to-luxury-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-hotel-500/20 text-hotel-300 border-hotel-500/30">
              🏨 Luxury Accommodations
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Rooms & Suites</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Choose from our carefully designed rooms and suites, each offering comfort, 
              elegance, and stunning views of the city or ocean.
            </p>
          </div>
        </div>
      </section>

      {/* Room Booking System */}
      <section className="py-16 bg-background" data-booking-section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Perfect Room</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our luxury accommodations with instant booking confirmation and secure payment processing.
            </p>
          </div>
          <GuestBooking />
        </div>
      </section>

      {/* Hotel Facilities */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hotel Facilities</h2>
            <p className="text-lg text-muted-foreground">
              Enjoy our world-class amenities and services during your stay
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-hotel-100 flex items-center justify-center mx-auto mb-4">
                    <facility.icon className="h-8 w-8 text-hotel-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{facility.name}</h3>
                  <p className="text-sm text-muted-foreground">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hotel-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Luxury?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your perfect room today and enjoy exclusive benefits for direct bookings.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-hotel-600 hover:bg-gray-100"
            onClick={() => {
              const bookingSection = document.querySelector('[data-booking-section]');
              if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Check Availability
          </Button>
        </div>
      </section>
    </div>
  );
}

// Public Reviews Page
export function PublicReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, NY",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "December 15, 2024",
      stayType: "Business Trip",
      roomType: "Deluxe Suite",
      title: "Absolutely Outstanding Experience!",
      comment: "From the moment I walked into the lobby, I was impressed by the elegant décor and warm hospitality. The staff went above and beyond to ensure my stay was perfect. The room was immaculate, spacious, and had breathtaking views. The breakfast was exceptional, and the concierge helped me plan my entire itinerary. I'll definitely be returning!",
      helpful: 24,
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "San Francisco, CA", 
      avatar: "/placeholder.svg",
      rating: 5,
      date: "December 10, 2024",
      stayType: "Anniversary",
      roomType: "Presidential Suite",
      title: "Perfect Anniversary Getaway",
      comment: "My wife and I celebrated our 10th anniversary here, and it exceeded all expectations. The presidential suite was absolutely stunning - the private terrace with ocean views was magical. The butler service was impeccable, and they surprised us with champagne and chocolate-covered strawberries. The spa treatments were divine. Worth every penny!",
      helpful: 31,
      verified: true,
    },
    {
      id: 3,
      name: "Emily Davis",
      location: "Los Angeles, CA",
      avatar: "/placeholder.svg", 
      rating: 5,
      date: "December 5, 2024",
      stayType: "Family Vacation",
      roomType: "Standard Room",
      title: "Exceptional Service and Comfort",
      comment: "Traveling with two young children can be challenging, but the staff here made it effortless. They provided a crib, extra towels, and even arranged for early check-in. The room was spotless and quiet. The kids loved the pool area, and we enjoyed the family-friendly restaurant. The location is perfect for exploring the city. Highly recommended!",
      helpful: 18,
      verified: true,
    },
    {
      id: 4,
      name: "Robert Wilson",
      location: "Chicago, IL",
      avatar: "/placeholder.svg",
      rating: 4,
      date: "November 28, 2024", 
      stayType: "Business Trip",
      roomType: "Deluxe Suite",
      title: "Great Business Hotel",
      comment: "Excellent choice for business travelers. The WiFi was fast, the business center was well-equipped, and the meeting rooms were professional. Room service was prompt and the food quality was outstanding. The only minor issue was the elevator wait times during peak hours, but overall a fantastic stay.",
      helpful: 12,
      verified: true,
    },
    {
      id: 5,
      name: "Lisa Martinez",
      location: "Miami, FL",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "November 20, 2024",
      stayType: "Weekend Getaway",
      roomType: "Standard Room", 
      title: "Luxury at Its Finest",
      comment: "This hotel truly defines luxury hospitality. Every detail was perfect - from the thread count of the sheets to the pressure of the rainfall shower. The staff anticipated my needs before I even asked. The rooftop bar has incredible views, and the fitness center is state-of-the-art. Already planning my next visit!",
      helpful: 27,
      verified: true,
    },
    {
      id: 6,
      name: "David Park",
      location: "Seattle, WA",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "November 15, 2024",
      stayType: "Leisure",
      roomType: "Deluxe Suite",
      title: "Unforgettable Stay",
      comment: "The attention to detail is remarkable. The concierge arranged restaurant reservations and show tickets effortlessly. The housekeeping team left beautiful towel art daily. The hotel's restaurant serves some of the best food I've had. The location is perfect - walking distance to major attractions. Five stars isn't enough!",
      helpful: 20,
      verified: true,
    },
  ];

  const reviewStats = {
    overall: 4.9,
    total: 1247,
    breakdown: [
      { stars: 5, count: 1089, percentage: 87 },
      { stars: 4, count: 124, percentage: 10 },
      { stars: 3, count: 25, percentage: 2 },
      { stars: 2, count: 6, percentage: 1 },
      { stars: 1, count: 3, percentage: 0 },
    ],
    categories: [
      { name: "Service", rating: 4.9 },
      { name: "Cleanliness", rating: 4.8 },
      { name: "Location", rating: 4.9 },
      { name: "Value", rating: 4.7 },
      { name: "Amenities", rating: 4.8 },
    ],
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-luxury-900 to-luxury-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-8 w-8 fill-hotel-400 text-hotel-400" />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Guest Reviews</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Read what our guests say about their experiences at Armaflex Hotel. 
              Over {reviewStats.total} verified reviews with an average rating of {reviewStats.overall} stars.
            </p>
          </div>
        </div>
      </section>

      {/* Review Stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Overall Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Guest Rating</CardTitle>
                <CardDescription>Based on {reviewStats.total} verified reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-hotel-600 mb-2">{reviewStats.overall}</div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 fill-hotel-500 text-hotel-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">Excellent</p>
                </div>
                <div className="space-y-2">
                  {reviewStats.breakdown.map((item) => (
                    <div key={item.stars} className="flex items-center space-x-2">
                      <span className="text-sm w-6">{item.stars}</span>
                      <Star className="h-4 w-4 fill-hotel-500 text-hotel-500" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-hotel-500 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Ratings */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Categories</CardTitle>
                <CardDescription>Detailed breakdown by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviewStats.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= category.rating ? 'fill-hotel-500 text-hotel-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{category.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recent Reviews</h2>
            <p className="text-lg text-muted-foreground">
              Latest feedback from our valued guests
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {review.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{review.name}</h4>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified Stay
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{review.location}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm mt-1">
                          <Badge variant="secondary" className="text-xs">{review.stayType}</Badge>
                          <Badge variant="outline" className="text-xs">{review.roomType}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= review.rating ? 'fill-hotel-500 text-hotel-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-semibold mb-2">{review.title}</h5>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      👍 Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <ArrowRight className="h-4 w-4 mr-2" />
              Load More Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Write Review CTA */}
      <section className="py-16 bg-hotel-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-xl mb-8 opacity-90">
            Stayed with us recently? We'd love to hear about your experience.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-hotel-600 hover:bg-gray-100">
            <Quote className="h-5 w-5 mr-2" />
            Write a Review
          </Button>
        </div>
      </section>
    </div>
  );
}
