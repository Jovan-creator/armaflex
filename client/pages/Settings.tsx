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
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User Management State
  const [users, setUsers] = useState([
    { id: 1, name: 'Jovan K', email: 'jovan.k@armaflex.com', role: 'admin', status: 'active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@armaflex.com', role: 'receptionist', status: 'active', lastLogin: '2024-01-15' },
    { id: 3, name: 'Mike Wilson', email: 'mike.w@armaflex.com', role: 'housekeeping', status: 'active', lastLogin: '2024-01-14' },
    { id: 4, name: 'Emma Davis', email: 'emma.d@armaflex.com', role: 'manager', status: 'inactive', lastLogin: '2024-01-10' }
  ]);

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    sessionTimeout: 60,
    maxFileSize: 50,
    enableAnalytics: true
  });

  // Hotel Property State
  const [hotelConfig, setHotelConfig] = useState({
    name: 'Armaflex Hotel',
    address: '123 Luxury Avenue, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@armaflex.com',
    website: 'www.armaflex.com',
    timeZone: 'America/New_York',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    logo: '',
    description: 'A premier luxury hotel offering exceptional service and amenities.'
  });

  // Tax and Currency State
  const [taxConfig, setTaxConfig] = useState({
    defaultCurrency: 'USD',
    taxRate: 8.5,
    serviceFee: 15,
    enableMultiCurrency: false,
    acceptedCurrencies: ['USD', 'EUR', 'GBP']
  });

  // Notification Settings State
  const [notificationConfig, setNotificationConfig] = useState({
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    emailHost: 'smtp.gmail.com',
    emailPort: 587,
    emailUser: 'notifications@armaflex.com',
    emailPassword: '••••••••',
    smsProvider: 'twilio',
    smsApiKey: '••••••••••••••••'
  });

  // Integration State
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Stripe Payment Gateway', type: 'payment', status: 'connected', lastSync: '2024-01-15 10:30' },
    { id: 2, name: 'Google Analytics', type: 'analytics', status: 'connected', lastSync: '2024-01-15 09:45' },
    { id: 3, name: 'Mailchimp Marketing', type: 'marketing', status: 'disconnected', lastSync: 'Never' },
    { id: 4, name: 'Booking.com Channel', type: 'booking', status: 'pending', lastSync: '2024-01-14 15:20' }
  ]);

  // Theme State
  const [themeConfig, setThemeConfig] = useState({
    primaryColor: '#1e40af',
    accentColor: '#d4af37',
    darkMode: false,
    customLogo: '',
    fontFamily: 'Inter',
    borderRadius: 'medium'
  });

  const tabs = [
    { id: 'users', label: 'Users', icon: Users, shortLabel: 'Users' },
    { id: 'system', label: 'System', icon: Settings, shortLabel: 'System' },
    { id: 'property', label: 'Property', icon: Building, shortLabel: 'Property' },
    { id: 'finance', label: 'Finance', icon: DollarSign, shortLabel: 'Finance' },
    { id: 'notifications', label: 'Notifications', icon: Mail, shortLabel: 'Notify' },
    { id: 'integrations', label: 'Integrations', icon: Puzzle, shortLabel: 'Apps' },
    { id: 'security', label: 'Security', icon: Shield, shortLabel: 'Security' },
    { id: 'theme', label: 'Theme', icon: Palette, shortLabel: 'Theme' },
    { id: 'localization', label: 'Language', icon: Globe, shortLabel: 'Lang' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, shortLabel: 'Maint' }
  ];

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Settings saved successfully!');
  };

  const handleBackup = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    alert('Backup completed successfully!');
  };

  const handleSystemMaintenance = async (action: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    alert(`${action} completed successfully!`);
  };

  const getCurrentTabLabel = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.label : 'Settings';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{getCurrentTabLabel()}</h1>
          </div>
          <Button onClick={handleSave} disabled={loading} size="sm">
            <Save className="mr-1 h-4 w-4" />
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col overflow-y-auto border-r bg-background">
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="mb-4">
                <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
                <p className="text-sm text-muted-foreground">Configure system preferences and integrations</p>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.label}
                  </Button>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <Button onClick={handleSave} disabled={loading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Settings Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <tab.icon className="mr-3 h-5 w-5" />
                      {tab.label}
                    </Button>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:pl-0">
          <div className="container mx-auto p-4 lg:p-8 space-y-6">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground">Configure system preferences, user permissions, and integrations</p>
              </div>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* User Management Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <h3 className="text-lg font-semibold">System Users</h3>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>Create a new user account with specific role and permissions</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" placeholder="Enter full name" />
                                  </div>
                                  <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="user@armaflex.com" />
                                  </div>
                                  <div>
                                    <Label htmlFor="role">Role</Label>
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
                                  <div>
                                    <Label htmlFor="department">Department</Label>
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
                                </div>
                                <Button className="w-full">Create User</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Mobile User Cards */}
                        <div className="lg:hidden space-y-4">
                          {users.map((user) => (
                            <Card key={user.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    <div className="flex gap-2">
                                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                        {user.role}
                                      </Badge>
                                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                        {user.status}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden lg:block">
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Role</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Last Login</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {users.map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                        {user.role}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                        {user.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{user.lastLogin}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Role Permissions</CardTitle>
                      <CardDescription>Configure permissions for each user role</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {['admin', 'manager', 'receptionist', 'housekeeping'].map((role) => (
                          <Card key={role}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base capitalize">{role}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {['Dashboard', 'Guests', 'Rooms', 'Billing', 'Reports', 'Staff', 'Settings', 'Notifications'].map((permission) => (
                                  <div key={permission} className="flex items-center space-x-2">
                                    <Switch 
                                      id={`${role}-${permission}`} 
                                      defaultChecked={role === 'admin' || (role === 'manager' && permission !== 'Settings')} 
                                    />
                                    <Label htmlFor={`${role}-${permission}`} className="text-sm">
                                      {permission}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* System Configuration Tab */}
              {activeTab === 'system' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      System Configuration
                    </CardTitle>
                    <CardDescription>Configure general system settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">System Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="maintenance">Maintenance Mode</Label>
                              <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                            </div>
                            <Switch 
                              id="maintenance" 
                              checked={systemConfig.maintenanceMode}
                              onCheckedChange={(checked) => setSystemConfig({...systemConfig, maintenanceMode: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="debug">Debug Mode</Label>
                              <p className="text-sm text-muted-foreground">Enable debug logging</p>
                            </div>
                            <Switch 
                              id="debug" 
                              checked={systemConfig.debugMode}
                              onCheckedChange={(checked) => setSystemConfig({...systemConfig, debugMode: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="backup">Auto Backup</Label>
                              <p className="text-sm text-muted-foreground">Automatic database backups</p>
                            </div>
                            <Switch 
                              id="backup" 
                              checked={systemConfig.autoBackup}
                              onCheckedChange={(checked) => setSystemConfig({...systemConfig, autoBackup: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="analytics">Enable Analytics</Label>
                              <p className="text-sm text-muted-foreground">Collect usage analytics</p>
                            </div>
                            <Switch 
                              id="analytics" 
                              checked={systemConfig.enableAnalytics}
                              onCheckedChange={(checked) => setSystemConfig({...systemConfig, enableAnalytics: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">Performance Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                            <Input 
                              id="session-timeout" 
                              type="number" 
                              value={systemConfig.sessionTimeout}
                              onChange={(e) => setSystemConfig({...systemConfig, sessionTimeout: parseInt(e.target.value)})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                            <Input 
                              id="max-file-size" 
                              type="number" 
                              value={systemConfig.maxFileSize}
                              onChange={(e) => setSystemConfig({...systemConfig, maxFileSize: parseInt(e.target.value)})}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hotel Property Tab */}
              {activeTab === 'property' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Hotel Property Settings
                    </CardTitle>
                    <CardDescription>Configure your hotel's basic information and operational settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="hotel-name">Hotel Name</Label>
                          <Input 
                            id="hotel-name" 
                            value={hotelConfig.name}
                            onChange={(e) => setHotelConfig({...hotelConfig, name: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hotel-address">Address</Label>
                          <Textarea 
                            id="hotel-address" 
                            value={hotelConfig.address}
                            onChange={(e) => setHotelConfig({...hotelConfig, address: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hotel-phone">Phone Number</Label>
                          <Input 
                            id="hotel-phone" 
                            value={hotelConfig.phone}
                            onChange={(e) => setHotelConfig({...hotelConfig, phone: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hotel-email">Email Address</Label>
                          <Input 
                            id="hotel-email" 
                            type="email" 
                            value={hotelConfig.email}
                            onChange={(e) => setHotelConfig({...hotelConfig, email: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="hotel-website">Website</Label>
                          <Input 
                            id="hotel-website" 
                            value={hotelConfig.website}
                            onChange={(e) => setHotelConfig({...hotelConfig, website: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="timezone">Time Zone</Label>
                          <Select value={hotelConfig.timeZone} onValueChange={(value) => setHotelConfig({...hotelConfig, timeZone: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                              <SelectItem value="Europe/London">GMT</SelectItem>
                              <SelectItem value="Europe/Paris">CET</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="checkin-time">Check-in Time</Label>
                            <Input 
                              id="checkin-time" 
                              type="time" 
                              value={hotelConfig.checkInTime}
                              onChange={(e) => setHotelConfig({...hotelConfig, checkInTime: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="checkout-time">Check-out Time</Label>
                            <Input 
                              id="checkout-time" 
                              type="time" 
                              value={hotelConfig.checkOutTime}
                              onChange={(e) => setHotelConfig({...hotelConfig, checkOutTime: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="hotel-description">Hotel Description</Label>
                      <Textarea 
                        id="hotel-description" 
                        value={hotelConfig.description}
                        onChange={(e) => setHotelConfig({...hotelConfig, description: e.target.value})}
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hotel-logo">Hotel Logo</Label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-1">
                        <Input id="hotel-logo" type="file" accept="image/*" />
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Other tabs would follow similar patterns... */}
              {activeTab === 'finance' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Tax and Currency Settings
                    </CardTitle>
                    <CardDescription>Configure financial settings including taxes, fees, and currency preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Finance settings content would go here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email & Notification Preferences
                    </CardTitle>
                    <CardDescription>Configure email servers, SMS providers, and notification settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Notification settings content would go here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'integrations' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Puzzle className="h-5 w-5" />
                      Integration Management
                    </CardTitle>
                    <CardDescription>Manage third-party integrations and API connections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Integration settings content would go here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Backup & Security Settings
                    </CardTitle>
                    <CardDescription>Configure backup schedules, security policies, and access controls</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Security settings content would go here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'theme' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Theme & Appearance Customization
                    </CardTitle>
                    <CardDescription>Customize the look and feel of your hotel management system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Theme settings content would go here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'localization' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="h-5 w-5" />
                      Language & Localization
                    </CardTitle>
                    <CardDescription>Configure language settings and regional preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Language settings content would go here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'maintenance' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      System Maintenance Tools
                    </CardTitle>
                    <CardDescription>Perform system maintenance, diagnostics, and optimization tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Maintenance tools content would go here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
