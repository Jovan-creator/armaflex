import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  HeartOff,
  Award,
  Gift,
  MessageSquare,
  FileText,
  Image,
  Camera,
  CreditCard,
  User,
  UserCheck,
  UserPlus,
  UserX,
  Shield,
  Crown,
  Gem,
  ThumbsUp,
  ThumbsDown,
  Flag,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Percent,
  Hash,
  AtSign,
  Globe,
  Smartphone,
  Wifi,
  Car,
  Utensils,
  Coffee,
  Dumbbell,
  Spa,
  Baby,
  PawPrint,
  Accessibility,
  Languages,
  Building,
  Bed,
  Bath,
  Tv,
  AirVent,
  Volume2,
  VolumeX,
  Settings,
  Send,
  Reply,
  Forward,
  Archive,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
  RefreshCw,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  CalendarDays,
  MapPinned,
  Navigation,
  Plane,
  Train,
  Bus,
  Taxi,
  PersonStanding,
  Luggage,
  Passport,
  IdCard,
  CreditCard as CardIcon,
  Banknote,
  Receipt,
  Calculator,
  Target,
  Zap,
  Timer,
  AlarmClock,
  Bell,
  BellRing,
  Notification,
  Megaphone,
  Radio,
  Rss,
  Broadcast,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Network,
  Server,
  Database,
  HardDrive,
  Monitor,
  Laptop,
  Tablet as TabletIcon,
  Mouse,
  Keyboard,
  Headphones,
  Speaker,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward as FF,
  Repeat,
  Repeat1,
  Shuffle,
  Volume,
  Volume1,
  Volume2 as Vol2,
  VolumeX as VolX,
} from "lucide-react";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  identification: {
    type: string;
    number: string;
    expiryDate: string;
    issuingCountry: string;
    verified: boolean;
    documents: DocumentFile[];
  };
  preferences: {
    roomType: string[];
    floor: string;
    bedType: string;
    smokingPreference: "smoking" | "non-smoking";
    amenities: string[];
    dietaryRestrictions: string[];
    languagePreference: string;
    communicationPreference: string[];
    accessibility: string[];
    specialRequests: string[];
  };
  loyaltyProgram: {
    member: boolean;
    tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
    points: number;
    memberSince: string;
    benefits: string[];
    expiryDate: string;
  };
  status: "active" | "inactive" | "vip" | "blacklisted";
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastStay: string;
  totalStays: number;
  totalSpent: number;
  averageRating: number;
  profilePicture?: string;
  marketingConsent: boolean;
  dataProcessingConsent: boolean;
}

interface StayHistory {
  id: string;
  guestId: string;
  reservationId: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  roomType: string;
  nights: number;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "refunded" | "cancelled";
  rating: number;
  review?: string;
  services: ServiceUsage[];
  complaints: Complaint[];
  compliments: Compliment[];
  specialEvents: SpecialEvent[];
}

interface ServiceUsage {
  id: string;
  serviceName: string;
  date: string;
  amount: number;
  quantity: number;
  notes?: string;
}

interface Complaint {
  id: string;
  date: string;
  category: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  resolution?: string;
  handledBy?: string;
}

interface Compliment {
  id: string;
  date: string;
  category: string;
  description: string;
  staffMentioned?: string[];
}

interface SpecialEvent {
  id: string;
  type: "birthday" | "anniversary" | "honeymoon" | "business" | "celebration";
  date: string;
  description: string;
  arrangements: string[];
}

