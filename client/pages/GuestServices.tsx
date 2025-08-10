import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Utensils,
  Clock,
  Car,
  Shirt,
  Camera,
  Phone,
  Gift,
  MapPin,
  Calendar,
  Star,
  Plus,
  CheckCircle,
  XCircle,
  Timer,
  DollarSign,
  MessageSquare,
  Image,
  Wifi,
  Lightbulb,
  Thermometer,
  Shield,
} from "lucide-react";

// Mock service categories
const serviceCategories = [
  {
    id: "room-service",
    title: "Room Service",
    icon: Utensils,
    description: "Food and beverages delivered to your room",
    color: "bg-orange-500",
    available24: true,
  },
  {
    id: "housekeeping",
    title: "Housekeeping",
    icon: Clock,
    description: "Cleaning and maintenance services",
    color: "bg-blue-500",
    available24: false,
  },
  {
    id: "transport",
    title: "Transportation",
    icon: Car,
    description: "Airport shuttles and car services",
    color: "bg-green-500",
    available24: false,
  },
  {
    id: "laundry",
    title: "Laundry",
    icon: Shirt,
    description: "Laundry and dry cleaning services",
    color: "bg-purple-500",
    available24: false,
  },
  {
    id: "technical",
    title: "Technical Support",
    icon: Wifi,
    description: "TV, WiFi, and room equipment assistance",
    color: "bg-indigo-500",
    available24: true,
  },
  {
    id: "maintenance",
    title: "Maintenance",
    icon: Lightbulb,
    description: "Room repairs and adjustments",
    color: "bg-yellow-500",
    available24: false,
  },
];

// Mock services for each category
const services = {
  "room-service": [
    {
      id: 1,
      name: "Breakfast",
      price: 25,
      description: "Continental breakfast",
      time: "30-45 min",
    },
    {
      id: 2,
      name: "Lunch",
      price: 35,
      description: "Light lunch menu",
      time: "45-60 min",
    },
    {
      id: 3,
      name: "Dinner",
      price: 55,
      description: "Full dinner menu",
      time: "60-75 min",
    },
    {
      id: 4,
      name: "Snacks",
      price: 15,
      description: "Light snacks and beverages",
      time: "20-30 min",
    },
    {
      id: 5,
      name: "Beverages",
      price: 8,
      description: "Soft drinks, coffee, tea",
      time: "15-20 min",
    },
  ],
  housekeeping: [
    {
      id: 6,
      name: "Extra Cleaning",
      price: 30,
      description: "Additional room cleaning",
      time: "45-60 min",
    },
    {
      id: 7,
      name: "Fresh Towels",
      price: 0,
      description: "Extra towel service",
      time: "15-20 min",
    },
    {
      id: 8,
      name: "Turndown Service",
      price: 15,
      description: "Evening turndown with chocolates",
      time: "20-30 min",
    },
    {
      id: 9,
      name: "Deep Cleaning",
      price: 75,
      description: "Comprehensive room deep clean",
      time: "2-3 hours",
    },
  ],
  transport: [
    {
      id: 10,
      name: "Airport Pickup",
      price: 50,
      description: "One-way airport transfer",
      time: "30-45 min",
    },
    {
      id: 11,
      name: "Airport Drop-off",
      price: 50,
      description: "One-way airport transfer",
      time: "30-45 min",
    },
    {
      id: 12,
      name: "City Tour",
      price: 120,
      description: "4-hour guided city tour",
      time: "4 hours",
    },
    {
      id: 13,
      name: "Taxi Service",
      price: 25,
      description: "Local taxi booking",
      time: "10-15 min",
    },
  ],
  laundry: [
    {
      id: 14,
      name: "Express Laundry",
      price: 35,
      description: "Same-day laundry service",
      time: "6-8 hours",
    },
    {
      id: 15,
      name: "Standard Laundry",
      price: 25,
      description: "Next-day laundry service",
      time: "24 hours",
    },
    {
      id: 16,
      name: "Dry Cleaning",
      price: 45,
      description: "Professional dry cleaning",
      time: "24-48 hours",
    },
    {
      id: 17,
      name: "Ironing Only",
      price: 15,
      description: "Ironing service only",
      time: "2-3 hours",
    },
  ],
  technical: [
    {
      id: 18,
      name: "TV Setup",
      price: 0,
      description: "TV and channel assistance",
      time: "15-30 min",
    },
    {
      id: 19,
      name: "WiFi Support",
      price: 0,
      description: "Internet connectivity help",
      time: "10-20 min",
    },
    {
      id: 20,
      name: "Device Connection",
      price: 10,
      description: "Connect your devices",
      time: "15-30 min",
    },
  ],
  maintenance: [
    {
      id: 21,
      name: "AC Adjustment",
      price: 0,
      description: "Air conditioning settings",
      time: "10-15 min",
    },
    {
      id: 22,
      name: "Light Repair",
      price: 15,
      description: "Light bulb and fixture repair",
      time: "20-30 min",
    },
    {
      id: 23,
      name: "Plumbing Issue",
      price: 25,
      description: "Basic plumbing assistance",
      time: "30-60 min",
    },
  ],
};

