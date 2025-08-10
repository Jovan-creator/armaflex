import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Mail,
  MessageSquare,
  Settings,
  Calendar,
  CreditCard,
  AlertTriangle,
  Clock,
  Users,
  Wrench,
  Star,
  Send,
  TestTube,
  CheckCircle,
  XCircle,
  Phone,
} from "lucide-react";

interface NotificationPreferences {
  email: {
    bookingConfirmation: boolean;
    paymentReceipts: boolean;
    checkInReminders: boolean;
    checkOutReminders: boolean;
    staffAlerts: boolean;
    maintenanceUpdates: boolean;
    promotionalOffers: boolean;
    systemUpdates: boolean;
  };
  sms: {
    bookingConfirmation: boolean;
    paymentReceipts: boolean;
    checkInReminders: boolean;
    checkOutReminders: boolean;
    urgentAlerts: boolean;
    staffEmergencies: boolean;
  };
  preferences: {
    emailAddress: string;
    phoneNumber: string;
    enableEmail: boolean;
    enableSMS: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    language: string;
    timezone: string;
  };
}

const defaultPreferences: NotificationPreferences = {
  email: {
    bookingConfirmation: true,
    paymentReceipts: true,
    checkInReminders: true,
    checkOutReminders: true,
    staffAlerts: true,
    maintenanceUpdates: false,
    promotionalOffers: false,
    systemUpdates: true,
  },
  sms: {
    bookingConfirmation: false,
    paymentReceipts: false,
    checkInReminders: true,
    checkOutReminders: false,
    urgentAlerts: true,
    staffEmergencies: true,
  },
  preferences: {
    emailAddress: '',
    phoneNumber: '',
    enableEmail: true,
    enableSMS: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    language: 'en',
    timezone: 'UTC',
  },
};

