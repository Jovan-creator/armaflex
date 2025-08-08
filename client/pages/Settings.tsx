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
  Tool,
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
  Languages
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system preferences, user permissions, and integrations</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="property" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Property</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Finance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Language</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Tool className="h-4 w-4" />
            <span className="hidden sm:inline">Maintenance</span>
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">System Users</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account with specific role and permissions</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Enter full name" />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="user@armaflex.com" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure permissions for each user role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {['admin', 'manager', 'receptionist', 'housekeeping'].map((role) => (
                  <div key={role} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 capitalize">{role}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Dashboard', 'Guests', 'Rooms', 'Billing', 'Reports', 'Staff', 'Settings', 'Notifications'].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch id={`${role}-${permission}`} defaultChecked={role === 'admin' || (role === 'manager' && permission !== 'Settings')} />
                          <Label htmlFor={`${role}-${permission}`} className="text-sm">{permission}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>Configure general system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <Switch 
                      id="maintenance" 
                      checked={systemConfig.maintenanceMode}
                      onCheckedChange={(checked) => setSystemConfig({...systemConfig, maintenanceMode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug">Debug Mode</Label>
                    <Switch 
                      id="debug" 
                      checked={systemConfig.debugMode}
                      onCheckedChange={(checked) => setSystemConfig({...systemConfig, debugMode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="backup">Auto Backup</Label>
                    <Switch 
                      id="backup" 
                      checked={systemConfig.autoBackup}
                      onCheckedChange={(checked) => setSystemConfig({...systemConfig, autoBackup: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics">Enable Analytics</Label>
                    <Switch 
                      id="analytics" 
                      checked={systemConfig.enableAnalytics}
                      onCheckedChange={(checked) => setSystemConfig({...systemConfig, enableAnalytics: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="session-timeout" 
                      type="number" 
                      value={systemConfig.sessionTimeout}
                      onChange={(e) => setSystemConfig({...systemConfig, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                    <Input 
                      id="max-file-size" 
                      type="number" 
                      value={systemConfig.maxFileSize}
                      onChange={(e) => setSystemConfig({...systemConfig, maxFileSize: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hotel Property Tab */}
        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Hotel Property Settings
              </CardTitle>
              <CardDescription>Configure your hotel's basic information and operational settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hotel-name">Hotel Name</Label>
                    <Input 
                      id="hotel-name" 
                      value={hotelConfig.name}
                      onChange={(e) => setHotelConfig({...hotelConfig, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hotel-address">Address</Label>
                    <Textarea 
                      id="hotel-address" 
                      value={hotelConfig.address}
                      onChange={(e) => setHotelConfig({...hotelConfig, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hotel-phone">Phone Number</Label>
                    <Input 
                      id="hotel-phone" 
                      value={hotelConfig.phone}
                      onChange={(e) => setHotelConfig({...hotelConfig, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hotel-email">Email Address</Label>
                    <Input 
                      id="hotel-email" 
                      type="email" 
                      value={hotelConfig.email}
                      onChange={(e) => setHotelConfig({...hotelConfig, email: e.target.value})}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select value={hotelConfig.timeZone} onValueChange={(value) => setHotelConfig({...hotelConfig, timeZone: value})}>
                      <SelectTrigger>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkin-time">Check-in Time</Label>
                      <Input 
                        id="checkin-time" 
                        type="time" 
                        value={hotelConfig.checkInTime}
                        onChange={(e) => setHotelConfig({...hotelConfig, checkInTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout-time">Check-out Time</Label>
                      <Input 
                        id="checkout-time" 
                        type="time" 
                        value={hotelConfig.checkOutTime}
                        onChange={(e) => setHotelConfig({...hotelConfig, checkOutTime: e.target.value})}
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
                />
              </div>

              <div>
                <Label htmlFor="hotel-logo">Hotel Logo</Label>
                <div className="flex items-center gap-4">
                  <Input id="hotel-logo" type="file" accept="image/*" />
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tax and Currency Settings
              </CardTitle>
              <CardDescription>Configure financial settings including taxes, fees, and currency preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select value={taxConfig.defaultCurrency} onValueChange={(value) => setTaxConfig({...taxConfig, defaultCurrency: value})}>
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
                  <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input 
                      id="tax-rate" 
                      type="number" 
                      step="0.1" 
                      value={taxConfig.taxRate}
                      onChange={(e) => setTaxConfig({...taxConfig, taxRate: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="service-fee">Service Fee (%)</Label>
                    <Input 
                      id="service-fee" 
                      type="number" 
                      step="0.1" 
                      value={taxConfig.serviceFee}
                      onChange={(e) => setTaxConfig({...taxConfig, serviceFee: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multi-currency">Enable Multi-Currency</Label>
                    <Switch 
                      id="multi-currency" 
                      checked={taxConfig.enableMultiCurrency}
                      onCheckedChange={(checked) => setTaxConfig({...taxConfig, enableMultiCurrency: checked})}
                    />
                  </div>
                </div>
              </div>

              {taxConfig.enableMultiCurrency && (
                <div>
                  <Label>Accepted Currencies</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'].map((currency) => (
                      <div key={currency} className="flex items-center space-x-2">
                        <Switch 
                          id={currency} 
                          defaultChecked={taxConfig.acceptedCurrencies.includes(currency)}
                        />
                        <Label htmlFor={currency} className="text-sm">{currency}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email & Notification Preferences
              </CardTitle>
              <CardDescription>Configure email servers, SMS providers, and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-enabled">Email Notifications</Label>
                  <Switch 
                    id="email-enabled" 
                    checked={notificationConfig.emailEnabled}
                    onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, emailEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-enabled">SMS Notifications</Label>
                  <Switch 
                    id="sms-enabled" 
                    checked={notificationConfig.smsEnabled}
                    onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, smsEnabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-enabled">Push Notifications</Label>
                  <Switch 
                    id="push-enabled" 
                    checked={notificationConfig.pushEnabled}
                    onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, pushEnabled: checked})}
                  />
                </div>
              </div>

              {notificationConfig.emailEnabled && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">Email Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email-host">SMTP Host</Label>
                      <Input 
                        id="email-host" 
                        value={notificationConfig.emailHost}
                        onChange={(e) => setNotificationConfig({...notificationConfig, emailHost: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-port">SMTP Port</Label>
                      <Input 
                        id="email-port" 
                        type="number" 
                        value={notificationConfig.emailPort}
                        onChange={(e) => setNotificationConfig({...notificationConfig, emailPort: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-user">Email Username</Label>
                      <Input 
                        id="email-user" 
                        value={notificationConfig.emailUser}
                        onChange={(e) => setNotificationConfig({...notificationConfig, emailUser: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-password">Email Password</Label>
                      <div className="flex">
                        <Input 
                          id="email-password" 
                          type={showApiKey ? "text" : "password"}
                          value={notificationConfig.emailPassword}
                          onChange={(e) => setNotificationConfig({...notificationConfig, emailPassword: e.target.value})}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {notificationConfig.smsEnabled && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">SMS Configuration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sms-provider">SMS Provider</Label>
                      <Select value={notificationConfig.smsProvider} onValueChange={(value) => setNotificationConfig({...notificationConfig, smsProvider: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="aws-sns">AWS SNS</SelectItem>
                          <SelectItem value="nexmo">Nexmo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sms-api-key">API Key</Label>
                      <Input 
                        id="sms-api-key" 
                        type="password"
                        value={notificationConfig.smsApiKey}
                        onChange={(e) => setNotificationConfig({...notificationConfig, smsApiKey: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5" />
                Integration Management
              </CardTitle>
              <CardDescription>Manage third-party integrations and API connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Connected Services</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Integration
                  </Button>
                </div>

                <div className="grid gap-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {integration.type === 'payment' && <DollarSign className="h-5 w-5" />}
                          {integration.type === 'analytics' && <Monitor className="h-5 w-5" />}
                          {integration.type === 'marketing' && <Mail className="h-5 w-5" />}
                          {integration.type === 'booking' && <Building className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last sync: {integration.lastSync}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            integration.status === 'connected' ? 'default' : 
                            integration.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {integration.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Backup & Security Settings
              </CardTitle>
              <CardDescription>Configure backup schedules, security policies, and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Backup Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Automatic Backups</Label>
                      <Switch defaultChecked />
                    </div>
                    <div>
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
                    <div>
                      <Label htmlFor="retention">Backup Retention (days)</Label>
                      <Input id="retention" type="number" defaultValue={30} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Security Policies</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Two-Factor Authentication</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Password Complexity</Label>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                      <Input id="password-expiry" type="number" defaultValue={90} />
                    </div>
                    <div>
                      <Label htmlFor="login-attempts">Max Login Attempts</Label>
                      <Input id="login-attempts" type="number" defaultValue={5} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Recent Backups</h4>
                <div className="space-y-2">
                  {[
                    { date: '2024-01-15 10:30', size: '245 MB', status: 'completed' },
                    { date: '2024-01-14 10:30', size: '242 MB', status: 'completed' },
                    { date: '2024-01-13 10:30', size: '238 MB', status: 'completed' }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{backup.date}</p>
                          <p className="text-sm text-muted-foreground">{backup.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {backup.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleBackup} 
                  disabled={loading} 
                  className="w-full mt-4"
                >
                  <Database className="mr-2 h-4 w-4" />
                  {loading ? 'Creating Backup...' : 'Create Manual Backup'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Appearance Customization
              </CardTitle>
              <CardDescription>Customize the look and feel of your hotel management system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="primary-color" 
                        type="color" 
                        value={themeConfig.primaryColor}
                        onChange={(e) => setThemeConfig({...themeConfig, primaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input 
                        value={themeConfig.primaryColor}
                        onChange={(e) => setThemeConfig({...themeConfig, primaryColor: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="accent-color" 
                        type="color" 
                        value={themeConfig.accentColor}
                        onChange={(e) => setThemeConfig({...themeConfig, accentColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input 
                        value={themeConfig.accentColor}
                        onChange={(e) => setThemeConfig({...themeConfig, accentColor: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch 
                      id="dark-mode" 
                      checked={themeConfig.darkMode}
                      onCheckedChange={(checked) => setThemeConfig({...themeConfig, darkMode: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={themeConfig.fontFamily} onValueChange={(value) => setThemeConfig({...themeConfig, fontFamily: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="border-radius">Border Radius</Label>
                    <Select value={themeConfig.borderRadius} onValueChange={(value) => setThemeConfig({...themeConfig, borderRadius: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label>Theme Preview</Label>
                <div className="border rounded-lg p-6 mt-2" style={{
                  backgroundColor: themeConfig.darkMode ? '#1f2937' : '#ffffff',
                  color: themeConfig.darkMode ? '#ffffff' : '#000000'
                }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: themeConfig.primaryColor }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: themeConfig.accentColor }}
                    ></div>
                    <span style={{ fontFamily: themeConfig.fontFamily }}>
                      Sample Text in {themeConfig.fontFamily}
                    </span>
                  </div>
                  <Button 
                    style={{ 
                      backgroundColor: themeConfig.primaryColor,
                      borderRadius: themeConfig.borderRadius === 'none' ? '0' : 
                                    themeConfig.borderRadius === 'small' ? '4px' :
                                    themeConfig.borderRadius === 'medium' ? '8px' : '12px'
                    }}
                  >
                    Sample Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Language & Localization
              </CardTitle>
              <CardDescription>Configure language settings and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="default-language">Default Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mm/dd/yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="number-format">Number Format</Label>
                    <Select defaultValue="us">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">1,234.56 (US)</SelectItem>
                        <SelectItem value="eu">1.234,56 (EU)</SelectItem>
                        <SelectItem value="in">1,23,456.78 (Indian)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label>Available Languages</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Switch id={language} defaultChecked={language === 'English'} />
                      <Label htmlFor={language} className="text-sm">{language}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tool className="h-5 w-5" />
                System Maintenance Tools
              </CardTitle>
              <CardDescription>Perform system maintenance, diagnostics, and optimization tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Database Maintenance</h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleSystemMaintenance('Database Optimization')}
                      disabled={loading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Optimize Database
                    </Button>
                    <Button 
                      onClick={() => handleSystemMaintenance('Cache Clear')}
                      disabled={loading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Clear Cache
                    </Button>
                    <Button 
                      onClick={() => handleSystemMaintenance('Index Rebuild')}
                      disabled={loading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Tool className="mr-2 h-4 w-4" />
                      Rebuild Indexes
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">System Diagnostics</h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleSystemMaintenance('Health Check')}
                      disabled={loading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Run Health Check
                    </Button>
                    <Button 
                      onClick={() => handleSystemMaintenance('Performance Test')}
                      disabled={loading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      Performance Test
                    </Button>
                    <Button 
                      onClick={() => handleSystemMaintenance('Security Scan')}
                      disabled={loading}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security Scan
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">System Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">System Logs</h4>
                <div className="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto text-sm font-mono">
                  <div className="space-y-1">
                    <div>[2024-01-15 10:35:22] INFO: System health check completed successfully</div>
                    <div>[2024-01-15 10:30:15] INFO: Database backup completed (245MB)</div>
                    <div>[2024-01-15 10:25:08] INFO: Cache cleared successfully</div>
                    <div>[2024-01-15 10:20:03] WARN: High memory usage detected (85%)</div>
                    <div>[2024-01-15 10:15:45] INFO: User login: jovan.k@armaflex.com</div>
                    <div>[2024-01-15 10:10:22] INFO: Notification sent to 15 users</div>
                    <div>[2024-01-15 10:05:18] INFO: Room status updated: Room 301</div>
                    <div>[2024-01-15 10:00:12] INFO: Daily reports generated</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