interface Communication {
  id: string;
  guestId: string;
  type: "email" | "sms" | "phone" | "in-person" | "app";
  direction: "inbound" | "outbound";
  subject: string;
  content: string;
  timestamp: string;
  staff: string;
  status: "sent" | "delivered" | "read" | "responded";
  attachments: DocumentFile[];
}

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Feedback {
  id: string;
  guestId: string;
  stayId: string;
  overallRating: number;
  ratings: {
    service: number;
    cleanliness: number;
    location: number;
    value: number;
    amenities: number;
  };
  review: string;
  recommendations: string[];
  improvements: string[];
  wouldRecommend: boolean;
  submittedAt: string;
  status: "pending" | "published" | "hidden";
  response?: {
    content: string;
    respondedBy: string;
    respondedAt: string;
  };
}

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stayHistory, setStayHistory] = useState<StayHistory[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showCreateGuest, setShowCreateGuest] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("overview");

  const [newGuest, setNewGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    preferences: {
      roomType: [],
      floor: "any",
      bedType: "any",
      smokingPreference: "non-smoking" as const,
      amenities: [],
      dietaryRestrictions: [],
      languagePreference: "English",
      communicationPreference: ["email"],
      accessibility: [],
      specialRequests: [],
    },
    loyaltyProgram: {
      member: false,
      tier: "Bronze" as const,
      points: 0,
    },
    notes: "",
    tags: "",
    marketingConsent: false,
    dataProcessingConsent: true,
  });

  const [newCommunication, setNewCommunication] = useState({
    type: "email",
    subject: "",
    content: "",
  });

  // Mock data initialization
  useEffect(() => {
    const mockGuests: Guest[] = [
      {
        id: "1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1985-03-15",
        nationality: "American",
        address: {
          street: "123 Main Street, Apt 4B",
          city: "New York",
          state: "NY",
          country: "United States",
          zipCode: "10001",
        },
        emergencyContact: {
          name: "Michael Johnson",
          relationship: "Spouse",
          phone: "+1 (555) 123-4568",
        },
        identification: {
          type: "Passport",
          number: "123456789",
          expiryDate: "2028-03-15",
          issuingCountry: "United States",
          verified: true,
          documents: [],
        },
        preferences: {
          roomType: ["Deluxe", "Suite"],
          floor: "high",
          bedType: "King",
          smokingPreference: "non-smoking",
          amenities: ["wifi", "minibar", "room-service", "spa"],
          dietaryRestrictions: ["vegetarian"],
          languagePreference: "English",
          communicationPreference: ["email", "sms"],
          accessibility: [],
          specialRequests: ["Extra pillows", "Late checkout"],
        },
        loyaltyProgram: {
          member: true,
          tier: "Gold",
          points: 15420,
          memberSince: "2020-01-15",
          benefits: [
            "Room upgrades",
            "Late checkout",
            "Welcome amenities",
            "Priority service",
          ],
          expiryDate: "2025-12-31",
        },
        status: "vip",
        tags: ["repeat-guest", "business-traveler", "gold-member"],
        notes:
          "Prefers high floors. Celebrates anniversary in November. Excellent guest, very accommodating.",
        createdAt: "2020-01-15",
        updatedAt: "2024-12-27",
        lastStay: "2024-11-15",
        totalStays: 24,
        totalSpent: 28750,
        averageRating: 4.8,
        profilePicture: "/placeholder.svg",
        marketingConsent: true,
        dataProcessingConsent: true,
      },
      {
        id: "2",
        firstName: "Michael",
        lastName: "Chen",
        email: "m.chen@email.com",
        phone: "+1 (555) 987-6543",
        dateOfBirth: "1978-07-22",
        nationality: "Canadian",
        address: {
          street: "456 Oak Avenue",
          city: "Toronto",
          state: "ON",
          country: "Canada",
          zipCode: "M1A 1A1",
        },
        emergencyContact: {
          name: "Lisa Chen",
          relationship: "Sister",
          phone: "+1 (555) 987-6544",
        },
        identification: {
          type: "Driver's License",
          number: "ON123456789",
          expiryDate: "2027-07-22",
          issuingCountry: "Canada",
          verified: true,
          documents: [],
        },
        preferences: {
          roomType: ["Standard"],
          floor: "any",
          bedType: "Queen",
          smokingPreference: "non-smoking",
          amenities: ["wifi", "gym"],
          dietaryRestrictions: [],
          languagePreference: "English",
          communicationPreference: ["email"],
          accessibility: [],
          specialRequests: ["Quiet room"],
        },
        loyaltyProgram: {
          member: true,
          tier: "Silver",
          points: 5680,
          memberSince: "2022-03-10",
          benefits: ["Points earning", "Member rates", "Free wifi"],
          expiryDate: "2025-12-31",
        },
        status: "active",
        tags: ["business-traveler", "silver-member"],
        notes:
          "Travels frequently for business. Prefers quiet rooms away from elevators.",
        createdAt: "2022-03-10",
        updatedAt: "2024-12-20",
        lastStay: "2024-12-20",
        totalStays: 8,
        totalSpent: 4250,
        averageRating: 4.5,
        marketingConsent: true,
        dataProcessingConsent: true,
      },
      {
        id: "3",
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@email.com",
        phone: "+1 (555) 456-7890",
        dateOfBirth: "1992-11-08",
        nationality: "British",
        address: {
          street: "789 Pine Road",
          city: "London",
          state: "",
          country: "United Kingdom",
          zipCode: "SW1A 1AA",
        },
        emergencyContact: {
          name: "James Davis",
          relationship: "Father",
          phone: "+44 20 7946 0958",
        },
        identification: {
          type: "Passport",
          number: "987654321",
          expiryDate: "2029-11-08",
          issuingCountry: "United Kingdom",
          verified: true,
          documents: [],
        },
        preferences: {
          roomType: ["Presidential Suite"],
          floor: "high",
          bedType: "King",
          smokingPreference: "non-smoking",
          amenities: ["spa", "concierge", "butler", "champagne"],
          dietaryRestrictions: ["gluten-free"],
          languagePreference: "English",
          communicationPreference: ["email", "app"],
          accessibility: [],
          specialRequests: [
            "Fresh flowers",
            "Champagne on arrival",
            "City view",
          ],
        },
        loyaltyProgram: {
          member: true,
          tier: "Platinum",
          points: 45890,
          memberSince: "2019-05-20",
          benefits: [
            "Room upgrades",
            "Personal concierge",
            "Airport transfers",
            "Welcome gifts",
            "Late checkout",
          ],
          expiryDate: "2025-12-31",
        },
        status: "vip",
        tags: ["vip", "luxury-traveler", "platinum-member", "anniversary"],
        notes:
          "VIP guest. Celebrating anniversary. Requires special arrangements and premium services.",
        createdAt: "2019-05-20",
        updatedAt: "2024-12-15",
        lastStay: "2024-12-15",
        totalStays: 18,
        totalSpent: 87500,
        averageRating: 4.9,
        profilePicture: "/placeholder.svg",
        marketingConsent: true,
        dataProcessingConsent: true,
      },
      {
        id: "4",
        firstName: "Robert",
        lastName: "Wilson",
        email: "r.wilson@email.com",
        phone: "+1 (555) 321-9876",
        dateOfBirth: "1965-04-12",
        nationality: "American",
        address: {
          street: "321 Elm Street",
          city: "Chicago",
          state: "IL",
          country: "United States",
          zipCode: "60601",
        },
        emergencyContact: {
          name: "Mary Wilson",
          relationship: "Spouse",
          phone: "+1 (555) 321-9877",
        },
        identification: {
          type: "Driver's License",
          number: "IL987654321",
          expiryDate: "2026-04-12",
          issuingCountry: "United States",
          verified: true,
          documents: [],
        },
        preferences: {
          roomType: ["Family Suite"],
          floor: "low",
          bedType: "Twin",
          smokingPreference: "non-smoking",
          amenities: ["wifi", "pool", "kids-club"],
          dietaryRestrictions: [],
          languagePreference: "English",
          communicationPreference: ["phone", "email"],
          accessibility: ["wheelchair-accessible"],
          specialRequests: ["Ground floor", "Near elevator", "Extra towels"],
        },
        loyaltyProgram: {
          member: true,
          tier: "Bronze",
          points: 1250,
          memberSince: "2023-08-15",
          benefits: ["Points earning", "Member rates"],
          expiryDate: "2025-12-31",
        },
        status: "active",
        tags: ["family-traveler", "bronze-member", "accessibility"],
        notes:
          "Family traveler with accessibility needs. Requires ground floor accommodation.",
        createdAt: "2023-08-15",
        updatedAt: "2024-10-05",
        lastStay: "2024-10-05",
        totalStays: 3,
        totalSpent: 1890,
        averageRating: 4.2,
        marketingConsent: false,
        dataProcessingConsent: true,
      },
    ];

    const mockStayHistory: StayHistory[] = [
      {
        id: "1",
        guestId: "1",
        reservationId: "RES-001",
        checkInDate: "2024-11-15",
        checkOutDate: "2024-11-18",
        roomNumber: "401",
        roomType: "Presidential Suite",
        nights: 3,
        totalAmount: 2400,
        paymentStatus: "paid",
        rating: 5,
        review:
          "Exceptional service and beautiful room. The staff went above and beyond to make our anniversary special.",
        services: [
          {
            id: "1",
            serviceName: "Spa Treatment",
            date: "2024-11-16",
            amount: 150,
            quantity: 1,
          },
          {
            id: "2",
            serviceName: "Room Service",
            date: "2024-11-17",
            amount: 85,
            quantity: 2,
          },
          {
            id: "3",
            serviceName: "Champagne Service",
            date: "2024-11-15",
            amount: 120,
            quantity: 1,
          },
        ],
        complaints: [],
        compliments: [
          {
            id: "1",
            date: "2024-11-16",
            category: "Service",
            description: "Outstanding service from the concierge team",
            staffMentioned: ["Concierge"],
          },
        ],
        specialEvents: [
          {
            id: "1",
            type: "anniversary",
            date: "2024-11-15",
            description: "10th Wedding Anniversary",
            arrangements: ["Fresh flowers", "Champagne", "Special dinner"],
          },
        ],
      },
      {
        id: "2",
        guestId: "2",
        reservationId: "RES-002",
        checkInDate: "2024-12-20",
        checkOutDate: "2024-12-22",
        roomNumber: "205",
        roomType: "Standard Room",
        nights: 2,
        totalAmount: 300,
        paymentStatus: "paid",
        rating: 4,
        services: [
          {
            id: "4",
            serviceName: "Breakfast",
            date: "2024-12-21",
            amount: 25,
            quantity: 2,
          },
        ],
        complaints: [],
        compliments: [],
        specialEvents: [],
      },
    ];

    const mockCommunications: Communication[] = [
      {
        id: "1",
        guestId: "1",
        type: "email",
        direction: "outbound",
        subject: "Thank you for your stay - Anniversary Special",
        content:
          "Dear Sarah, Thank you for choosing our hotel for your anniversary celebration. We hope you enjoyed the special arrangements...",
        timestamp: "2024-11-19 10:30",
        staff: "Guest Services",
        status: "read",
        attachments: [],
      },
      {
        id: "2",
        guestId: "1",
        type: "email",
        direction: "inbound",
        subject: "Upcoming reservation inquiry",
        content:
          "Hi, I would like to make a reservation for next month. Could you please check availability for the presidential suite?",
        timestamp: "2024-12-01 14:20",
        staff: "Reservations",
        status: "responded",
        attachments: [],
      },
    ];

    const mockFeedbacks: Feedback[] = [
      {
        id: "1",
        guestId: "1",
        stayId: "1",
        overallRating: 5,
        ratings: {
          service: 5,
          cleanliness: 5,
          location: 5,
          value: 4,
          amenities: 5,
        },
        review:
          "Absolutely perfect stay! The staff was incredibly attentive and the room was beautiful. The anniversary arrangements exceeded our expectations.",
        recommendations: [
          "Staff service",
          "Room quality",
          "Special event handling",
        ],
        improvements: ["Perhaps more dining options for room service"],
        wouldRecommend: true,
        submittedAt: "2024-11-20",
        status: "published",
        response: {
          content:
            "Thank you so much for your wonderful review! We're delighted you enjoyed your anniversary celebration with us.",
          respondedBy: "General Manager",
          respondedAt: "2024-11-21",
        },
      },
    ];

    setGuests(mockGuests);
    setStayHistory(mockStayHistory);
    setCommunications(mockCommunications);
    setFeedbacks(mockFeedbacks);
  }, []);

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      guest.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesStatus =
      filterStatus === "all" || guest.status === filterStatus;
    const matchesTier =
      filterTier === "all" ||
      (guest.loyaltyProgram.member && guest.loyaltyProgram.tier === filterTier);

    return matchesSearch && matchesStatus && matchesTier;
  });

  const sortedGuests = [...filteredGuests].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        );
      case "lastStay":
        return (
          new Date(b.lastStay || 0).getTime() -
          new Date(a.lastStay || 0).getTime()
        );
      case "totalSpent":
        return b.totalSpent - a.totalSpent;
      case "totalStays":
        return b.totalStays - a.totalStays;
      case "rating":
        return b.averageRating - a.averageRating;
      default:
        return 0;
    }
  });

  const guestStats = {
    total: guests.length,
    active: guests.filter((g) => g.status === "active").length,
    vip: guests.filter((g) => g.status === "vip").length,
    loyaltyMembers: guests.filter((g) => g.loyaltyProgram.member).length,
    averageSpent:
      guests.reduce((sum, g) => sum + g.totalSpent, 0) / guests.length,
    averageRating:
      guests.reduce((sum, g) => sum + g.averageRating, 0) / guests.length,
    totalRevenue: guests.reduce((sum, g) => sum + g.totalSpent, 0),
  };

  const loyaltyStats = {
    bronze: guests.filter(
      (g) => g.loyaltyProgram.member && g.loyaltyProgram.tier === "Bronze",
    ).length,
    silver: guests.filter(
      (g) => g.loyaltyProgram.member && g.loyaltyProgram.tier === "Silver",
    ).length,
    gold: guests.filter(
      (g) => g.loyaltyProgram.member && g.loyaltyProgram.tier === "Gold",
    ).length,
    platinum: guests.filter(
      (g) => g.loyaltyProgram.member && g.loyaltyProgram.tier === "Platinum",
    ).length,
    diamond: guests.filter(
      (g) => g.loyaltyProgram.member && g.loyaltyProgram.tier === "Diamond",
    ).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "vip":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "blacklisted":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Silver":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Platinum":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Diamond":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return <Award className="h-4 w-4" />;
      case "Silver":
        return <Star className="h-4 w-4" />;
      case "Gold":
        return <Crown className="h-4 w-4" />;
      case "Platinum":
        return <Gem className="h-4 w-4" />;
      case "Diamond":
        return <Crown className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const createGuest = () => {
    const guest: Guest = {
      id: Date.now().toString(),
      firstName: newGuest.firstName,
      lastName: newGuest.lastName,
      email: newGuest.email,
      phone: newGuest.phone,
      dateOfBirth: newGuest.dateOfBirth,
      nationality: newGuest.nationality,
      address: newGuest.address,
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      identification: {
        type: "",
        number: "",
        expiryDate: "",
        issuingCountry: "",
        verified: false,
        documents: [],
      },
      preferences: newGuest.preferences,
      loyaltyProgram: {
        member: newGuest.loyaltyProgram.member,
        tier: newGuest.loyaltyProgram.tier,
        points: newGuest.loyaltyProgram.points,
        memberSince: new Date().toISOString().split("T")[0],
        benefits: [],
        expiryDate: "",
      },
      status: "active",
      tags: newGuest.tags ? newGuest.tags.split(",").map((t) => t.trim()) : [],
      notes: newGuest.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      lastStay: "",
      totalStays: 0,
      totalSpent: 0,
      averageRating: 0,
      marketingConsent: newGuest.marketingConsent,
      dataProcessingConsent: newGuest.dataProcessingConsent,
    };

    setGuests((prev) => [guest, ...prev]);
    setShowCreateGuest(false);
    // Reset form
    setNewGuest({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationality: "",
      dateOfBirth: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      preferences: {
        roomType: [],
        floor: "any",
        bedType: "any",
        smokingPreference: "non-smoking",
        amenities: [],
        dietaryRestrictions: [],
        languagePreference: "English",
        communicationPreference: ["email"],
        accessibility: [],
        specialRequests: [],
      },
      loyaltyProgram: {
        member: false,
        tier: "Bronze",
        points: 0,
      },
      notes: "",
      tags: "",
      marketingConsent: false,
      dataProcessingConsent: true,
    });
  };

  const sendCommunication = () => {
    if (!selectedGuest) return;

    const communication: Communication = {
      id: Date.now().toString(),
      guestId: selectedGuest.id,
      type: newCommunication.type as any,
      direction: "outbound",
      subject: newCommunication.subject,
      content: newCommunication.content,
      timestamp: new Date().toLocaleString(),
      staff: "Current User",
      status: "sent",
      attachments: [],
    };

    setCommunications((prev) => [communication, ...prev]);
    setShowCommunication(false);
    setNewCommunication({
      type: "email",
      subject: "",
      content: "",
    });
  };

  const guestStayHistory = selectedGuest
    ? stayHistory.filter((stay) => stay.guestId === selectedGuest.id)
    : [];

  const guestCommunications = selectedGuest
    ? communications.filter((comm) => comm.guestId === selectedGuest.id)
    : [];

  const guestFeedbacks = selectedGuest
    ? feedbacks.filter((feedback) => feedback.guestId === selectedGuest.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Guest Management
          </h1>
          <p className="text-muted-foreground">
            Comprehensive guest profiles, preferences, and history tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreateGuest} onOpenChange={setShowCreateGuest}>
            <DialogTrigger asChild>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
                <DialogDescription>
                  Create a comprehensive guest profile with preferences and
                  contact information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={newGuest.firstName}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={newGuest.lastName}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newGuest.email}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newGuest.phone}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={newGuest.dateOfBirth}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={newGuest.nationality}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            nationality: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={newGuest.address.street}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              street: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newGuest.address.city}
                          onChange={(e) =>
                            setNewGuest((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                city: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={newGuest.address.state}
                          onChange={(e) =>
                            setNewGuest((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                state: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={newGuest.address.country}
                          onChange={(e) =>
                            setNewGuest((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                country: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          value={newGuest.address.zipCode}
                          onChange={(e) =>
                            setNewGuest((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                zipCode: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roomType">Preferred Room Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="presidential">
                            Presidential
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bedType">Bed Preference</Label>
                      <Select
                        value={newGuest.preferences.bedType}
                        onValueChange={(value) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              bedType: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="twin">Twin</SelectItem>
                          <SelectItem value="queen">Queen</SelectItem>
                          <SelectItem value="king">King</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="floor">Floor Preference</Label>
                      <Select
                        value={newGuest.preferences.floor}
                        onValueChange={(value) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            preferences: { ...prev.preferences, floor: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Floor</SelectItem>
                          <SelectItem value="low">Low Floor (1-3)</SelectItem>
                          <SelectItem value="mid">Mid Floor (4-7)</SelectItem>
                          <SelectItem value="high">High Floor (8+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="smoking">Smoking Preference</Label>
                      <Select
                        value={newGuest.preferences.smokingPreference}
                        onValueChange={(value: "smoking" | "non-smoking") =>
                          setNewGuest((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              smokingPreference: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="non-smoking">
                            Non-Smoking
                          </SelectItem>
                          <SelectItem value="smoking">Smoking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Loyalty Program */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Loyalty Program
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="loyaltyMember"
                        checked={newGuest.loyaltyProgram.member}
                        onCheckedChange={(checked) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            loyaltyProgram: {
                              ...prev.loyaltyProgram,
                              member: checked,
                            },
                          }))
                        }
                      />
                      <Label htmlFor="loyaltyMember">
                        Loyalty Program Member
                      </Label>
                    </div>
                    {newGuest.loyaltyProgram.member && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tier">Tier</Label>
                          <Select
                            value={newGuest.loyaltyProgram.tier}
                            onValueChange={(value: any) =>
                              setNewGuest((prev) => ({
                                ...prev,
                                loyaltyProgram: {
                                  ...prev.loyaltyProgram,
                                  tier: value,
                                },
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bronze">Bronze</SelectItem>
                              <SelectItem value="Silver">Silver</SelectItem>
                              <SelectItem value="Gold">Gold</SelectItem>
                              <SelectItem value="Platinum">Platinum</SelectItem>
                              <SelectItem value="Diamond">Diamond</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="points">Points</Label>
                          <Input
                            id="points"
                            type="number"
                            value={newGuest.loyaltyProgram.points}
                            onChange={(e) =>
                              setNewGuest((prev) => ({
                                ...prev,
                                loyaltyProgram: {
                                  ...prev.loyaltyProgram,
                                  points: parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newGuest.tags}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            tags: e.target.value,
                          }))
                        }
                        placeholder="e.g., business-traveler, vip, anniversary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newGuest.notes}
                        onChange={(e) =>
                          setNewGuest((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Additional notes about the guest..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="marketingConsent"
                          checked={newGuest.marketingConsent}
                          onCheckedChange={(checked) =>
                            setNewGuest((prev) => ({
                              ...prev,
                              marketingConsent: checked,
                            }))
                          }
                        />
                        <Label htmlFor="marketingConsent">
                          Marketing Communications Consent
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="dataProcessingConsent"
                          checked={newGuest.dataProcessingConsent}
                          onCheckedChange={(checked) =>
                            setNewGuest((prev) => ({
                              ...prev,
                              dataProcessingConsent: checked,
                            }))
                          }
                        />
                        <Label htmlFor="dataProcessingConsent">
                          Data Processing Consent (Required)
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateGuest(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createGuest}
                  className="bg-hotel-500 hover:bg-hotel-600"
                >
                  Create Guest Profile
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestStats.total}</div>
            <p className="text-xs text-muted-foreground">Registered profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Guests</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {guestStats.vip}
            </div>
            <p className="text-xs text-muted-foreground">Premium members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loyalty Members
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {guestStats.loyaltyMembers}
            </div>
            <p className="text-xs text-muted-foreground">
              Program participants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${guestStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time guest revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {guestStats.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Guest satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="communication">Communications</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search guests by name, email, phone, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blacklisted">Blacklisted</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterTier} onValueChange={setFilterTier}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="lastStay">Last Stay</SelectItem>
                    <SelectItem value="totalSpent">Total Spent</SelectItem>
                    <SelectItem value="totalStays">Total Stays</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Directory */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Guest List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Guest Directory ({sortedGuests.length} found)
                  </CardTitle>
                  <CardDescription>
                    Registered guest profiles and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    {viewMode === "grid" ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {sortedGuests.map((guest) => (
                          <div
                            key={guest.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                              selectedGuest?.id === guest.id
                                ? "border-hotel-500 bg-hotel-50/50"
                                : ""
                            }`}
                            onClick={() => setSelectedGuest(guest)}
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={guest.profilePicture}
                                  alt={`${guest.firstName} ${guest.lastName}`}
                                />
                                <AvatarFallback>
                                  {guest.firstName[0]}
                                  {guest.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium truncate">
                                    {guest.firstName} {guest.lastName}
                                  </h4>
                                  <Badge
                                    className={getStatusColor(guest.status)}
                                    variant="outline"
                                  >
                                    {guest.status}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">
                                      {guest.email}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{guest.phone}</span>
                                  </div>
                                  {guest.loyaltyProgram.member && (
                                    <div className="flex items-center gap-1">
                                      {getTierIcon(guest.loyaltyProgram.tier)}
                                      <span>
                                        {guest.loyaltyProgram.tier} •{" "}
                                        {guest.loyaltyProgram.points} points
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="text-xs text-muted-foreground">
                                    {guest.totalStays} stays • $
                                    {guest.totalSpent.toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs">
                                      {guest.averageRating.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                                {guest.tags.length > 0 && (
                                  <div className="flex gap-1 mt-2">
                                    {guest.tags.slice(0, 2).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                    {guest.tags.length > 2 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        +{guest.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {sortedGuests.map((guest) => (
                          <div
                            key={guest.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                              selectedGuest?.id === guest.id
                                ? "border-hotel-500 bg-hotel-50/50"
                                : ""
                            }`}
                            onClick={() => setSelectedGuest(guest)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={guest.profilePicture}
                                    alt={`${guest.firstName} ${guest.lastName}`}
                                  />
                                  <AvatarFallback>
                                    {guest.firstName[0]}
                                    {guest.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {guest.firstName} {guest.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {guest.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {guest.loyaltyProgram.member && (
                                  <Badge
                                    className={getTierColor(
                                      guest.loyaltyProgram.tier,
                                    )}
                                    variant="outline"
                                  >
                                    {getTierIcon(guest.loyaltyProgram.tier)}
                                    {guest.loyaltyProgram.tier}
                                  </Badge>
                                )}
                                <Badge
                                  className={getStatusColor(guest.status)}
                                  variant="outline"
                                >
                                  {guest.status}
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                  {guest.totalStays} stays
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Guest Details */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedGuest ? (
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="preferences">
                          Preferences
                        </TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={selectedGuest.profilePicture}
                              alt={`${selectedGuest.firstName} ${selectedGuest.lastName}`}
                            />
                            <AvatarFallback>
                              {selectedGuest.firstName[0]}
                              {selectedGuest.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {selectedGuest.firstName} {selectedGuest.lastName}
                            </h3>
                            <p className="text-muted-foreground">
                              {selectedGuest.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={getStatusColor(selectedGuest.status)}
                                variant="outline"
                              >
                                {selectedGuest.status}
                              </Badge>
                              {selectedGuest.loyaltyProgram.member && (
                                <Badge
                                  className={getTierColor(
                                    selectedGuest.loyaltyProgram.tier,
                                  )}
                                  variant="outline"
                                >
                                  {getTierIcon(
                                    selectedGuest.loyaltyProgram.tier,
                                  )}
                                  {selectedGuest.loyaltyProgram.tier}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Phone:
                            </span>
                            <span>{selectedGuest.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Nationality:
                            </span>
                            <span>{selectedGuest.nationality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Member Since:
                            </span>
                            <span>
                              {selectedGuest.loyaltyProgram.member
                                ? selectedGuest.loyaltyProgram.memberSince
                                : "Not a member"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Total Stays:
                            </span>
                            <span>{selectedGuest.totalStays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Total Spent:
                            </span>
                            <span>
                              ${selectedGuest.totalSpent.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Average Rating:
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>
                                {selectedGuest.averageRating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          {selectedGuest.loyaltyProgram.member && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Loyalty Points:
                              </span>
                              <span>
                                {selectedGuest.loyaltyProgram.points.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {selectedGuest.tags.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <Label className="text-sm font-medium">
                                Tags
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedGuest.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {selectedGuest.notes && (
                          <>
                            <Separator />
                            <div>
                              <Label className="text-sm font-medium">
                                Notes
                              </Label>
                              <p className="text-sm mt-1">
                                {selectedGuest.notes}
                              </p>
                            </div>
                          </>
                        )}
                      </TabsContent>

                      <TabsContent value="history" className="space-y-4">
                        <div className="space-y-3">
                          {guestStayHistory.length > 0 ? (
                            guestStayHistory.map((stay) => (
                              <div
                                key={stay.id}
                                className="p-3 border rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium">
                                      Room {stay.roomNumber} - {stay.roomType}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {stay.checkInDate} to {stay.checkOutDate}{" "}
                                      ({stay.nights} nights)
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      ${stay.totalAmount}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm">
                                        {stay.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {stay.review && (
                                  <p className="text-sm text-muted-foreground italic">
                                    "{stay.review}"
                                  </p>
                                )}
                                {stay.services.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium">
                                      Services Used:
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                      {stay.services
                                        .map((service) => service.serviceName)
                                        .join(", ")}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-center py-4">
                              No stay history available
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="preferences" className="space-y-4">
                        <div className="space-y-3 text-sm">
                          <div>
                            <Label className="font-medium">
                              Room Preferences
                            </Label>
                            <div className="mt-1 space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Room Type:
                                </span>
                                <span>
                                  {selectedGuest.preferences.roomType.join(
                                    ", ",
                                  ) || "Any"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Bed Type:
                                </span>
                                <span>{selectedGuest.preferences.bedType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Floor:
                                </span>
                                <span>{selectedGuest.preferences.floor}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Smoking:
                                </span>
                                <span>
                                  {selectedGuest.preferences.smokingPreference}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <Label className="font-medium">Amenities</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedGuest.preferences.amenities.map(
                                (amenity) => (
                                  <Badge
                                    key={amenity}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {amenity}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>

                          {selectedGuest.preferences.dietaryRestrictions
                            .length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <Label className="font-medium">
                                  Dietary Restrictions
                                </Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedGuest.preferences.dietaryRestrictions.map(
                                    (restriction) => (
                                      <Badge
                                        key={restriction}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {restriction}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {selectedGuest.preferences.accessibility.length >
                            0 && (
                            <>
                              <Separator />
                              <div>
                                <Label className="font-medium">
                                  Accessibility Needs
                                </Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedGuest.preferences.accessibility.map(
                                    (need) => (
                                      <Badge
                                        key={need}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {need}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {selectedGuest.preferences.specialRequests.length >
                            0 && (
                            <>
                              <Separator />
                              <div>
                                <Label className="font-medium">
                                  Special Requests
                                </Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedGuest.preferences.specialRequests.map(
                                    (request) => (
                                      <Badge
                                        key={request}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {request}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          <Separator />

                          <div>
                            <Label className="font-medium">Communication</Label>
                            <div className="mt-1 space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Language:
                                </span>
                                <span>
                                  {selectedGuest.preferences.languagePreference}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Preferred Channels:
                                </span>
                                <span>
                                  {selectedGuest.preferences.communicationPreference.join(
                                    ", ",
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="documents" className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <Label className="font-medium">
                                Identification
                              </Label>
                              <Badge
                                variant={
                                  selectedGuest.identification.verified
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {selectedGuest.identification.verified
                                  ? "Verified"
                                  : "Unverified"}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Type:
                                </span>
                                <span>
                                  {selectedGuest.identification.type ||
                                    "Not provided"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Number:
                                </span>
                                <span>
                                  {selectedGuest.identification.number ||
                                    "Not provided"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Expires:
                                </span>
                                <span>
                                  {selectedGuest.identification.expiryDate ||
                                    "Not provided"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Issuing Country:
                                </span>
                                <span>
                                  {selectedGuest.identification
                                    .issuingCountry || "Not provided"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 border rounded-lg">
                            <Label className="font-medium">
                              Document Files
                            </Label>
                            <div className="mt-2">
                              {selectedGuest.identification.documents.length >
                              0 ? (
                                <div className="space-y-2">
                                  {selectedGuest.identification.documents.map(
                                    (doc) => (
                                      <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-2 border rounded"
                                      >
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          <span className="text-sm">
                                            {doc.name}
                                          </span>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No documents uploaded
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Document
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a guest to view details
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {selectedGuest && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Dialog
                      open={showCommunication}
                      onOpenChange={setShowCommunication}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Send Communication</DialogTitle>
                          <DialogDescription>
                            Send a message to {selectedGuest.firstName}{" "}
                            {selectedGuest.lastName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="commType">Communication Type</Label>
                            <Select
                              value={newCommunication.type}
                              onValueChange={(value) =>
                                setNewCommunication((prev) => ({
                                  ...prev,
                                  type: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="phone">
                                  Phone Call
                                </SelectItem>
                                <SelectItem value="app">Mobile App</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                              id="subject"
                              value={newCommunication.subject}
                              onChange={(e) =>
                                setNewCommunication((prev) => ({
                                  ...prev,
                                  subject: e.target.value,
                                }))
                              }
                              placeholder="Message subject"
                            />
                          </div>
                          <div>
                            <Label htmlFor="content">Message Content</Label>
                            <Textarea
                              id="content"
                              value={newCommunication.content}
                              onChange={(e) =>
                                setNewCommunication((prev) => ({
                                  ...prev,
                                  content: e.target.value,
                                }))
                              }
                              placeholder="Type your message here..."
                              className="min-h-[120px]"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowCommunication(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={sendCommunication}
                            className="bg-hotel-500 hover:bg-hotel-600"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      New Reservation
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Archive className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          {/* Loyalty Program Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Bronze
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {loyaltyStats.bronze}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Silver
                    </p>
                    <p className="text-2xl font-bold text-gray-600">
                      {loyaltyStats.silver}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Gold
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {loyaltyStats.gold}
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Platinum
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {loyaltyStats.platinum}
                    </p>
                  </div>
                  <Gem className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Diamond
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {loyaltyStats.diamond}
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loyalty Program Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tier Benefits</CardTitle>
                <CardDescription>
                  Benefits and privileges by membership tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      tier: "Bronze",
                      benefits: ["Points earning", "Member rates"],
                      color: "text-orange-600",
                    },
                    {
                      tier: "Silver",
                      benefits: [
                        "All Bronze benefits",
                        "Free WiFi",
                        "Late checkout",
                      ],
                      color: "text-gray-600",
                    },
                    {
                      tier: "Gold",
                      benefits: [
                        "All Silver benefits",
                        "Room upgrades",
                        "Welcome amenities",
                      ],
                      color: "text-yellow-600",
                    },
                    {
                      tier: "Platinum",
                      benefits: [
                        "All Gold benefits",
                        "Personal concierge",
                        "Airport transfers",
                      ],
                      color: "text-blue-600",
                    },
                    {
                      tier: "Diamond",
                      benefits: [
                        "All Platinum benefits",
                        "Butler service",
                        "Exclusive access",
                      ],
                      color: "text-purple-600",
                    },
                  ].map((tierInfo) => (
                    <div key={tierInfo.tier} className="p-3 border rounded-lg">
                      <h4 className={`font-medium ${tierInfo.color}`}>
                        {tierInfo.tier}
                      </h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {tierInfo.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-hotel-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Loyalty Members</CardTitle>
                <CardDescription>
                  Highest point earners this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guests
                    .filter((g) => g.loyaltyProgram.member)
                    .sort(
                      (a, b) =>
                        b.loyaltyProgram.points - a.loyaltyProgram.points,
                    )
                    .slice(0, 5)
                    .map((guest, index) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-hotel-100 text-hotel-700 text-sm font-medium">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={guest.profilePicture}
                              alt={`${guest.firstName} ${guest.lastName}`}
                            />
                            <AvatarFallback className="text-xs">
                              {guest.firstName[0]}
                              {guest.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {guest.firstName} {guest.lastName}
                            </p>
                            <Badge
                              className={`${getTierColor(guest.loyaltyProgram.tier)} text-xs`}
                              variant="outline"
                            >
                              {guest.loyaltyProgram.tier}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {guest.loyaltyProgram.points.toLocaleString()} pts
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>
                  Guest communications and correspondence
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communications.map((comm) => {
                  const guest = guests.find((g) => g.id === comm.guestId);
                  return (
                    <div key={comm.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{comm.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {comm.direction === "outbound" ? "To" : "From"}:{" "}
                            {guest?.firstName} {guest?.lastName}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs mb-1">
                            {comm.type}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {comm.timestamp}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{comm.content}</p>
                      <div className="flex justify-between items-center mt-3">
                        <Badge
                          variant={
                            comm.status === "read" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {comm.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Forward className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guest Feedback & Reviews</CardTitle>
              <CardDescription>
                Guest satisfaction and review management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbacks.map((feedback) => {
                  const guest = guests.find((g) => g.id === feedback.guestId);
                  return (
                    <div key={feedback.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">
                            {guest?.firstName} {guest?.lastName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= feedback.overallRating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {feedback.overallRating}/5
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              feedback.status === "published"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {feedback.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {feedback.submittedAt}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm mb-3">{feedback.review}</p>

                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {Object.entries(feedback.ratings).map(
                          ([category, rating]) => (
                            <div key={category} className="text-center">
                              <p className="text-xs text-muted-foreground capitalize">
                                {category}
                              </p>
                              <p className="text-sm font-medium">{rating}/5</p>
                            </div>
                          ),
                        )}
                      </div>

                      {feedback.response && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">
                            Management Response:
                          </p>
                          <p className="text-sm mt-1">
                            {feedback.response.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            By {feedback.response.respondedBy} on{" "}
                            {feedback.response.respondedAt}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        {!feedback.response && (
                          <Button variant="outline" size="sm">
                            <Reply className="h-3 w-3 mr-1" />
                            Respond
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Flag className="h-3 w-3 mr-1" />
                          Flag
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Guest Acquisition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">New Guests This Month</span>
                    <span className="font-medium text-green-600">+45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Repeat Guests</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Referral Rate</span>
                    <span className="font-medium text-blue-600">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Booking Value</span>
                    <span className="font-medium">
                      ${guestStats.averageSpent.toFixed(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Guest Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Domestic Guests</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">International Guests</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Business Travelers</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Leisure Travelers</span>
                    <span className="font-medium">55%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Satisfaction Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Overall Rating</span>
                    <span className="font-medium text-yellow-600">
                      {guestStats.averageRating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Recommendation Rate</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Complaint Rate</span>
                    <span className="font-medium text-red-600">2.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Return Guest Rate</span>
                    <span className="font-medium text-blue-600">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Guest Analytics Overview</CardTitle>
              <CardDescription>
                Comprehensive guest behavior and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Guest analytics charts would be displayed here</p>
                  <p className="text-sm">
                    Integration with charting library required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Guest Segments</CardTitle>
                <CardDescription>
                  Automated guest categorization and targeting
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Segment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: "VIP Guests",
                    count: guestStats.vip,
                    criteria: "Status = VIP",
                    color: "bg-purple-100 text-purple-800",
                  },
                  {
                    name: "High Spenders",
                    count: guests.filter((g) => g.totalSpent > 10000).length,
                    criteria: "Total Spent > $10,000",
                    color: "bg-green-100 text-green-800",
                  },
                  {
                    name: "Frequent Guests",
                    count: guests.filter((g) => g.totalStays > 10).length,
                    criteria: "Total Stays > 10",
                    color: "bg-blue-100 text-blue-800",
                  },
                  {
                    name: "Loyalty Members",
                    count: guestStats.loyaltyMembers,
                    criteria: "Loyalty Program Member",
                    color: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    name: "Business Travelers",
                    count: guests.filter((g) =>
                      g.tags.includes("business-traveler"),
                    ).length,
                    criteria: "Tags contains 'business-traveler'",
                    color: "bg-indigo-100 text-indigo-800",
                  },
                  {
                    name: "Anniversary Guests",
                    count: guests.filter((g) => g.tags.includes("anniversary"))
                      .length,
                    criteria: "Tags contains 'anniversary'",
                    color: "bg-pink-100 text-pink-800",
                  },
                ].map((segment) => (
                  <div key={segment.name} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{segment.name}</h4>
                      <Badge className={segment.color} variant="outline">
                        {segment.count} guests
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {segment.criteria}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Guest Communication Automation</CardTitle>
                <CardDescription>
                  Automated workflows and guest engagement
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Welcome Email Sequence",
                    trigger: "New guest registration",
                    status: "Active",
                    sent: 127,
                    openRate: "78%",
                  },
                  {
                    name: "Birthday Greetings",
                    trigger: "Guest birthday (7 days before)",
                    status: "Active",
                    sent: 45,
                    openRate: "92%",
                  },
                  {
                    name: "Post-Stay Survey",
                    trigger: "24 hours after checkout",
                    status: "Active",
                    sent: 89,
                    openRate: "65%",
                  },
                  {
                    name: "Loyalty Point Expiry",
                    trigger: "30 days before points expire",
                    status: "Active",
                    sent: 23,
                    openRate: "71%",
                  },
                  {
                    name: "Win-Back Campaign",
                    trigger: "No stay for 12 months",
                    status: "Paused",
                    sent: 156,
                    openRate: "43%",
                  },
                ].map((workflow, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {workflow.trigger}
                        </p>
                      </div>
                      <Badge
                        variant={
                          workflow.status === "Active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-muted-foreground">
                        Sent: {workflow.sent} • Open Rate: {workflow.openRate}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
