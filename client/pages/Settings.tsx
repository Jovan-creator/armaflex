import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Users, 
  Shield, 
  Building, 
  DollarSign, 
  Mail, 
  Puzzle, 
  Database, 
  Palette, 
  Globe, 
  Wrench,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Key,
  Server,
  Clock,
  Bell,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Languages,
  FileText,
  HelpCircle,
  Info,
  ExternalLink,
  Copy,
  Check,
  Star,
  CreditCard,
  Wifi,
  Tv,
  Car,
  Coffee
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hotel Settings State
  const [hotelSettings, setHotelSettings] = useState({
    name: 'Armaflex Hotel',
    address: '123 Luxury Avenue, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@armaflex.com',
    website: 'www.armaflex.com',
    description: 'A premier luxury hotel offering exceptional service and world-class amenities in the heart of the city.',
    timeZone: 'America/New_York',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    currency: 'USD',
    taxRate: 8.5,
    serviceFee: 15,
    cancellationPolicy: '24-hour',
    maxOccupancy: 4
  });

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    sessionTimeout: 60,
    maxFileSize: 50,
    enableAnalytics: true,
    enableNotifications: true,
    allowGuestRegistration: true,
    requireEmailVerification: true,
    enableSMS: false,
    enablePushNotifications: true
  });

  // Users State
  const [users, setUsers] = useState([
    { id: 1, name: 'Jovan K', email: 'jovan.k@armaflex.com', role: 'admin', status: 'active', lastLogin: '2024-01-15 14:30', department: 'Management' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@armaflex.com', role: 'receptionist', status: 'active', lastLogin: '2024-01-15 13:45', department: 'Front Desk' },
    { id: 3, name: 'Mike Wilson', email: 'mike.w@armaflex.com', role: 'housekeeping', status: 'active', lastLogin: '2024-01-15 10:20', department: 'Housekeeping' },
    { id: 4, name: 'Emma Davis', email: 'emma.d@armaflex.com', role: 'manager', status: 'inactive', lastLogin: '2024-01-12 16:15', department: 'Operations' }
  ]);

  // Integrations State
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Stripe Payment Gateway', type: 'payment', status: 'connected', icon: CreditCard, lastSync: '2024-01-15 10:30' },
    { id: 2, name: 'Google Analytics', type: 'analytics', status: 'connected', icon: Monitor, lastSync: '2024-01-15 09:45' },
    { id: 3, name: 'Mailchimp', type: 'marketing', status: 'disconnected', icon: Mail, lastSync: 'Never' },
    { id: 4, name: 'Booking.com', type: 'booking', status: 'connected', icon: Building, lastSync: '2024-01-15 08:20' },
    { id: 5, name: 'Expedia', type: 'booking', status: 'pending', icon: Building, lastSync: 'Setup Required' },
    { id: 6, name: 'TripAdvisor', type: 'reviews', status: 'connected', icon: Star, lastSync: '2024-01-15 07:15' }
  ]);

  // Room Amenities State
  const [amenities, setAmenities] = useState([
    { id: 1, name: 'Free Wi-Fi', icon: Wifi, enabled: true, description: 'Complimentary high-speed internet access' },
    { id: 2, name: 'Smart TV', icon: Tv, enabled: true, description: '55" Smart TV with streaming services' },
    { id: 3, name: 'Parking', icon: Car, enabled: true, description: 'Free self-parking available' },
    { id: 4, name: 'Coffee Maker', icon: Coffee, enabled: true, description: 'In-room coffee and tea facilities' },
    { id: 5, name: 'Room Service', icon: Bell, enabled: true, description: '24/7 room service available' }
  ]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your hotel operations, integrations, and system preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
          <Button onClick={handleSave} disabled={loading} className="min-w-[120px]">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {users.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            <span className="hidden sm:inline">Apps</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {integrations.filter(i => i.status === 'connected').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="amenities" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Amenities</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Hotel Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Hotel Information
                </CardTitle>
                <CardDescription>Basic information about your property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel-name">Hotel Name</Label>
                  <Input 
                    id="hotel-name" 
                    value={hotelSettings.name}
                    onChange={(e) => setHotelSettings({...hotelSettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-address">Address</Label>
                  <Textarea 
                    id="hotel-address" 
                    value={hotelSettings.address}
                    onChange={(e) => setHotelSettings({...hotelSettings, address: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-phone">Phone Number</Label>
                    <Input 
                      id="hotel-phone" 
                      value={hotelSettings.phone}
                      onChange={(e) => setHotelSettings({...hotelSettings, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hotel-email">Email Address</Label>
                    <Input 
                      id="hotel-email" 
                      type="email" 
                      value={hotelSettings.email}
                      onChange={(e) => setHotelSettings({...hotelSettings, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-website">Website</Label>
                  <Input 
                    id="hotel-website" 
                    value={hotelSettings.website}
                    onChange={(e) => setHotelSettings({...hotelSettings, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-description">Description</Label>
                  <Textarea 
                    id="hotel-description" 
                    value={hotelSettings.description}
                    onChange={(e) => setHotelSettings({...hotelSettings, description: e.target.value})}
                    rows={3}
                    placeholder="Describe your hotel..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operational Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operational Settings
                </CardTitle>
                <CardDescription>Configure your hotel's operational parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select value={hotelSettings.timeZone} onValueChange={(value) => setHotelSettings({...hotelSettings, timeZone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin-time">Check-in Time</Label>
                    <Input 
                      id="checkin-time" 
                      type="time" 
                      value={hotelSettings.checkInTime}
                      onChange={(e) => setHotelSettings({...hotelSettings, checkInTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-time">Check-out Time</Label>
                    <Input 
                      id="checkout-time" 
                      type="time" 
                      value={hotelSettings.checkOutTime}
                      onChange={(e) => setHotelSettings({...hotelSettings, checkOutTime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={hotelSettings.currency} onValueChange={(value) => setHotelSettings({...hotelSettings, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                        <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-occupancy">Max Room Occupancy</Label>
                    <Input 
                      id="max-occupancy" 
                      type="number" 
                      value={hotelSettings.maxOccupancy}
                      onChange={(e) => setHotelSettings({...hotelSettings, maxOccupancy: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input 
                      id="tax-rate" 
                      type="number" 
                      step="0.1" 
                      value={hotelSettings.taxRate}
                      onChange={(e) => setHotelSettings({...hotelSettings, taxRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-fee">Service Fee (%)</Label>
                    <Input 
                      id="service-fee" 
                      type="number" 
                      step="0.1" 
                      value={hotelSettings.serviceFee}
                      onChange={(e) => setHotelSettings({...hotelSettings, serviceFee: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation-policy">Cancellation Policy</Label>
                  <Select value={hotelSettings.cancellationPolicy} onValueChange={(value) => setHotelSettings({...hotelSettings, cancellationPolicy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible (Free cancellation up to 1 day before)</SelectItem>
                      <SelectItem value="24-hour">24-hour notice required</SelectItem>
                      <SelectItem value="48-hour">48-hour notice required</SelectItem>
                      <SelectItem value="strict">Strict (No refunds)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users & Permissions Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">User Management</h2>
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account with specific role and permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input id="user-name" placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email Address</Label>
                    <Input id="user-email" type="email" placeholder="user@armaflex.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="housekeeping">Housekeeping</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="management">Management</SelectItem>
                        <SelectItem value="front-desk">Front Desk</SelectItem>
                        <SelectItem value="housekeeping">Housekeeping</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Create User</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="hidden sm:table-cell">Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{user.department}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure permissions for each user role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['admin', 'manager', 'receptionist', 'housekeeping'].map((role) => (
                  <div key={role} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-4 capitalize">{role}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {['Dashboard', 'Guests', 'Rooms', 'Billing', 'Reports', 'Staff', 'Settings', 'Notifications'].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch 
                            id={`${role}-${permission}`} 
                            defaultChecked={role === 'admin' || (role === 'manager' && permission !== 'Settings')} 
                          />
                          <Label htmlFor={`${role}-${permission}`} className="text-sm cursor-pointer">
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Integrations</h2>
            <p className="text-muted-foreground">Connect and manage third-party services and API integrations</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <integration.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize">{integration.type}</p>
                      </div>
                    </div>
                    <Badge 
                      className={getStatusColor(integration.status)}
                      variant="secondary"
                    >
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Last sync: {integration.lastSync}
                  </p>
                  <div className="flex items-center gap-2">
                    {integration.status === 'connected' ? (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    ) : integration.status === 'pending' ? (
                      <Button size="sm" className="flex-1">
                        <Clock className="h-4 w-4 mr-2" />
                        Complete Setup
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Manage API keys and webhook endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type={showApiKey ? "text" : "password"}
                    value="sk_live_abcd1234567890efghijklmnop"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard("sk_live_abcd1234567890efghijklmnop")}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="webhook-url"
                    value="https://api.armaflex.com/webhooks/events"
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Amenities Tab */}
        <TabsContent value="amenities" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Room Amenities</h2>
            <p className="text-muted-foreground">Configure available amenities and services for your rooms</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((amenity) => (
              <Card key={amenity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <amenity.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{amenity.name}</h3>
                        <p className="text-sm text-muted-foreground">{amenity.description}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={amenity.enabled}
                      onCheckedChange={(checked) => 
                        setAmenities(amenities.map(a => 
                          a.id === amenity.id ? {...a, enabled: checked} : a
                        ))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add Custom Amenity</CardTitle>
              <CardDescription>Create custom amenities for your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amenity-name">Amenity Name</Label>
                  <Input id="amenity-name" placeholder="e.g., Spa Services" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amenity-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="comfort">Comfort</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenity-description">Description</Label>
                <Textarea 
                  id="amenity-description" 
                  placeholder="Describe this amenity..."
                  rows={2}
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Amenity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Security & Backup</h2>
            <p className="text-muted-foreground">Configure security settings, backup schedules, and access controls</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Password Complexity</Label>
                    <p className="text-xs text-muted-foreground">Enforce strong password requirements</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Email Verification</Label>
                    <p className="text-xs text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch 
                    checked={systemConfig.requireEmailVerification}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, requireEmailVerification: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    value={systemConfig.sessionTimeout}
                    onChange={(e) => setSystemConfig({...systemConfig, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Max Login Attempts</Label>
                  <Input 
                    id="max-attempts" 
                    type="number" 
                    defaultValue="5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Backup Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Automatic Backups</Label>
                    <p className="text-xs text-muted-foreground">Schedule daily database backups</p>
                  </div>
                  <Switch 
                    checked={systemConfig.autoBackup}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, autoBackup: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention">Backup Retention (days)</Label>
                  <Input 
                    id="retention" 
                    type="number" 
                    defaultValue="30"
                  />
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Latest Backup
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Backups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Backups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '2024-01-15 10:30', size: '245 MB', status: 'completed' },
                  { date: '2024-01-14 10:30', size: '242 MB', status: 'completed' },
                  { date: '2024-01-13 10:30', size: '238 MB', status: 'completed' },
                  { date: '2024-01-12 10:30', size: '235 MB', status: 'completed' }
                ].map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{backup.date}</p>
                        <p className="text-xs text-muted-foreground">{backup.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {backup.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">System Configuration</h2>
            <p className="text-muted-foreground">Configure system preferences, maintenance tools, and performance settings</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Disable public access to the system</p>
                  </div>
                  <Switch 
                    checked={systemConfig.maintenanceMode}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, maintenanceMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Debug Mode</Label>
                    <p className="text-xs text-muted-foreground">Enable detailed error logging</p>
                  </div>
                  <Switch 
                    checked={systemConfig.debugMode}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, debugMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Analytics</Label>
                    <p className="text-xs text-muted-foreground">Collect usage analytics</p>
                  </div>
                  <Switch 
                    checked={systemConfig.enableAnalytics}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, enableAnalytics: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Guest Registration</Label>
                    <p className="text-xs text-muted-foreground">Allow public guest registration</p>
                  </div>
                  <Switch 
                    checked={systemConfig.allowGuestRegistration}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, allowGuestRegistration: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-file-size">Max File Upload Size (MB)</Label>
                  <Input 
                    id="max-file-size" 
                    type="number" 
                    value={systemConfig.maxFileSize}
                    onChange={(e) => setSystemConfig({...systemConfig, maxFileSize: parseInt(e.target.value)})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear System Cache
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={loading}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={loading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Run Health Check
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={loading}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security Scan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">245MB</div>
                  <div className="text-sm text-muted-foreground">Database Size</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1,234</div>
                  <div className="text-sm text-muted-foreground">Active Sessions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">150ms</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 w-full rounded-md border p-4">
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-green-600">[2024-01-15 10:35:22] INFO: System health check completed successfully</div>
                  <div className="text-blue-600">[2024-01-15 10:30:15] INFO: Database backup completed (245MB)</div>
                  <div className="text-blue-600">[2024-01-15 10:25:08] INFO: Cache cleared successfully</div>
                  <div className="text-yellow-600">[2024-01-15 10:20:03] WARN: High memory usage detected (85%)</div>
                  <div className="text-green-600">[2024-01-15 10:15:45] INFO: User login: jovan.k@armaflex.com</div>
                  <div className="text-blue-600">[2024-01-15 10:10:22] INFO: Notification sent to 15 users</div>
                  <div className="text-green-600">[2024-01-15 10:05:18] INFO: Room status updated: Room 301</div>
                  <div className="text-blue-600">[2024-01-15 10:00:12] INFO: Daily reports generated</div>
                </div>
              </ScrollArea>
              <Button variant="outline" className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" />
                Download Full Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
