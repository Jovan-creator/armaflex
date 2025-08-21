import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  TreePine,
  CreditCard,
  Smartphone,
  Star,
  CheckCircle,
  Shield,
  Award,
  Building2,
  UtensilsCrossed,
  Users2,
  Dumbbell2,
  ArrowLeft,
  Languages,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

// Types for different booking services based on Armaflex Hotel structure
interface BookingData {
  serviceType: "accommodation" | "dining" | "events" | "facilities";
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
  // Facilities specific
  serviceName?: string;
  serviceDate?: Date;
  serviceTime?: string;
  // Common
  specialRequests?: string;
  totalAmount: number;
  currency: string;
}

// Rating interface
interface HotelRating {
  overall: number;
  roomQuality: number;
  service: number;
  cleanliness: number;
  location: number;
  valueForMoney: number;
  wouldRecommend: boolean;
  review: string;
  guestName: string;
  email: string;
}

// Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  roomType: string;
  stayDate: string;
  verified: boolean;
  avatar?: string;
}

// Service data based on actual Armaflex Hotel information
const getServiceCategories = (t: any) => ({
  accommodation: {
    title: t("booking.accommodation"),
    icon: Building2,
    iconColor: "text-blue-600",
    description: t("booking.accommodationDesc"),
    subtitle: t("booking.accommodationSubtitle"),
    items: [
      {
        id: "standard",
        name: "Standard Room",
        count: 38,
        description:
          "Cozy accommodations ideal for solo travelers or couples seeking comfort and convenience",
        price: 180000,
        maxOccupancy: 2,
        size: "25 sqm",
        amenities: [
          "Individual AC",
          "Private Bathroom",
          "City View Balcony",
          "Satellite TV",
          "Free WiFi",
          "Refrigerator",
          "Work Desk",
        ],
        features: [
          "Daily Housekeeping",
          "Room Service",
          "24/7 Front Desk Support",
        ],
        image:
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "twin",
        name: "Twin Bedroom",
        count: 8,
        description:
          "Perfect for friends or colleagues with two comfortable single beds and modern amenities",
        price: 220000,
        maxOccupancy: 2,
        size: "28 sqm",
        amenities: [
          "Individual AC",
          "Private Bathroom",
          "City View Balcony",
          "Satellite TV",
          "Free WiFi",
          "Refrigerator",
          "Work Area",
        ],
        features: [
          "Twin Single Beds",
          "Enhanced Lighting",
          "Extra Storage Space",
        ],
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "executive",
        name: "Executive Room",
        count: 5,
        description:
          "Spacious business-oriented rooms with upgraded amenities and executive privileges",
        price: 350000,
        maxOccupancy: 3,
        size: "35 sqm",
        amenities: [
          "Individual AC",
          "Private Bathroom",
          "City View Balcony",
          "Satellite TV",
          "Free WiFi",
          "Refrigerator",
          "Executive Work Desk",
          "Minibar",
        ],
        features: [
          "Priority Check-in",
          "Late Checkout",
          "Business Center Access",
          "Complimentary Newspaper",
        ],
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "deluxe",
        name: "Deluxe Room",
        count: 5,
        description:
          "Luxurious accommodations with premium furnishing, enhanced space and exclusive amenities",
        price: 450000,
        maxOccupancy: 4,
        size: "42 sqm",
        amenities: [
          "Individual AC",
          "Private Bathroom",
          "Premium City View Balcony",
          "Satellite TV",
          "Free WiFi",
          "Refrigerator",
          "Separate Living Area",
          "Premium Bedding",
          "Minibar",
        ],
        features: [
          "VIP Treatment",
          "Welcome Amenities",
          "Concierge Service",
          "Premium Room Service",
        ],
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=250&fit=crop&crop=center",
      },
    ],
  },
  dining: {
    title: t("booking.dining"),
    icon: UtensilsCrossed,
    iconColor: "text-orange-600",
    description: t("booking.diningDesc"),
    subtitle: t("booking.diningSubtitle"),
    items: [
      {
        id: "fine_dining",
        name: "Fine Dining Restaurant",
        description:
          "Exquisite culinary journey with sophisticated ambiance and global flavors",
        price: 85000,
        capacity: 80,
        openingHours: "18:00-23:00",
        cuisine: "International & Premium Local Cuisine",
        dress_code: "Smart Casual",
        features: [
          "Chef's Tasting Menu",
          "Wine Pairing",
          "Live Music (Weekends)",
          "Private Chef Consultations",
        ],
        image:
          "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "casual_dining",
        name: "Casual Dining",
        description:
          "Relaxed all-day dining with hearty breakfasts, leisurely lunches, and cozy dinners",
        price: 45000,
        capacity: 120,
        openingHours: "06:00-23:00",
        cuisine: "Continental, Local & Comfort Food",
        dress_code: "Casual",
        features: [
          "All-Day Menu",
          "Kids Menu Available",
          "Outdoor Terrace Seating",
          "Business Breakfast",
        ],
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "bar_lounge",
        name: "Bar & Lounge",
        description:
          "Stylish space to unwind with signature cocktails, premium wines and gourmet light bites",
        price: 35000,
        capacity: 60,
        openingHours: "16:00-02:00",
        cuisine: "Cocktails, Wines & Light Appetizers",
        dress_code: "Smart Casual",
        features: [
          "Signature Cocktails",
          "Live DJ (Thursday-Saturday)",
          "Wine Selection",
          "Happy Hour (17:00-19:00)",
        ],
        image:
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "private_dining",
        name: "Private Dining & Events",
        description:
          "Customized dining experiences for special occasions with personalized menus and dedicated service",
        price: 150000,
        capacity: 50,
        openingHours: "By Appointment",
        cuisine: "Customized Menu Options",
        dress_code: "As per event theme",
        features: [
          "Personalized Menu",
          "Dedicated Service Team",
          "Custom Decorations",
          "Special Dietary Accommodations",
        ],
        image:
          "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=250&fit=crop&crop=center",
      },
    ],
  },
  events: {
    title: t("booking.events"),
    icon: Users2,
    iconColor: "text-purple-600",
    description: t("booking.eventsDesc"),
    subtitle: t("booking.eventsSubtitle"),
    items: [
      {
        id: "conference_hall",
        name: "Grand Conference Hall",
        description:
          "Main conference space accommodating large gatherings with state-of-the-art AV equipment",
        price: 400000,
        capacity: 200,
        area: "300 sqm",
        setup_options: [
          "Theater",
          "Boardroom",
          "U-Shape",
          "Classroom",
          "Reception",
        ],
        equipment: [
          "Projector & Screen",
          "Professional Sound System",
          "Wireless Microphones",
          "High-Speed WiFi",
          "Climate Control",
          "Stage Platform",
        ],
        features: [
          "Dedicated Event Coordinator",
          "Catering Kitchen Access",
          "VIP Green Room",
          "Live Streaming Capability",
        ],
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "boardroom",
        name: "Executive Boardroom",
        description:
          "Intimate executive meeting space for high-level business discussions and presentations",
        price: 180000,
        capacity: 20,
        area: "60 sqm",
        setup_options: ["Boardroom", "U-Shape"],
        equipment: [
          '65" Interactive Display',
          "Video Conferencing System",
          "Conference Phone",
          "High-Speed WiFi",
          "Climate Control",
        ],
        features: [
          "Executive Service",
          "Coffee & Tea Service",
          "Business Center Access",
          "Secretary Services",
        ],
        image:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "banquet_hall",
        name: "Elegant Banquet Hall",
        description:
          "Beautiful space for weddings, celebrations and formal events with customizable décor",
        price: 600000,
        capacity: 300,
        area: "450 sqm",
        setup_options: ["Reception", "Banquet", "Theater", "Mixed Layout"],
        equipment: [
          "Professional Stage",
          "Advanced Sound & Lighting",
          "Dance Floor",
          "Bridal Suite Access",
        ],
        features: [
          "Wedding Coordinator",
          "Décor Services",
          "Photography Areas",
          "Cake Cutting Ceremony Setup",
        ],
        image:
          "https://images.unsplash.com/photo-1519167758481-83f29b1fe9e3?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "outdoor_garden",
        name: "Garden Pavilion",
        description:
          "Scenic outdoor venue perfect for ceremonies, cocktail receptions and networking events",
        price: 350000,
        capacity: 150,
        area: "400 sqm",
        setup_options: ["Garden Party", "Ceremony", "Cocktail Reception"],
        equipment: [
          "Weather Protection Tents",
          "Outdoor Lighting",
          "Sound System",
          "Garden Gazebo",
        ],
        features: [
          "Natural Garden Setting",
          "Weather Contingency Plans",
          "Outdoor Catering Setup",
          "Photo-friendly Landscaping",
        ],
        image:
          "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=250&fit=crop&crop=center",
      },
    ],
  },
  facilities: {
    title: t("booking.facilities"),
    icon: Dumbbell,
    iconColor: "text-green-600",
    description: t("booking.facilitiesDesc"),
    subtitle: t("booking.facilitiesSubtitle"),
    items: [
      {
        id: "wellness_spa",
        name: "Wellness & Spa Services",
        description:
          "Complete wellness experience with massage therapy, sauna, steam room and jacuzzi",
        price: 120000,
        duration: 180,
        category: "wellness",
        services: [
          "Therapeutic Massage",
          "Sauna Session",
          "Steam Room",
          "Jacuzzi",
          "Relaxation Area",
        ],
        features: [
          "Professional Therapists",
          "Premium Products",
          "Peaceful Environment",
          "Post-treatment Refreshments",
        ],
        image:
          "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "fitness_center",
        name: "Fitness Center",
        description:
          "Fully equipped modern gym with cardio machines, weights and personal training services",
        price: 35000,
        duration: 480,
        category: "fitness",
        services: [
          "Cardio Equipment",
          "Weight Training",
          "Personal Training",
          "Group Classes",
        ],
        features: [
          "Latest Equipment",
          "Certified Trainers",
          "24/7 Access (for guests)",
          "Locker Facilities",
        ],
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "swimming_pool",
        name: "Outdoor Swimming Pool",
        description:
          "Refreshing outdoor pool with poolside service and recreational facilities",
        price: 25000,
        duration: 480,
        category: "recreation",
        services: [
          "Pool Access",
          "Poolside Service",
          "Lounge Chairs",
          "Pool Towels",
        ],
        features: [
          "Scenic Pool Area",
          "Pool Bar Service",
          "Swimming Assistance",
          "Poolside Dining",
        ],
        image:
          "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "business_center",
        name: "Business Center Services",
        description:
          "Professional business facilities with high-speed internet, printing and meeting support",
        price: 20000,
        duration: 240,
        category: "business",
        services: [
          "High-Speed Internet",
          "Printing & Scanning",
          "Computer Access",
          "Meeting Room Access",
        ],
        features: [
          "24/7 Availability",
          "Professional Support",
          "Secretarial Services",
          "Translation Services",
        ],
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop&crop=center",
      },
      {
        id: "concierge_services",
        name: "Concierge Services",
        description:
          "Personalized assistance with transportation, tours, reservations and local arrangements",
        price: 50000,
        duration: 0,
        category: "concierge",
        services: [
          "Airport Transfer",
          "Local Transportation",
          "Tour Arrangements",
          "Reservation Assistance",
        ],
        features: [
          "24/7 Concierge",
          "Local Expertise",
          "Multilingual Staff",
          "Special Arrangements",
        ],
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&crop=center",
      },
    ],
  },
});