// Mock service requests
const mockRequests = [
  {
    id: "REQ-001",
    service: "Breakfast",
    category: "room-service",
    status: "delivered",
    requestTime: "2024-01-16T08:30:00",
    deliveryTime: "2024-01-16T09:15:00",
    price: 25,
    notes: "No nuts please",
    rating: 5,
  },
  {
    id: "REQ-002",
    service: "Fresh Towels",
    category: "housekeeping",
    status: "in-progress",
    requestTime: "2024-01-16T14:20:00",
    price: 0,
    notes: "Extra bath towels needed",
    estimatedTime: "15-20 min",
  },
  {
    id: "REQ-003",
    service: "Airport Pickup",
    category: "transport",
    status: "confirmed",
    requestTime: "2024-01-16T16:45:00",
    scheduledTime: "2024-01-18T09:00:00",
    price: 50,
    notes: "Flight UA 1234, Terminal 2",
  },
];

export default function GuestServices() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "room-service",
  );
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    serviceId: "",
    quantity: 1,
    scheduledTime: "",
    notes: "",
    priority: "normal",
  });
  const { toast } = useToast();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && serviceCategories.find((cat) => cat.id === category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "confirmed":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Confirmed</Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleServiceRequest = (service: any) => {
    setSelectedService(service);
    setRequestForm({
      serviceId: service.id.toString(),
      quantity: 1,
      scheduledTime: "",
      notes: "",
      priority: "normal",
    });
    setIsRequestDialogOpen(true);
  };

  const submitRequest = async () => {
    // In real app, this would call an API
    toast({
      title: "Service Requested",
      description: `Your ${selectedService.name} request has been submitted. You'll receive a confirmation shortly.`,
    });
    setIsRequestDialogOpen(false);
    setSelectedService(null);
  };

  const currentCategory = serviceCategories.find(
    (cat) => cat.id === selectedCategory,
  );
  const categoryServices =
    services[selectedCategory as keyof typeof services] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hotel Services</h1>
        <p className="text-gray-600">Request services to enhance your stay</p>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="space-y-6"
      >
        {/* Service Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {serviceCategories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="h-auto p-4 flex flex-col space-y-2"
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    isActive ? "bg-white/20" : category.color
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${isActive ? "text-white" : "text-white"}`}
                  />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{category.title}</div>
                  {category.available24 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      24/7
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Service Details */}
        {currentCategory && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${currentCategory.color}`}
                >
                  {React.createElement(currentCategory.icon, {
                    className: "h-6 w-6 text-white",
                  })}
                </div>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{currentCategory.title}</span>
                    {currentCategory.available24 && (
                      <Badge className="bg-green-100 text-green-800">
                        24/7 Available
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {currentCategory.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryServices.map((service) => (
                  <Card
                    key={service.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{service.name}</h4>
                          <div className="text-right">
                            {service.price > 0 ? (
                              <span className="font-bold text-hotel-600">
                                ${service.price}
                              </span>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">
                                Free
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>

                        <div className="flex items-center text-xs text-gray-500">
                          <Timer className="h-3 w-3 mr-1" />
                          <span>{service.time}</span>
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleServiceRequest(service)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Request Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRequests.map((request) => {
                const category = serviceCategories.find(
                  (cat) => cat.id === request.category,
                );
                const Icon = category?.icon || MessageSquare;

                return (
                  <div
                    key={request.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${category?.color || "bg-gray-500"}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{request.service}</h4>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Requested:{" "}
                        {new Date(request.requestTime).toLocaleString()}
                      </p>
                      {request.notes && (
                        <p className="text-xs text-gray-500 mt-1">
                          Note: {request.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-medium">
                        {request.price > 0 ? `$${request.price}` : "Free"}
                      </div>
                      {request.estimatedTime && (
                        <div className="text-xs text-gray-500">
                          {request.estimatedTime}
                        </div>
                      )}
                      {request.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < request.rating!
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Request Service Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request {selectedService?.name}</DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium">{selectedService.name}</h4>
                <p className="text-sm text-gray-600">
                  {selectedService.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    Estimated time: {selectedService.time}
                  </span>
                  <span className="font-bold">
                    {selectedService.price > 0
                      ? `$${selectedService.price}`
                      : "Free"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={requestForm.quantity}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        quantity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={requestForm.priority}
                    onValueChange={(value) =>
                      setRequestForm({ ...requestForm, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent (+$10)</SelectItem>
                      <SelectItem value="asap">ASAP (+$20)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="scheduledTime">Preferred Time (Optional)</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={requestForm.scheduledTime}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      scheduledTime: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or instructions..."
                  value={requestForm.notes}
                  onChange={(e) =>
                    setRequestForm({ ...requestForm, notes: e.target.value })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Total Cost:</span>
                  <span className="font-bold ml-2">
                    $
                    {(
                      selectedService.price * requestForm.quantity +
                      (requestForm.priority === "urgent"
                        ? 10
                        : requestForm.priority === "asap"
                          ? 20
                          : 0)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsRequestDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={submitRequest}>Submit Request</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
