import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
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
  Trash2,
  CheckCircle,
  AlertCircle,
  Wind,
  Bath,
  Utensils,
  MapPin
} from "lucide-react";

interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  room_type_name: string;
  floor: number;
  status: string;
  base_price: number;
  max_occupancy: number;
  amenities?: string;
  notes?: string;
}

interface RoomType {
  id: number;
  name: string;
  description: string;
  base_price: number;
  max_occupancy: number;
  amenities: string;
  is_active: boolean;
}

export default function RoomsAdmin() {
  const { user } = useUser();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Dialog states
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [showAddRoomType, setShowAddRoomType] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Form states
  const [roomForm, setRoomForm] = useState({
    room_number: '',
    room_type_id: '',
    floor: '',
    status: 'available',
    notes: ''
  });

  const [roomTypeForm, setRoomTypeForm] = useState({
    name: '',
    description: '',
    base_price: '',
    max_occupancy: '',
    amenities: ['Free WiFi', 'Air Conditioning', 'TV']
  });

  const availableAmenities = [
    'Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Mini Fridge', 
    'Balcony', 'Living Area', 'Jacuzzi', 'Butler Service', 'Room Service',
    'Safe', 'Hair Dryer', 'Coffee Machine', 'Work Desk', 'City View'
  ];

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || '';
  };

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/hotel/rooms', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Fetch rooms error:', err);
    }
  };

  // Fetch room types from API
  const fetchRoomTypes = async () => {
    try {
      const response = await fetch('/api/hotel/room-types', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch room types');
      }

      const data = await response.json();
      setRoomTypes(data);
    } catch (err) {
      setError('Failed to load room types');
      console.error('Fetch room types error:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRooms(), fetchRoomTypes()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Create new room
  const createRoom = async () => {
    try {
      const response = await fetch('/api/hotel/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          ...roomForm,
          room_type_id: parseInt(roomForm.room_type_id),
          floor: parseInt(roomForm.floor)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      setSuccess('Room created successfully');
      setShowAddRoom(false);
      setRoomForm({ room_number: '', room_type_id: '', floor: '', status: 'available', notes: '' });
      fetchRooms();
    } catch (err) {
      setError('Failed to create room');
      console.error('Create room error:', err);
    }
  };

  // Update room
  const updateRoom = async () => {
    if (!selectedRoom) return;

    try {
      const response = await fetch(`/api/hotel/rooms/${selectedRoom.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          ...roomForm,
          room_type_id: parseInt(roomForm.room_type_id),
          floor: parseInt(roomForm.floor)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update room');
      }

      setSuccess('Room updated successfully');
      setShowEditRoom(false);
      setSelectedRoom(null);
      fetchRooms();
    } catch (err) {
      setError('Failed to update room');
      console.error('Update room error:', err);
    }
  };

  // Delete room
  const deleteRoom = async (roomId: number) => {
    try {
      const response = await fetch(`/api/hotel/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      setSuccess('Room deleted successfully');
      fetchRooms();
    } catch (err) {
      setError('Failed to delete room');
      console.error('Delete room error:', err);
    }
  };

  // Create room type
  const createRoomType = async () => {
    try {
      const response = await fetch('/api/hotel/room-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          ...roomTypeForm,
          base_price: parseFloat(roomTypeForm.base_price),
          max_occupancy: parseInt(roomTypeForm.max_occupancy),
          amenities: JSON.stringify(roomTypeForm.amenities)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create room type');
      }

      setSuccess('Room type created successfully');
      setShowAddRoomType(false);
      setRoomTypeForm({ name: '', description: '', base_price: '', max_occupancy: '', amenities: ['Free WiFi', 'Air Conditioning', 'TV'] });
      fetchRoomTypes();
    } catch (err) {
      setError('Failed to create room type');
      console.error('Create room type error:', err);
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.room_type_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesType = filterType === 'all' || room.room_type_name === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi': return <Wifi className="w-4 h-4" />;
      case 'air conditioning': return <Wind className="w-4 h-4" />;
      case 'tv': return <Tv className="w-4 h-4" />;
      case 'mini bar': return <Coffee className="w-4 h-4" />;
      case 'mini fridge': return <Coffee className="w-4 h-4" />;
      case 'balcony': return <MapPin className="w-4 h-4" />;
      case 'jacuzzi': return <Bath className="w-4 h-4" />;
      case 'butler service': return <Users className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  // Open edit dialog
  const openEditDialog = (room: Room) => {
    setSelectedRoom(room);
    setRoomForm({
      room_number: room.room_number,
      room_type_id: room.room_type_id.toString(),
      floor: room.floor.toString(),
      status: room.status,
      notes: room.notes || ''
    });
    setShowEditRoom(true);
  };

  // Clear alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">Manage hotel rooms and room types</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showAddRoomType} onOpenChange={setShowAddRoomType}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Room Type
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Rooms ({rooms.length})</TabsTrigger>
          <TabsTrigger value="types">Room Types ({roomTypes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search rooms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {roomTypes.map(type => (
                      <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Room {room.room_number}</CardTitle>
                      <CardDescription>{room.room_type_name}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(room.status)}>
                        {room.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(room)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Room</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete Room {room.room_number}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteRoom(room.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Floor {room.floor}</span>
                      <span className="font-medium">${room.base_price}/night</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      Up to {room.max_occupancy} guests
                    </div>

                    {room.amenities && (
                      <div className="flex flex-wrap gap-1">
                        {JSON.parse(room.amenities).slice(0, 3).map((amenity: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-1 text-xs text-muted-foreground">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {JSON.parse(room.amenities).length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{JSON.parse(room.amenities).length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No rooms found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {/* Room Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader>
                  <CardTitle>{type.name}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Base Price</span>
                      <span className="font-medium">${type.base_price}/night</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Max Occupancy</span>
                      <span className="font-medium">{type.max_occupancy} guests</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground mb-2 block">Amenities</span>
                      <div className="flex flex-wrap gap-1">
                        {JSON.parse(type.amenities).map((amenity: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Room Dialog */}
      <Dialog open={showAddRoom} onOpenChange={setShowAddRoom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>Create a new room in the hotel.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={roomForm.room_number}
                  onChange={(e) => setRoomForm({...roomForm, room_number: e.target.value})}
                  placeholder="101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  value={roomForm.floor}
                  onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})}
                  placeholder="1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select value={roomForm.room_type_id} onValueChange={(value) => setRoomForm({...roomForm, room_type_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => (
                    <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={roomForm.status} onValueChange={(value) => setRoomForm({...roomForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={roomForm.notes}
                onChange={(e) => setRoomForm({...roomForm, notes: e.target.value})}
                placeholder="Any additional notes..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddRoom(false)}>Cancel</Button>
            <Button onClick={createRoom}>Create Room</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={showEditRoom} onOpenChange={setShowEditRoom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update room information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editRoomNumber">Room Number</Label>
                <Input
                  id="editRoomNumber"
                  value={roomForm.room_number}
                  onChange={(e) => setRoomForm({...roomForm, room_number: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editFloor">Floor</Label>
                <Input
                  id="editFloor"
                  type="number"
                  value={roomForm.floor}
                  onChange={(e) => setRoomForm({...roomForm, floor: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRoomType">Room Type</Label>
              <Select value={roomForm.room_type_id} onValueChange={(value) => setRoomForm({...roomForm, room_type_id: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => (
                    <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select value={roomForm.status} onValueChange={(value) => setRoomForm({...roomForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notes</Label>
              <Textarea
                id="editNotes"
                value={roomForm.notes}
                onChange={(e) => setRoomForm({...roomForm, notes: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditRoom(false)}>Cancel</Button>
            <Button onClick={updateRoom}>Update Room</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Room Type Dialog */}
      <Dialog open={showAddRoomType} onOpenChange={setShowAddRoomType}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Room Type</DialogTitle>
            <DialogDescription>Create a new room type with amenities and pricing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeName">Name</Label>
                <Input
                  id="typeName"
                  value={roomTypeForm.name}
                  onChange={(e) => setRoomTypeForm({...roomTypeForm, name: e.target.value})}
                  placeholder="e.g., Deluxe Suite"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={roomTypeForm.base_price}
                  onChange={(e) => setRoomTypeForm({...roomTypeForm, base_price: e.target.value})}
                  placeholder="150"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={roomTypeForm.description}
                onChange={(e) => setRoomTypeForm({...roomTypeForm, description: e.target.value})}
                placeholder="Describe the room type..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxOccupancy">Max Occupancy</Label>
              <Input
                id="maxOccupancy"
                type="number"
                value={roomTypeForm.max_occupancy}
                onChange={(e) => setRoomTypeForm({...roomTypeForm, max_occupancy: e.target.value})}
                placeholder="2"
              />
            </div>
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={roomTypeForm.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRoomTypeForm({
                            ...roomTypeForm,
                            amenities: [...roomTypeForm.amenities, amenity]
                          });
                        } else {
                          setRoomTypeForm({
                            ...roomTypeForm,
                            amenities: roomTypeForm.amenities.filter(a => a !== amenity)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddRoomType(false)}>Cancel</Button>
            <Button onClick={createRoomType}>Create Room Type</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