const countries = [
  "Uganda",
  "Kenya",
  "Tanzania",
  "Rwanda",
  "South Sudan",
  "Democratic Republic of Congo",
  "Nigeria",
  "Ghana",
  "South Africa",
  "Egypt",
  "Morocco",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Other",
];

// Sample testimonials data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Kampala, Uganda",
    rating: 5,
    review:
      "Absolutely exceptional service! The staff went above and beyond to make our stay memorable. The deluxe room was spacious and beautifully appointed with stunning city views. The fine dining restaurant exceeded our expectations with exquisite local and international cuisine.",
    roomType: "Deluxe Room",
    stayDate: "March 2024",
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Nairobi, Kenya",
    rating: 5,
    review:
      "Perfect location for business meetings. The conference facilities are top-notch with excellent AV equipment. The executive room provided a comfortable workspace, and the business center was very convenient. Highly recommend for corporate events.",
    roomType: "Executive Room",
    stayDate: "February 2024",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "London, UK",
    rating: 4,
    review:
      "Beautiful hotel with excellent amenities. The spa services were incredibly relaxing, and the outdoor pool area is gorgeous. The staff was friendly and professional throughout our stay. The only minor issue was the WiFi speed in the room.",
    roomType: "Twin Bedroom",
    stayDate: "January 2024",
    verified: true,
  },
  {
    id: 4,
    name: "David Ochieng",
    location: "Jinja, Uganda",
    rating: 5,
    review:
      "Hosted our wedding reception at the banquet hall and it was magical! The event coordination team was fantastic, helping with every detail. The venue was beautifully decorated and the catering was exceptional. Our guests were impressed!",
    roomType: "Banquet Hall",
    stayDate: "December 2023",
    verified: true,
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    location: "Madrid, Spain",
    rating: 4,
    review:
      "Lovely stay in the standard room. Clean, comfortable, and well-equipped with all amenities. The casual dining restaurant served delicious food with great variety. The location is convenient with easy access to the city center.",
    roomType: "Standard Room",
    stayDate: "November 2023",
    verified: true,
  },
  {
    id: 6,
    name: "James Mukasa",
    location: "Gulu, Uganda",
    rating: 5,
    review:
      "Outstanding experience from check-in to check-out. The concierge service helped arrange local tours and transportation. The fitness center is well-equipped and the pool area is perfect for relaxation. Definitely coming back!",
    roomType: "Executive Room",
    stayDate: "October 2023",
    verified: true,
  },
];

