import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Globe,
  RefreshCw,
  Settings,
  Eye,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  BarChart3,
  Wifi,
  Building,
  Star,
  Users,
  Clock
} from 'lucide-react';

export default function ChannelManager() {
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: 'Booking.com',
      status: 'connected',
      lastSync: '2024-01-15 14:30',
      bookings: 45,
      revenue: 12500,
      commission: 15,
      logo: '🏨'
    },
    {
      id: 2,
      name: 'Expedia',
      status: 'connected',
      lastSync: '2024-01-15 14:25',
      bookings: 32,
      revenue: 8900,
      commission: 18,
      logo: '✈️'
    },
    {
      id: 3,
      name: 'Airbnb',
      status: 'pending',
      lastSync: 'Never',
      bookings: 0,
      revenue: 0,
      commission: 3,
      logo: '🏠'
    },
    {
      id: 4,
      name: 'Agoda',
      status: 'connected',
      lastSync: '2024-01-15 13:45',
      bookings: 28,
      revenue: 7200,
      commission: 20,
      logo: '🌏'
    }
  ]);

  const [rates, setRates] = useState([
    {
      roomType: 'Standard Room',
      baseRate: 120,
      weekendRate: 150,
      channels: {
        'booking': { rate: 125, available: true, inventory: 15 },
        'expedia': { rate: 128, available: true, inventory: 12 },
        'agoda': { rate: 122, available: true, inventory: 18 }
      }
    },
    {
      roomType: 'Deluxe Suite',
      baseRate: 200,
      weekendRate: 250,
      channels: {
        'booking': { rate: 210, available: true, inventory: 8 },
        'expedia': { rate: 215, available: true, inventory: 6 },
        'agoda': { rate: 205, available: true, inventory: 10 }
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Channel Manager</h1>
          <p className="text-muted-foreground">
            Manage rates, inventory, and bookings across all distribution channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All Channels
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Channel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rates">Rate Management</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Channel Status Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <Card key={channel.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{channel.logo}</div>
                      <div>
                        <CardTitle className="text-base">{channel.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {channel.commission}% commission
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(channel.status)} variant="secondary">
                      {channel.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bookings</span>
                      <span className="font-medium">{channel.bookings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-medium">${channel.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span className="font-medium text-xs">{channel.lastSync}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">105</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% vs last month
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$28,600</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% vs last month
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rate</p>
                    <p className="text-2xl font-bold">$142</p>
                    <p className="text-xs text-red-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -3% vs last month
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +5% vs last month
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Channel Activity</CardTitle>
              <CardDescription>Latest updates from your distribution channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rate update successful</p>
                    <p className="text-xs text-muted-foreground">
                      Updated rates for Standard Room on Booking.com - 2 min ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New booking received</p>
                    <p className="text-xs text-muted-foreground">
                      Deluxe Suite booking from Expedia - 15 min ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Inventory low warning</p>
                    <p className="text-xs text-muted-foreground">
                      Standard Room inventory below 5 on Agoda - 1 hour ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Management Tab */}
        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate Management</CardTitle>
              <CardDescription>Manage rates across all distribution channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rates.map((room, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{room.roomType}</h3>
                        <p className="text-sm text-muted-foreground">
                          Base Rate: ${room.baseRate} | Weekend: ${room.weekendRate}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Rates
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      {Object.entries(room.channels).map(([channel, data]) => (
                        <div key={channel} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium capitalize">{channel}.com</span>
                            <Switch checked={data.available} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Rate:</span>
                              <span className="font-medium">${data.rate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Inventory:</span>
                              <span className="font-medium">{data.inventory}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Monitor and adjust room availability across channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="date-range">Date Range:</Label>
                    <Input type="date" className="w-auto" />
                    <span>to</span>
                    <Input type="date" className="w-auto" />
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Total Inventory</TableHead>
                      <TableHead>Booking.com</TableHead>
                      <TableHead>Expedia</TableHead>
                      <TableHead>Agoda</TableHead>
                      <TableHead>Available</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Standard Room</TableCell>
                      <TableCell>50</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Deluxe Suite</TableCell>
                      <TableCell>20</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>6</TableCell>
                      <TableCell>10</TableCell>
                      <TableCell>
                        <Badge variant="destructive">-4</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Presidential Suite</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>0</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Revenue and booking performance by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channels.filter(c => c.status === 'connected').map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{channel.logo}</span>
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          <p className="text-xs text-muted-foreground">{channel.bookings} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${channel.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{channel.commission}% comm.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Comparison</CardTitle>
                <CardDescription>Compare your rates with market averages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Standard Room</span>
                      <Badge variant="secondary">Competitive</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Your Rate</p>
                        <p className="font-medium">$125</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Market Avg</p>
                        <p className="font-medium">$128</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Deluxe Suite</span>
                      <Badge variant="destructive">Below Market</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Your Rate</p>
                        <p className="font-medium">$210</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Market Avg</p>
                        <p className="font-medium">$235</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
