import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Edit,
  Save,
  Camera,
  Star,
  Gift,
  Crown,
  Trash2,
} from "lucide-react";

// Mock guest data
const mockGuest = {
  id: "G-001",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1985-03-15",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  preferences: {
    roomType: "suite",
    bedType: "king",
    smokingRoom: false,
    floorPreference: "high",
    specialRequests: "Extra pillows, late checkout when possible",
  },
  loyalty: {
    tier: "Gold",
    points: 15420,
    nextTierPoints: 4580,
    memberSince: "2020-06-15",
    totalStays: 28,
    totalSpent: 12450.00,
  },
  notifications: {
    email: {
      bookingConfirmations: true,
      promotions: false,
      newsletters: true,
      accountUpdates: true,
    },
    sms: {
      checkInReminders: true,
      bookingUpdates: false,
      promotions: false,
    },
    push: {
      enabled: true,
      bookingReminders: true,
      promotions: false,
    },
  },
  paymentMethods: [
    {
      id: "pm-1",
      type: "credit",
      last4: "1234",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "pm-2",
      type: "credit", 
      last4: "5678",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ],
};

export default function GuestProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState(mockGuest);
  const { toast } = useToast();

  const handleSave = async () => {
    // In real app, this would call an API
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
  };

  const getLoyaltyProgress = () => {
    const { points, nextTierPoints } = profileData.loyalty;
    const totalForNext = points + nextTierPoints;
    return (points / totalForNext) * 100;
  };

  const getLoyaltyBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'bg-amber-100 text-amber-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'diamond':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <Button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-xl bg-hotel-500 text-white">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-gray-600">{profileData.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getLoyaltyBadgeColor(profileData.loyalty.tier)}>
                  <Crown className="h-3 w-3 mr-1" />
                  {profileData.loyalty.tier} Member
                </Badge>
                <span className="text-sm text-gray-500">
                  Member since {new Date(profileData.loyalty.memberSince).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-hotel-600">{profileData.loyalty.points.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Loyalty Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={profileData.address.street}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, street: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.address.city}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, city: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profileData.address.state}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, state: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={profileData.address.zipCode}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, zipCode: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileData.address.country}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: {...profileData.address, country: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stay Preferences</CardTitle>
              <CardDescription>Customize your hotel stay experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roomType">Preferred Room Type</Label>
                  <Select
                    value={profileData.preferences.roomType}
                    onValueChange={(value) => setProfileData({
                      ...profileData,
                      preferences: {...profileData.preferences, roomType: value}
                    })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Room</SelectItem>
                      <SelectItem value="deluxe">Deluxe Room</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="presidential">Presidential Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bedType">Bed Preference</Label>
                  <Select
                    value={profileData.preferences.bedType}
                    onValueChange={(value) => setProfileData({
                      ...profileData,
                      preferences: {...profileData.preferences, bedType: value}
                    })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="king">King Bed</SelectItem>
                      <SelectItem value="queen">Queen Bed</SelectItem>
                      <SelectItem value="double">Double Beds</SelectItem>
                      <SelectItem value="twin">Twin Beds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="floorPreference">Floor Preference</Label>
                  <Select
                    value={profileData.preferences.floorPreference}
                    onValueChange={(value) => setProfileData({
                      ...profileData,
                      preferences: {...profileData.preferences, floorPreference: value}
                    })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Lower Floors (1-3)</SelectItem>
                      <SelectItem value="middle">Middle Floors (4-7)</SelectItem>
                      <SelectItem value="high">Higher Floors (8+)</SelectItem>
                      <SelectItem value="any">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smokingRoom"
                    checked={profileData.preferences.smokingRoom}
                    onCheckedChange={(checked) => setProfileData({
                      ...profileData,
                      preferences: {...profileData.preferences, smokingRoom: checked}
                    })}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="smokingRoom">Smoking Room</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any special requests or accommodations..."
                  value={profileData.preferences.specialRequests}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    preferences: {...profileData.preferences, specialRequests: e.target.value}
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5" />
                <span>Loyalty Program</span>
              </CardTitle>
              <CardDescription>Your membership status and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-hotel-600">{profileData.loyalty.points.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Current Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{profileData.loyalty.totalStays}</div>
                  <div className="text-sm text-gray-600">Total Stays</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">${profileData.loyalty.totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-hotel-50 to-hotel-100 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getLoyaltyBadgeColor(profileData.loyalty.tier)}>
                    <Crown className="h-3 w-3 mr-1" />
                    {profileData.loyalty.tier} Member
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {profileData.loyalty.nextTierPoints} points to next tier
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-hotel-500 h-2 rounded-full transition-all"
                    style={{ width: `${getLoyaltyProgress()}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Member Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Complimentary room upgrades</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Late checkout (until 2 PM)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority restaurant reservations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Welcome amenities</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-8 w-8 text-gray-600" />
                    <div>
                      <div className="font-medium">**** **** **** {method.last4}</div>
                      <div className="text-sm text-gray-600">
                        {method.brand} • Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge className="bg-green-100 text-green-800">Default</Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Email Notifications</h4>
                <div className="space-y-3">
                  {Object.entries(profileData.notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`email-${key}`} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <Switch
                        id={`email-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => setProfileData({
                          ...profileData,
                          notifications: {
                            ...profileData.notifications,
                            email: {...profileData.notifications.email, [key]: checked}
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">SMS Notifications</h4>
                <div className="space-y-3">
                  {Object.entries(profileData.notifications.sms).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={`sms-${key}`} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <Switch
                        id={`sms-${key}`}
                        checked={value}
                        onCheckedChange={(checked) => setProfileData({
                          ...profileData,
                          notifications: {
                            ...profileData.notifications,
                            sms: {...profileData.notifications.sms, [key]: checked}
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