export default function PublicBooking() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof serviceCategories>("accommodation");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceType: "accommodation",
    guestInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "Uganda",
      city: "",
      nationality: "",
    },
    totalAmount: 0,
    currency: "UGX",
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "mobile_money" | "bank_transfer"
  >("mobile_money");
  const [isLoading, setIsLoading] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(
    null,
  );
  const [hotelRating, setHotelRating] = useState<HotelRating>({
    overall: 0,
    roomQuality: 0,
    service: 0,
    cleanliness: 0,
    location: 0,
    valueForMoney: 0,
    wouldRecommend: false,
    review: "",
    guestName: "",
    email: "",
  });
  const { toast } = useToast();

  const serviceCategories = getServiceCategories(t);

  // Calculate total amount based on selections
  useEffect(() => {
    if (selectedService) {
      let total = selectedService.price;

      if (
        selectedCategory === "accommodation" &&
        bookingData.checkIn &&
        bookingData.checkOut
      ) {
        const nights = Math.ceil(
          (bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        total = selectedService.price * Math.max(1, nights);
      }

      setBookingData((prev) => ({ ...prev, totalAmount: total }));
    }
  }, [
    selectedService,
    selectedCategory,
    bookingData.checkIn,
    bookingData.checkOut,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setBookingData((prev) => ({
      ...prev,
      serviceType: selectedCategory,
      [selectedCategory === "accommodation"
        ? "roomType"
        : selectedCategory === "dining"
          ? "diningVenue"
          : selectedCategory === "events"
            ? "eventSpace"
            : "serviceName"]: service.id,
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("Booking Data:", bookingData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Booking Request Sent!",
        description: `Your booking reference is ARM-${Date.now()}. Our team will contact you within 24 hours to confirm your reservation.`,
      });

      // Reset form
      setCurrentStep(1);
      setSelectedService(null);
      setBookingData({
        serviceType: "accommodation",
        guestInfo: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "Uganda",
          city: "",
          nationality: "",
        },
        totalAmount: 0,
        currency: "UGX",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          "There was an error processing your booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      console.log("Rating Data:", hotelRating);

      toast({
        title: "Thank You!",
        description:
          "Your review has been submitted successfully. We appreciate your feedback!",
      });

      setShowRatingForm(false);
      setHotelRating({
        overall: 0,
        roomQuality: 0,
        service: 0,
        cleanliness: 0,
        location: 0,
        valueForMoney: 0,
        wouldRecommend: false,
        review: "",
        guestName: "",
        email: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const StarRating = ({
    value,
    onChange,
    size = "w-6 h-6",
  }: {
    value: number;
    onChange: (rating: number) => void;
    size?: string;
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} cursor-pointer transition-colors ${
            star <= value
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 hover:text-yellow-300"
          }`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const isExpanded = expandedTestimonial === testimonial.id;
    const shouldTruncate = testimonial.review.length > 150;
    const displayReview =
      isExpanded || !shouldTruncate
        ? testimonial.review
        : testimonial.review.substring(0, 150) + "...";

    return (
      <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-800"
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      {t("booking.verifiedGuest")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <blockquote className="text-gray-700 mb-4 leading-relaxed">
            "{displayReview}"
          </blockquote>

          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setExpandedTestimonial(isExpanded ? null : testimonial.id)
              }
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              {isExpanded ? (
                <>
                  {t("booking.showLess")} <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  {t("booking.readMore")}{" "}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
            <span>
              {t("booking.stayedIn")} {testimonial.roomType}
            </span>
            <span>{testimonial.stayDate}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header with Logo */}
      <div className="bg-white shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full overflow-hidden shadow-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ff34557ef576f4689b273621150e9cf4f%2F053306aaaefe4fe288a9e89dc1941919?format=webp&width=800"
                  alt="Armaflex Hotel Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Armaflex Hotel
                </h1>
                <p className="text-blue-600 font-medium">
                  Jinja Camp, Juba Road, Lira City West Division
                </p>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-gray-300 text-gray-300" />
                  <span className="ml-1">4.2/5 (856 reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Language Switcher and Staff Login */}
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>{t("booking.staffLogin")}</span>
                </Button>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">+256 392004134</div>
                    <div className="text-xs">+256 761036070</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">info@armaflexhotel.com</div>
                    <div className="text-xs">Reservations</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Lira City</div>
                    <div className="text-xs">Northern Uganda</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center space-x-4 mb-12">
          {[
            {
              step: 1,
              title: t("booking.selectService"),
              icon: "🏨",
              desc: t("booking.chooseYourExperience"),
            },
            {
              step: 2,
              title: t("booking.serviceDetails"),
              icon: "📝",
              desc: t("booking.specifyPreferences"),
            },
            {
              step: 3,
              title: t("booking.guestInformation"),
              icon: "👤",
              desc: t("booking.provideDetails"),
            },
            {
              step: 4,
              title: t("booking.bookingConfirmation"),
              icon: "✅",
              desc: t("booking.reviewBooking"),
            },
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep >= item.step
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > item.step ? "✓" : item.icon}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= item.step
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {item.desc}
                  </p>
                </div>
              </div>
              {index < 3 && (
                <div
                  className={`w-16 h-1 mx-4 rounded transition-all duration-300 ${
                    currentStep > item.step
                      ? "bg-gradient-to-r from-blue-600 to-blue-700"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t("booking.chooseYourExperience")}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t("booking.perfectService")}
                  </p>
                </div>

                <Tabs
                  value={selectedCategory}
                  onValueChange={(value) =>
                    setSelectedCategory(value as keyof typeof serviceCategories)
                  }
                >
                  <TabsList className="grid w-full grid-cols-4 mb-8 h-auto">
                    {Object.entries(serviceCategories).map(
                      ([key, category]) => {
                        const IconComponent = category.icon;
                        return (
                          <TabsTrigger
                            key={key}
                            value={key}
                            className="flex flex-col items-center p-4 h-auto"
                          >
                            <IconComponent
                              className={`w-8 h-8 mb-2 ${category.iconColor}`}
                            />
                            <span className="font-medium text-sm">
                              {category.title}
                            </span>
                          </TabsTrigger>
                        );
                      },
                    )}
                  </TabsList>

                  {Object.entries(serviceCategories).map(([key, category]) => (
                    <TabsContent key={key} value={key} className="mt-0">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 text-lg mb-2">
                          {category.description}
                        </p>
                        {category.subtitle && (
                          <p className="text-blue-600 font-medium">
                            {category.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="grid lg:grid-cols-2 gap-8">
                        {category.items.map((item) => (
                          <Card
                            key={item.id}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                              selectedService?.id === item.id
                                ? "ring-2 ring-blue-500 bg-blue-50 shadow-lg scale-105"
                                : "hover:shadow-lg hover:scale-102"
                            }`}
                            onClick={() => handleServiceSelect(item)}
                          >
                            <CardContent className="p-0">
                              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTI1TDE3NSAxMDBIMjI1TDIwMCAxMjVaIiBmaWxsPSIjOUI5Qjk5Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Qjk5OTkiPkltYWdlPC90ZXh0Pgo8L3N2Zz4K";
                                  }}
                                />
                              </div>
                              <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                                      {item.name}
                                    </h4>
                                    {key === "accommodation" && item.count && (
                                      <p className="text-sm text-blue-600 font-medium">
                                        {item.count} rooms available
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {formatCurrency(item.price)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {key === "accommodation"
                                        ? "per night"
                                        : key === "dining"
                                          ? "per person"
                                          : key === "events"
                                            ? "per event"
                                            : "per service"}
                                    </div>
                                  </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                  {item.description}
                                </p>

                                <div className="space-y-3">
                                  {/* Room specific info */}
                                  {key === "accommodation" && (
                                    <div className="flex flex-wrap gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800"
                                      >
                                        <Users className="w-3 h-3 mr-1" />
                                        Up to {item.maxOccupancy} guests
                                      </Badge>
                                      {item.size && (
                                        <Badge
                                          variant="secondary"
                                          className="bg-green-100 text-green-800"
                                        >
                                          {item.size}
                                        </Badge>
                                      )}
                                    </div>
                                  )}

                                  {/* Dining specific info */}
                                  {key === "dining" && (
                                    <div className="flex flex-wrap gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-purple-100 text-purple-800"
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {item.openingHours}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-orange-100 text-orange-800"
                                      >
                                        Seats {item.capacity}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Events specific info */}
                                  {key === "events" && (
                                    <div className="flex flex-wrap gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-indigo-100 text-indigo-800"
                                      >
                                        <Users className="w-3 h-3 mr-1" />
                                        Up to {item.capacity} people
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-100 text-green-800"
                                      >
                                        {item.area}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Facilities specific info */}
                                  {key === "facilities" && item.duration && (
                                    <div className="flex flex-wrap gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="bg-teal-100 text-teal-800"
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {Math.floor(item.duration / 60)}h{" "}
                                        {item.duration % 60}m
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800"
                                      >
                                        {item.category}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* Amenities/Features */}
                                  {(item.amenities ||
                                    item.features ||
                                    item.services) && (
                                    <div className="border-t pt-3">
                                      <div className="flex flex-wrap gap-1">
                                        {(
                                          item.amenities ||
                                          item.features ||
                                          item.services
                                        )
                                          ?.slice(0, 4)
                                          .map((feature, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="outline"
                                              className="text-xs border-gray-300"
                                            >
                                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                              {feature}
                                            </Badge>
                                          ))}
                                        {(
                                          item.amenities ||
                                          item.features ||
                                          item.services
                                        )?.length > 4 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs border-gray-300"
                                          >
                                            +
                                            {(
                                              item.amenities ||
                                              item.features ||
                                              item.services
                                            ).length - 4}{" "}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="flex justify-end pt-8">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedService}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  >
                    {t("booking.continueWith")} {selectedService?.name} →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {currentStep === 2 && selectedService && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t("booking.serviceDetails")}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t("booking.specifyPreferences")} {selectedService.name}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">
                        {selectedService.name}
                      </h3>
                      <p className="text-gray-600">
                        {selectedService.description}
                      </p>
                      {selectedCategory === "accommodation" &&
                        selectedService.size && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            Room Size: {selectedService.size}
                          </p>
                        )}
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedService.price)}
                    </span>
                  </div>
                </div>

                {/* Accommodation Details */}
                {selectedCategory === "accommodation" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="checkin"
                        className="text-base font-medium"
                      >
                        Check-in Date
                      </Label>
                      <Input
                        id="checkin"
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={
                          bookingData.checkIn
                            ? format(bookingData.checkIn, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            checkIn: e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="checkout"
                        className="text-base font-medium"
                      >
                        Check-out Date
                      </Label>
                      <Input
                        id="checkout"
                        type="date"
                        min={
                          bookingData.checkIn
                            ? format(
                                addDays(bookingData.checkIn, 1),
                                "yyyy-MM-dd",
                              )
                            : format(addDays(new Date(), 1), "yyyy-MM-dd")
                        }
                        value={
                          bookingData.checkOut
                            ? format(bookingData.checkOut, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            checkOut: e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adults" className="text-base font-medium">
                        Number of Adults
                      </Label>
                      <Select
                        value={bookingData.adults?.toString() || "1"}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({
                            ...prev,
                            adults: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: selectedService.maxOccupancy },
                            (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}
                              >
                                {i + 1} Adult{i > 0 ? "s" : ""}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="children"
                        className="text-base font-medium"
                      >
                        Number of Children
                      </Label>
                      <Select
                        value={bookingData.children?.toString() || "0"}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({
                            ...prev,
                            children: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 4 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i} Child{i !== 1 ? "ren" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Dining Details */}
                {selectedCategory === "dining" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="diningdate"
                        className="text-base font-medium"
                      >
                        Dining Date
                      </Label>
                      <Input
                        id="diningdate"
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={
                          bookingData.diningDate
                            ? format(bookingData.diningDate, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            diningDate: e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="diningtime"
                        className="text-base font-medium"
                      >
                        Preferred Time
                      </Label>
                      <Select
                        value={bookingData.diningTime || ""}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({
                            ...prev,
                            diningTime: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Generate time slots based on opening hours */}
                          {selectedService.openingHours !== "By Appointment" &&
                            Array.from({ length: 12 }, (_, i) => {
                              const hour = i + 12; // Start from noon
                              const timeString = `${hour}:00`;
                              const displayTime =
                                hour > 12
                                  ? `${hour - 12}:00 PM`
                                  : `${hour}:00 PM`;
                              return (
                                <SelectItem key={timeString} value={timeString}>
                                  {displayTime}
                                </SelectItem>
                              );
                            })}
                          {selectedService.openingHours ===
                            "By Appointment" && (
                            <SelectItem value="appointment">
                              By Appointment
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="partysize"
                        className="text-base font-medium"
                      >
                        Party Size
                      </Label>
                      <Select
                        value={bookingData.partySize?.toString() || "2"}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({
                            ...prev,
                            partySize: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: Math.min(selectedService.capacity, 20) },
                            (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}
                              >
                                {i + 1} Guest{i > 0 ? "s" : ""}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedService.cuisine && (
                      <div>
                        <Label className="text-base font-medium">
                          Cuisine Type
                        </Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">
                            {selectedService.cuisine}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Events Details */}
                {selectedCategory === "events" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="eventdate"
                        className="text-base font-medium"
                      >
                        Event Date
                      </Label>
                      <Input
                        id="eventdate"
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={
                          bookingData.eventDate
                            ? format(bookingData.eventDate, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            eventDate: e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="eventtype"
                        className="text-base font-medium"
                      >
                        Event Type
                      </Label>
                      <Select
                        value={bookingData.eventType || ""}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({
                            ...prev,
                            eventType: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">
                            Corporate Meeting
                          </SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="wedding">
                            Wedding Ceremony
                          </SelectItem>
                          <SelectItem value="birthday">
                            Birthday Celebration
                          </SelectItem>
                          <SelectItem value="anniversary">
                            Anniversary Party
                          </SelectItem>
                          <SelectItem value="seminar">
                            Seminar/Workshop
                          </SelectItem>
                          <SelectItem value="networking">
                            Networking Event
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="starttime"
                        className="text-base font-medium"
                      >
                        Start Time
                      </Label>
                      <Input
                        id="starttime"
                        type="time"
                        value={bookingData.eventStartTime || ""}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            eventStartTime: e.target.value,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="endtime"
                        className="text-base font-medium"
                      >
                        End Time
                      </Label>
                      <Input
                        id="endtime"
                        type="time"
                        value={bookingData.eventEndTime || ""}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            eventEndTime: e.target.value,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="attendees"
                        className="text-base font-medium"
                      >
                        Expected Attendees
                      </Label>
                      <Select
                        value={bookingData.attendees?.toString() || ""}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({
                            ...prev,
                            attendees: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Number of attendees" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            {
                              length: Math.min(
                                selectedService.capacity / 5,
                                20,
                              ),
                            },
                            (_, i) => {
                              const count = (i + 1) * 5;
                              return (
                                <SelectItem
                                  key={count}
                                  value={count.toString()}
                                >
                                  {count} People
                                </SelectItem>
                              );
                            },
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedService.setup_options && (
                      <div>
                        <Label className="text-base font-medium">
                          Available Setup Options
                        </Label>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {selectedService.setup_options.map(
                              (option, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {option}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Facilities Details */}
                {selectedCategory === "facilities" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="servicedate"
                        className="text-base font-medium"
                      >
                        Service Date
                      </Label>
                      <Input
                        id="servicedate"
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={
                          bookingData.serviceDate
                            ? format(bookingData.serviceDate, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            serviceDate: e.target.value
                              ? new Date(e.target.value)
                              : undefined,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="servicetime"
                        className="text-base font-medium"
                      >
                        Preferred Time
                      </Label>
                      <Select
                        value={bookingData.serviceTime || ""}
                        onValueChange={(value) =>
                          setBookingData((prev) => ({
                            ...prev,
                            serviceTime: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const hour = i + 8; // Start from 8 AM
                            const timeString = `${hour < 10 ? "0" : ""}${hour}:00`;
                            const displayTime =
                              hour > 12
                                ? `${hour - 12}:00 PM`
                                : `${hour}:00 ${hour === 12 ? "PM" : "AM"}`;
                            return (
                              <SelectItem key={timeString} value={timeString}>
                                {displayTime}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedService.services && (
                      <div className="md:col-span-2">
                        <Label className="text-base font-medium">
                          Included Services
                        </Label>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                          <div className="grid md:grid-cols-2 gap-2">
                            {selectedService.services.map((service, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-700">
                                  {service}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Special Requests */}
                <div>
                  <Label htmlFor="requests" className="text-base font-medium">
                    Special Requests & Preferences
                  </Label>
                  <Textarea
                    id="requests"
                    placeholder="Please share any specific requirements, dietary restrictions, accessibility needs, or special preferences..."
                    value={bookingData.specialRequests || ""}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        specialRequests: e.target.value,
                      }))
                    }
                    rows={4}
                    className="mt-2"
                  />
                </div>

                {/* Total Amount Display */}
                {bookingData.totalAmount > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-semibold text-gray-900">
                          Estimated Total:
                        </span>
                        {selectedCategory === "accommodation" &&
                          bookingData.checkIn &&
                          bookingData.checkOut && (
                            <p className="text-sm text-gray-600 mt-1">
                              {Math.ceil(
                                (bookingData.checkOut.getTime() -
                                  bookingData.checkIn.getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              night(s) × {formatCurrency(selectedService.price)}{" "}
                              per night
                            </p>
                          )}
                      </div>
                      <span className="text-3xl font-bold text-green-600">
                        {formatCurrency(bookingData.totalAmount)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-8">
                  <Button variant="outline" onClick={handleBack} size="lg">
                    ← {t("booking.backToServices")}
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    disabled={
                      (selectedCategory === "accommodation" &&
                        (!bookingData.checkIn || !bookingData.checkOut)) ||
                      (selectedCategory === "dining" &&
                        (!bookingData.diningDate || !bookingData.diningTime)) ||
                      (selectedCategory === "events" &&
                        (!bookingData.eventDate ||
                          !bookingData.eventStartTime)) ||
                      (selectedCategory === "facilities" &&
                        (!bookingData.serviceDate || !bookingData.serviceTime))
                    }
                  >
                    {t("booking.continueToGuestInfo")} →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Guest Information */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t("booking.guestInformation")}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t("booking.provideDetails")}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="firstname"
                      className="text-base font-medium"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstname"
                      value={bookingData.guestInfo.firstName}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestInfo: {
                            ...prev.guestInfo,
                            firstName: e.target.value,
                          },
                        }))
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastname" className="text-base font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastname"
                      value={bookingData.guestInfo.lastName}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestInfo: {
                            ...prev.guestInfo,
                            lastName: e.target.value,
                          },
                        }))
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.guestInfo.email}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestInfo: {
                            ...prev.guestInfo,
                            email: e.target.value,
                          },
                        }))
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+256 700 000 000"
                      value={bookingData.guestInfo.phone}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestInfo: {
                            ...prev.guestInfo,
                            phone: e.target.value,
                          },
                        }))
                      }
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-base font-medium">
                      Country *
                    </Label>
                    <Select
                      value={bookingData.guestInfo.country}
                      onValueChange={(value) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestInfo: { ...prev.guestInfo, country: value },
                        }))
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-base font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={bookingData.guestInfo.city}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestInfo: {
                            ...prev.guestInfo,
                            city: e.target.value,
                          },
                        }))
                      }
                      className="mt-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="nationality"
                      className="text-base font-medium"
                    >
                      Nationality
                    </Label>
                    <Input
                      id="nationality"
                      value={bookingData.guestInfo.nationality}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          guestInfo: {
                            ...prev.guestInfo,
                            nationality: e.target.value,
                          },
                        }))
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">
                        Privacy & Security
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your personal information is securely handled in
                        accordance with our privacy policy and will only be used
                        for your reservation and communication purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <Button variant="outline" onClick={handleBack} size="lg">
                    ← Back to Details
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    disabled={
                      !bookingData.guestInfo.firstName ||
                      !bookingData.guestInfo.lastName ||
                      !bookingData.guestInfo.email ||
                      !bookingData.guestInfo.phone
                    }
                  >
                    {t("booking.reviewBooking")} →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation & Contact */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {t("booking.bookingConfirmation")}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t("booking.reviewBooking")}
                  </p>
                </div>

                {/* Comprehensive Booking Summary */}
                <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-100">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center">
                      <Award className="h-6 w-6 text-blue-600 mr-2" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Service Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Service:</span>
                              <span className="font-medium">
                                {selectedService?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium capitalize">
                                {selectedCategory}
                              </span>
                            </div>

                            {selectedCategory === "accommodation" &&
                              bookingData.checkIn &&
                              bookingData.checkOut && (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Check-in:
                                    </span>
                                    <span className="font-medium">
                                      {format(
                                        bookingData.checkIn,
                                        "EEE, MMM dd, yyyy",
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Check-out:
                                    </span>
                                    <span className="font-medium">
                                      {format(
                                        bookingData.checkOut,
                                        "EEE, MMM dd, yyyy",
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Guests:
                                    </span>
                                    <span className="font-medium">
                                      {bookingData.adults} adult(s),{" "}
                                      {bookingData.children} child(ren)
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Duration:
                                    </span>
                                    <span className="font-medium">
                                      {Math.ceil(
                                        (bookingData.checkOut.getTime() -
                                          bookingData.checkIn.getTime()) /
                                          (1000 * 60 * 60 * 24),
                                      )}{" "}
                                      night(s)
                                    </span>
                                  </div>
                                </>
                              )}

                            {selectedCategory === "dining" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Date:</span>
                                  <span className="font-medium">
                                    {bookingData.diningDate &&
                                      format(
                                        bookingData.diningDate,
                                        "EEE, MMM dd, yyyy",
                                      )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Time:</span>
                                  <span className="font-medium">
                                    {bookingData.diningTime}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Party Size:
                                  </span>
                                  <span className="font-medium">
                                    {bookingData.partySize} guest(s)
                                  </span>
                                </div>
                              </>
                            )}

                            {selectedCategory === "events" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Date:</span>
                                  <span className="font-medium">
                                    {bookingData.eventDate &&
                                      format(
                                        bookingData.eventDate,
                                        "EEE, MMM dd, yyyy",
                                      )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Time:</span>
                                  <span className="font-medium">
                                    {bookingData.eventStartTime} -{" "}
                                    {bookingData.eventEndTime}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Event Type:
                                  </span>
                                  <span className="font-medium">
                                    {bookingData.eventType}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Attendees:
                                  </span>
                                  <span className="font-medium">
                                    {bookingData.attendees} people
                                  </span>
                                </div>
                              </>
                            )}

                            {selectedCategory === "facilities" && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Date:</span>
                                  <span className="font-medium">
                                    {bookingData.serviceDate &&
                                      format(
                                        bookingData.serviceDate,
                                        "EEE, MMM dd, yyyy",
                                      )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Time:</span>
                                  <span className="font-medium">
                                    {bookingData.serviceTime}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Guest Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Name:</span>
                              <span className="font-medium">
                                {bookingData.guestInfo.firstName}{" "}
                                {bookingData.guestInfo.lastName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">
                                {bookingData.guestInfo.email}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">
                                {bookingData.guestInfo.phone}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Country:</span>
                              <span className="font-medium">
                                {bookingData.guestInfo.country}
                              </span>
                            </div>
                            {bookingData.guestInfo.city && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">City:</span>
                                <span className="font-medium">
                                  {bookingData.guestInfo.city}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {bookingData.specialRequests && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Special Requests
                          </h4>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                            {bookingData.specialRequests}
                          </p>
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">
                            Estimated Total:
                          </span>
                          <span className="text-3xl font-bold text-blue-600">
                            {formatCurrency(bookingData.totalAmount)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          *Final pricing will be confirmed upon availability
                          check
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    What Happens Next?
                  </h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold min-w-0">1.</span>
                      <span>
                        Your booking request will be submitted to our
                        reservations team
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold min-w-0">2.</span>
                      <span>
                        We will check availability and contact you within 24
                        hours
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold min-w-0">3.</span>
                      <span>
                        Upon confirmation, we'll send payment instructions and
                        booking details
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold min-w-0">4.</span>
                      <span>
                        Your reservation will be secured once payment is
                        received
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Checkbox id="terms" required />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    I acknowledge that this is a booking request and understand
                    that availability is subject to confirmation. I agree to the{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>{" "}
                    of Armaflex Hotel.
                  </Label>
                </div>

                <div className="flex justify-between pt-8">
                  <Button variant="outline" onClick={handleBack} size="lg">
                    ← Back to Guest Info
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </div>
                    ) : (
                      <>
                        <span>{t("booking.submitBookingRequest")}</span>
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hotel Rating Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("booking.rateHotel")}
                  </h3>
                  <p className="text-gray-600">{t("booking.rateHotelDesc")}</p>
                </div>
                <Button
                  onClick={() => setShowRatingForm(!showRatingForm)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {showRatingForm ? "Hide Rating Form" : "Rate Our Hotel"}
                </Button>
              </div>

              {showRatingForm && (
                <div className="mt-8 bg-white rounded-lg p-6 border">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          {t("booking.overallRating")}
                        </Label>
                        <StarRating
                          value={hotelRating.overall}
                          onChange={(rating) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              overall: rating,
                            }))
                          }
                          size="w-8 h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          {t("booking.roomQuality")}
                        </Label>
                        <StarRating
                          value={hotelRating.roomQuality}
                          onChange={(rating) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              roomQuality: rating,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          {t("booking.serviceQuality")}
                        </Label>
                        <StarRating
                          value={hotelRating.service}
                          onChange={(rating) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              service: rating,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          {t("booking.cleanliness")}
                        </Label>
                        <StarRating
                          value={hotelRating.cleanliness}
                          onChange={(rating) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              cleanliness: rating,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          {t("booking.location")}
                        </Label>
                        <StarRating
                          value={hotelRating.location}
                          onChange={(rating) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              location: rating,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          {t("booking.valueForMoney")}
                        </Label>
                        <StarRating
                          value={hotelRating.valueForMoney}
                          onChange={(rating) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              valueForMoney: rating,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="guestName"
                          className="text-base font-medium"
                        >
                          Your Name
                        </Label>
                        <Input
                          id="guestName"
                          value={hotelRating.guestName}
                          onChange={(e) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              guestName: e.target.value,
                            }))
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="guestEmail"
                          className="text-base font-medium"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          value={hotelRating.email}
                          onChange={(e) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="review"
                          className="text-base font-medium"
                        >
                          {t("booking.writeReview")}
                        </Label>
                        <Textarea
                          id="review"
                          placeholder="Share your experience with us..."
                          value={hotelRating.review}
                          onChange={(e) =>
                            setHotelRating((prev) => ({
                              ...prev,
                              review: e.target.value,
                            }))
                          }
                          rows={4}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Label className="text-base font-medium">
                          {t("booking.wouldRecommend")}
                        </Label>
                        <div className="flex space-x-4">
                          <Button
                            variant={
                              hotelRating.wouldRecommend ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setHotelRating((prev) => ({
                                ...prev,
                                wouldRecommend: true,
                              }))
                            }
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Yes
                          </Button>
                          <Button
                            variant={
                              !hotelRating.wouldRecommend
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setHotelRating((prev) => ({
                                ...prev,
                                wouldRecommend: false,
                              }))
                            }
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            No
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={handleRatingSubmit}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {t("booking.submitReview")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Testimonials Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("booking.testimonials")}
                  </h3>
                  <p className="text-gray-600">{t("booking.whatGuestsSay")}</p>
                </div>
                <Button
                  onClick={() => setShowTestimonials(!showTestimonials)}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {showTestimonials ? "Hide Reviews" : "Read Reviews"}
                </Button>
              </div>

              {showTestimonials && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              )}

              {!showTestimonials && (
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">856</div>
                    <div className="text-sm text-gray-600">Total Reviews</div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-3xl font-bold text-yellow-500">
                        4.2
                      </span>
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="flex flex-col items-center space-x-2">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">Would Recommend</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                {t("booking.needAssistance")}
              </h3>
              <p className="text-blue-100 mb-6">
                {t("booking.reservationsTeamHelp")}
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Phone className="h-8 w-8 text-blue-200" />
                  <div>
                    <div className="font-semibold">{t("booking.callUs")}</div>
                    <div className="text-blue-200 text-sm">+256 392004134</div>
                    <div className="text-blue-200 text-sm">+256 761036070</div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Mail className="h-8 w-8 text-blue-200" />
                  <div>
                    <div className="font-semibold">{t("booking.emailUs")}</div>
                    <div className="text-blue-200 text-sm">
                      info@armaflexhotel.com
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <MapPin className="h-8 w-8 text-blue-200" />
                  <div>
                    <div className="font-semibold">{t("booking.visitUs")}</div>
                    <div className="text-blue-200 text-sm">
                      Jinja Camp, Juba Road
                    </div>
                    <div className="text-blue-200 text-sm">
                      Lira City West Division
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
