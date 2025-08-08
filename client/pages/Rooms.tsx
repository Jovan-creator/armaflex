import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BedDouble,
  Wifi,
  Tv,
  Car,
  Coffee,
  Search,
  Plus,
  MoreVertical,
  Users,
  DollarSign,
  Calendar,
  Settings,
  Eye,
  Edit,
} from "lucide-react";

export default function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const rooms = [
    {
      id: "101",
      number: "101",
      type: "Standard",
      status: "occupied",
      guest: "John Smith",
      checkOut: "Dec 28",
      rate: 150,
      amenities: ["wifi", "tv", "coffee"],
      capacity: 2,
      floor: 1,
    },
    {
      id: "102",
      number: "102",
      type: "Standard",
      status: "available",
      guest: null,
      checkOut: null,
      rate: 150,
      amenities: ["wifi", "tv", "coffee"],
      capacity: 2,
      floor: 1,
    },
    {
      id: "201",
      number: "201",
      type: "Deluxe",
      status: "maintenance",
      guest: null,
      checkOut: null,
      rate: 250,
      amenities: ["wifi", "tv", "coffee", "parking"],
      capacity: 3,
      floor: 2,
    },
    {
      id: "301",
      number: "301",
      type: "Suite",
      status: "occupied",
      guest: "Sarah Johnson",
      checkOut: "Dec 30",
      rate: 450,
      amenities: ["wifi", "tv", "coffee", "parking"],
      capacity: 4,
      floor: 3,
    },
    {
      id: "401",
      number: "401",
      type: "Presidential",
      status: "out-of-order",
      guest: null,
      checkOut: null,
      rate: 800,
      amenities: ["wifi", "tv", "coffee", "parking"],
      capacity: 6,
      floor: 4,
    },
    {
      id: "205",
      number: "205",
      type: "Deluxe",
      status: "available",
      guest: null,
      checkOut: null,
      rate: 250,
      amenities: ["wifi", "tv", "coffee"],
      capacity: 3,
      floor: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200";
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out-of-order":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "tv":
        return <Tv className="h-4 w-4" />;
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    const matchesType = filterType === "all" || room.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const roomStats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status === "occupied").length,
    available: rooms.filter(r => r.status === "available").length,
    maintenance: rooms.filter(r => r.status === "maintenance").length,
    outOfOrder: rooms.filter(r => r.status === "out-of-order").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms Management</h1>
          <p className="text-muted-foreground">Manage room inventory, status, and availability</p>
        </div>
        <Button className="bg-hotel-500 hover:bg-hotel-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                <p className="text-2xl font-bold">{roomStats.total}</p>
              </div>
              <BedDouble className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{roomStats.occupied}</p>
              </div>
              <Users className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{roomStats.available}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{roomStats.maintenance}</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Order</p>
                <p className="text-2xl font-bold text-gray-600">{roomStats.outOfOrder}</p>
              </div>
              <Settings className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms, guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out-of-order">Out of Order</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="presidential">Presidential</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-lg bg-hotel-100 flex items-center justify-center">
                    <BedDouble className="h-6 w-6 text-hotel-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Room {room.number}</CardTitle>
                    <CardDescription>{room.type}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(room.status)} variant="outline">
                  {room.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {room.guest && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {room.guest.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{room.guest}</p>
                    <p className="text-xs text-muted-foreground">Check out: {room.checkOut}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{room.capacity} guests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${room.rate}/night</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-1 px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="text-xs capitalize">{amenity}</span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BedDouble className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
