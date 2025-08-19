import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, MapPin, Clock, Users, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Types for different services
interface RoomType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  max_occupancy: number;
  amenities: string[];
  images: string[];
  features: string[];
  is_active: boolean;
}

interface Room {
  id: string;
  room_number: string;
  room_type_id: string;
  floor: number;
  status: string;
  view_type: string;
  balcony: boolean;
  notes: string;
  room_types: { name: string };
}

interface DiningVenue {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  opening_hours: any;
  menu_items: any[];
  images: string[];
  price_range: string;
  is_active: boolean;
}

interface EventSpace {
  id: string;
  name: string;
  type: string;
  capacity: number;
  area_sqm: number;
  equipment: string[];
  catering_available: boolean;
  av_equipment: boolean;
  wifi: boolean;
  natural_light: boolean;
  price_per_hour: number;
  images: string[];
  is_active: boolean;
}

interface FacilityService {
  id: string;
  name: string;
  category: string;
  description: string;
  duration_minutes: number;
  price: number;
  capacity: number;
  equipment_needed: string[];
  images: string[];
  is_active: boolean;
}

export default function ServiceManagement() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [diningVenues, setDiningVenues] = useState<DiningVenue[]>([]);
  const [eventSpaces, setEventSpaces] = useState<EventSpace[]>([]);
  const [facilityServices, setFacilityServices] = useState<FacilityService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const { toast } = useToast();

  // Form state for adding/editing
  const [formData, setFormData] = useState<any>({});

  // Fetch all services data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [roomTypesRes, roomsRes, diningRes, eventsRes, facilitiesRes] = await Promise.all([
        supabase.from('room_types').select('*').order('name'),
        supabase.from('rooms').select('*, room_types(name)').order('room_number'),
        supabase.from('dining_venues').select('*').order('name'),
        supabase.from('event_spaces').select('*').order('name'),
        supabase.from('facility_services').select('*').order('name')
      ]);

      if (roomTypesRes.error) throw roomTypesRes.error;
      if (roomsRes.error) throw roomsRes.error;
      if (diningRes.error) throw diningRes.error;
      if (eventsRes.error) throw eventsRes.error;
      if (facilitiesRes.error) throw facilitiesRes.error;

      setRoomTypes(roomTypesRes.data || []);
      setRooms(roomsRes.data || []);
      setDiningVenues(diningRes.data || []);
      setEventSpaces(eventsRes.data || []);
      setFacilityServices(facilitiesRes.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset form data when changing tabs or closing dialogs
  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
  };

  // Save room type
  const saveRoomType = async () => {
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        max_occupancy: parseInt(formData.max_occupancy),
        amenities: formData.amenities?.split(',').map((a: string) => a.trim()) || [],
        features: formData.features?.split(',').map((f: string) => f.trim()) || [],
        images: formData.images?.split(',').map((i: string) => i.trim()) || [],
        is_active: formData.is_active !== false
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from('room_types')
          .update(data)
          .eq('id', editingItem.id);
      } else {
        result = await supabase
          .from('room_types')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Room type ${editingItem ? 'updated' : 'created'} successfully`
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save room type",
        variant: "destructive"
      });
      console.error('Error saving room type:', error);
    }
  };

  // Save room
  const saveRoom = async () => {
    try {
      const data = {
        room_number: formData.room_number,
        room_type_id: formData.room_type_id,
        floor: parseInt(formData.floor),
        status: formData.status || 'available',
        view_type: formData.view_type,
        balcony: formData.balcony || false,
        notes: formData.notes
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from('rooms')
          .update(data)
          .eq('id', editingItem.id);
      } else {
        result = await supabase
          .from('rooms')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Room ${editingItem ? 'updated' : 'created'} successfully`
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save room",
        variant: "destructive"
      });
      console.error('Error saving room:', error);
    }
  };

  // Save dining venue
  const saveDiningVenue = async () => {
    try {
      const data = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        capacity: parseInt(formData.capacity),
        opening_hours: formData.opening_hours ? JSON.parse(formData.opening_hours) : null,
        menu_items: formData.menu_items ? JSON.parse(formData.menu_items) : [],
        images: formData.images?.split(',').map((i: string) => i.trim()) || [],
        price_range: formData.price_range,
        is_active: formData.is_active !== false
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from('dining_venues')
          .update(data)
          .eq('id', editingItem.id);
      } else {
        result = await supabase
          .from('dining_venues')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Dining venue ${editingItem ? 'updated' : 'created'} successfully`
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save dining venue",
        variant: "destructive"
      });
      console.error('Error saving dining venue:', error);
    }
  };

  // Save event space
  const saveEventSpace = async () => {
    try {
      const data = {
        name: formData.name,
        type: formData.type,
        capacity: parseInt(formData.capacity),
        area_sqm: parseFloat(formData.area_sqm),
        equipment: formData.equipment?.split(',').map((e: string) => e.trim()) || [],
        catering_available: formData.catering_available !== false,
        av_equipment: formData.av_equipment !== false,
        wifi: formData.wifi !== false,
        natural_light: formData.natural_light !== false,
        price_per_hour: parseFloat(formData.price_per_hour),
        images: formData.images?.split(',').map((i: string) => i.trim()) || [],
        is_active: formData.is_active !== false
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from('event_spaces')
          .update(data)
          .eq('id', editingItem.id);
      } else {
        result = await supabase
          .from('event_spaces')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Event space ${editingItem ? 'updated' : 'created'} successfully`
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event space",
        variant: "destructive"
      });
      console.error('Error saving event space:', error);
    }
  };

  // Save facility service
  const saveFacilityService = async () => {
    try {
      const data = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        duration_minutes: parseInt(formData.duration_minutes),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        equipment_needed: formData.equipment_needed?.split(',').map((e: string) => e.trim()) || [],
        images: formData.images?.split(',').map((i: string) => i.trim()) || [],
        is_active: formData.is_active !== false
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from('facility_services')
          .update(data)
          .eq('id', editingItem.id);
      } else {
        result = await supabase
          .from('facility_services')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Facility service ${editingItem ? 'updated' : 'created'} successfully`
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save facility service",
        variant: "destructive"
      });
      console.error('Error saving facility service:', error);
    }
  };

  // Delete item
  const deleteItem = async (tableName: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully"
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
      console.error('Error deleting item:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get form fields based on current tab
  const getFormFields = () => {
    switch (activeTab) {
      case 'room-types':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Room Type Name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Base Price (UGX)"
              value={formData.base_price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Max Occupancy"
              value={formData.max_occupancy || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, max_occupancy: e.target.value }))}
            />
            <Input
              placeholder="Amenities (comma separated)"
              value={formData.amenities || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
            />
            <Input
              placeholder="Features (comma separated)"
              value={formData.features || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
            />
            <Input
              placeholder="Image URLs (comma separated)"
              value={formData.images || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active !== false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label>Active</Label>
            </div>
          </div>
        );
      
      case 'rooms':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Room Number"
              value={formData.room_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
            />
            <Select value={formData.room_type_id || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, room_type_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Room Type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Floor"
              value={formData.floor || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
            />
            <Select value={formData.status || 'available'} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="out_of_order">Out of Order</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="View Type (e.g., Garden View, City View)"
              value={formData.view_type || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, view_type: e.target.value }))}
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.balcony || false}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, balcony: checked }))}
              />
              <Label>Has Balcony</Label>
            </div>
            <Textarea
              placeholder="Notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        );
      
      // Add more cases for dining, events, facilities...
      default:
        return <div>Form not implemented for this tab</div>;
    }
  };

  // Get save function based on current tab
  const getSaveFunction = () => {
    switch (activeTab) {
      case 'room-types':
        return saveRoomType;
      case 'rooms':
        return saveRoom;
      case 'dining':
        return saveDiningVenue;
      case 'events':
        return saveEventSpace;
      case 'facilities':
        return saveFacilityService;
      default:
        return () => {};
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Manage rooms, dining venues, event spaces, and facilities</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Service Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="room-types">Room Types</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="dining">Dining</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        {/* Room Types Tab */}
        <TabsContent value="room-types">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((roomType) => (
              <Card key={roomType.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{roomType.name}</CardTitle>
                      <CardDescription>{roomType.description}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingItem(roomType);
                          setFormData({
                            ...roomType,
                            amenities: roomType.amenities?.join(', '),
                            features: roomType.features?.join(', '),
                            images: roomType.images?.join(', ')
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('room_types', roomType.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-semibold">{formatCurrency(roomType.base_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Max Occupancy:</span>
                      <Badge variant="secondary">{roomType.max_occupancy} guests</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={roomType.is_active ? "default" : "secondary"}>
                        {roomType.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {roomType.amenities && roomType.amenities.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Amenities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {roomType.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {roomType.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{roomType.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Room {room.room_number}</CardTitle>
                      <CardDescription>{room.room_types?.name}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingItem(room);
                          setFormData(room);
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteItem('rooms', room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Floor:</span>
                      <span>{room.floor}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge 
                        variant={room.status === 'available' ? 'default' : 
                               room.status === 'occupied' ? 'destructive' : 'secondary'}
                      >
                        {room.status}
                      </Badge>
                    </div>
                    {room.view_type && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">View:</span>
                        <span className="text-sm">{room.view_type}</span>
                      </div>
                    )}
                    {room.balcony && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Balcony:</span>
                        <Badge variant="outline">Yes</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Add other tabs content here */}
        <TabsContent value="dining">
          <div className="text-center py-8">
            <p className="text-gray-500">Dining venues management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="text-center py-8">
            <p className="text-gray-500">Event spaces management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="facilities">
          <div className="text-center py-8">
            <p className="text-gray-500">Facility services management coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {activeTab.replace('-', ' ')}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update' : 'Create'} a new {activeTab.replace('-', ' ')} entry
            </DialogDescription>
          </DialogHeader>
          
          {getFormFields()}
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={getSaveFunction()}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