export default function NotificationSettings() {
  const { user } = useUser();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<{ email: boolean; sms: boolean }>({ email: false, sms: false });

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/hotel/notifications/preferences', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences({ ...defaultPreferences, ...data });
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/hotel/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast({
          title: "Settings saved",
          description: "Your notification preferences have been updated.",
        });
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async (type: 'email' | 'sms') => {
    if (!user) return;

    setTesting(prev => ({ ...prev, [type]: true }));
    
    try {
      const response = await fetch('/api/hotel/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          type,
          email: preferences.preferences.emailAddress,
          phone: preferences.preferences.phoneNumber 
        }),
      });

      if (response.ok) {
        toast({
          title: `Test ${type} sent`,
          description: `A test ${type} notification has been sent.`,
        });
      } else {
        throw new Error(`Failed to send test ${type}`);
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: `Failed to send test ${type}. Please check your settings.`,
        variant: "destructive",
      });
    } finally {
      setTesting(prev => ({ ...prev, [type]: false }));
    }
  };

  const updateEmailPreference = (key: keyof NotificationPreferences['email'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const updateSMSPreference = (key: keyof NotificationPreferences['sms'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      sms: { ...prev.sms, [key]: value }
    }));
  };

  const updatePreference = (key: keyof NotificationPreferences['preferences'], value: any) => {
    setPreferences(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }));
  };

  const emailNotificationTypes = [
    { key: 'bookingConfirmation', label: 'Booking Confirmations', icon: Calendar, description: 'Receive confirmation when bookings are made' },
    { key: 'paymentReceipts', label: 'Payment Receipts', icon: CreditCard, description: 'Get receipts for all payments processed' },
    { key: 'checkInReminders', label: 'Check-in Reminders', icon: Clock, description: 'Reminders before your check-in time' },
    { key: 'checkOutReminders', label: 'Check-out Reminders', icon: Clock, description: 'Reminders before check-out time' },
    { key: 'staffAlerts', label: 'Staff Alerts', icon: Users, description: 'Important alerts for staff members' },
    { key: 'maintenanceUpdates', label: 'Maintenance Updates', icon: Wrench, description: 'Updates about hotel maintenance' },
    { key: 'promotionalOffers', label: 'Promotional Offers', icon: Star, description: 'Special offers and promotions' },
    { key: 'systemUpdates', label: 'System Updates', icon: Settings, description: 'Important system announcements' },
  ];

  const smsNotificationTypes = [
    { key: 'bookingConfirmation', label: 'Booking Confirmations', icon: Calendar, description: 'SMS confirmation for bookings' },
    { key: 'paymentReceipts', label: 'Payment Receipts', icon: CreditCard, description: 'SMS receipts for payments' },
    { key: 'checkInReminders', label: 'Check-in Reminders', icon: Clock, description: 'SMS reminders before check-in' },
    { key: 'checkOutReminders', label: 'Check-out Reminders', icon: Clock, description: 'SMS reminders before check-out' },
    { key: 'urgentAlerts', label: 'Urgent Alerts', icon: AlertTriangle, description: 'Important urgent notifications' },
    { key: 'staffEmergencies', label: 'Staff Emergencies', icon: Users, description: 'Emergency alerts for staff' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Configure how you want to receive notifications</p>
        </div>
        <Button onClick={savePreferences} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Email Notifications</span>
                <Badge variant={preferences.preferences.enableEmail ? "default" : "secondary"}>
                  {preferences.preferences.enableEmail ? "Enabled" : "Disabled"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Choose which email notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-email">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Master switch for all email notifications</p>
                </div>
                <Switch
                  id="enable-email"
                  checked={preferences.preferences.enableEmail}
                  onCheckedChange={(checked) => updatePreference('enableEmail', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={preferences.preferences.emailAddress}
                    onChange={(e) => updatePreference('emailAddress', e.target.value)}
                    disabled={!preferences.preferences.enableEmail}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => testNotification('email')}
                    disabled={!preferences.preferences.enableEmail || !preferences.preferences.emailAddress || testing.email}
                  >
                    {testing.email ? <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <TestTube className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                {emailNotificationTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div key={type.key} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.email[type.key as keyof NotificationPreferences['email']]}
                        onCheckedChange={(checked) => updateEmailPreference(type.key as keyof NotificationPreferences['email'], checked)}
                        disabled={!preferences.preferences.enableEmail}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>SMS Notifications</span>
                <Badge variant={preferences.preferences.enableSMS ? "default" : "secondary"}>
                  {preferences.preferences.enableSMS ? "Enabled" : "Disabled"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Configure SMS notifications for urgent and important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-sms">Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Master switch for all SMS notifications</p>
                </div>
                <Switch
                  id="enable-sms"
                  checked={preferences.preferences.enableSMS}
                  onCheckedChange={(checked) => updatePreference('enableSMS', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex space-x-2">
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={preferences.preferences.phoneNumber}
                    onChange={(e) => updatePreference('phoneNumber', e.target.value)}
                    disabled={!preferences.preferences.enableSMS}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => testNotification('sms')}
                    disabled={!preferences.preferences.enableSMS || !preferences.preferences.phoneNumber || testing.sms}
                  >
                    {testing.sms ? <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <TestTube className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Standard messaging rates may apply. SMS limited to urgent notifications only.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">SMS Notification Types</h4>
                {smsNotificationTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div key={type.key} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.sms[type.key as keyof NotificationPreferences['sms']]}
                        onCheckedChange={(checked) => updateSMSPreference(type.key as keyof NotificationPreferences['sms'], checked)}
                        disabled={!preferences.preferences.enableSMS}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>
                Configure general notification preferences and quiet hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Quiet Hours</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">Suppress non-urgent notifications during specified hours</p>
                  </div>
                  <Switch
                    id="quiet-hours"
                    checked={preferences.preferences.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      updatePreference('quietHours', { ...preferences.preferences.quietHours, enabled: checked })
                    }
                  />
                </div>

                {preferences.preferences.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={preferences.preferences.quietHours.start}
                        onChange={(e) => 
                          updatePreference('quietHours', { 
                            ...preferences.preferences.quietHours, 
                            start: e.target.value 
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={preferences.preferences.quietHours.end}
                        onChange={(e) => 
                          updatePreference('quietHours', { 
                            ...preferences.preferences.quietHours, 
                            end: e.target.value 
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Language & Region</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Language</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={preferences.preferences.language}
                      onChange={(e) => updatePreference('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={preferences.preferences.timezone}
                      onChange={(e) => updatePreference('timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Service Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">Email Service</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Operational</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">SMS Service</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Operational</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
