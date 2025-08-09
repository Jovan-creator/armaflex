import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { 
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Search,
  Filter,
  User,
  MapPin,
  DollarSign,
  FileText,
  Camera,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Activity,
  Settings,
  Zap,
  Droplets,
  Wind,
  Thermometer
} from 'lucide-react';

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [maintenanceRequests, setMaintenanceRequests] = useState([
    {
      id: 1,
      title: 'Air Conditioning Not Working',
      location: 'Room 301',
      priority: 'high',
      status: 'in-progress',
      category: 'HVAC',
      assignedTo: 'Mike Wilson',
      requestedBy: 'Sarah Johnson',
      dateCreated: '2024-01-15',
      estimatedCompletion: '2024-01-16',
      description: 'Guest reported AC unit not cooling properly',
      cost: 0
    },
    {
      id: 2,
      title: 'Leaky Faucet',
      location: 'Room 205',
      priority: 'medium',
      status: 'pending',
      category: 'Plumbing',
      assignedTo: null,
      requestedBy: 'Emma Davis',
      dateCreated: '2024-01-15',
      estimatedCompletion: null,
      description: 'Bathroom sink faucet has a constant drip',
      cost: 0
    },
    {
      id: 3,
      title: 'Elevator Maintenance',
      location: 'Main Elevator',
      priority: 'high',
      status: 'scheduled',
      category: 'Mechanical',
      assignedTo: 'External Contractor',
      requestedBy: 'System',
      dateCreated: '2024-01-12',
      estimatedCompletion: '2024-01-20',
      description: 'Monthly elevator inspection and maintenance',
      cost: 500
    },
    {
      id: 4,
      title: 'Light Bulb Replacement',
      location: 'Lobby',
      priority: 'low',
      status: 'completed',
      category: 'Electrical',
      assignedTo: 'Mike Wilson',
      requestedBy: 'Front Desk',
      dateCreated: '2024-01-14',
      estimatedCompletion: '2024-01-14',
      description: 'Replace burnt out LED lights in main chandelier',
      cost: 45
    }
  ]);

  const [scheduledMaintenance, setScheduledMaintenance] = useState([
    {
      id: 1,
      equipment: 'HVAC System',
      location: 'Building Wide',
      type: 'Preventive',
      frequency: 'Monthly',
      nextDue: '2024-01-25',
      lastCompleted: '2023-12-25',
      technician: 'HVAC Specialists Inc.',
      cost: 800
    },
    {
      id: 2,
      equipment: 'Fire Safety System',
      location: 'All Floors',
      type: 'Inspection',
      frequency: 'Quarterly',
      nextDue: '2024-02-15',
      lastCompleted: '2023-11-15',
      technician: 'Fire Safety Co.',
      cost: 350
    },
    {
      id: 3,
      equipment: 'Pool Equipment',
      location: 'Pool Area',
      type: 'Maintenance',
      frequency: 'Weekly',
      nextDue: '2024-01-20',
      lastCompleted: '2024-01-13',
      technician: 'Pool Maintenance Pro',
      cost: 200
    }
  ]);

  const [technicians, setTechnicians] = useState([
    {
      id: 1,
      name: 'Mike Wilson',
      specialization: 'General Maintenance',
      phone: '+1 (555) 123-4567',
      email: 'mike.w@armaflex.com',
      status: 'available',
      currentTasks: 2
    },
    {
      id: 2,
      name: 'HVAC Specialists Inc.',
      specialization: 'HVAC Systems',
      phone: '+1 (555) 987-6543',
      email: 'service@hvacspecialists.com',
      status: 'external',
      currentTasks: 1
    },
    {
      id: 3,
      name: 'John Martinez',
      specialization: 'Electrical',
      phone: '+1 (555) 456-7890',
      email: 'john.m@armaflex.com',
      status: 'busy',
      currentTasks: 4
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HVAC': return <Wind className="h-4 w-4" />;
      case 'Plumbing': return <Droplets className="h-4 w-4" />;
      case 'Electrical': return <Zap className="h-4 w-4" />;
      case 'Mechanical': return <Settings className="h-4 w-4" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const totalRequests = maintenanceRequests.length;
  const pendingRequests = maintenanceRequests.filter(req => req.status === 'pending').length;
  const inProgressRequests = maintenanceRequests.filter(req => req.status === 'in-progress').length;
  const completedThisMonth = maintenanceRequests.filter(req => req.status === 'completed').length;
  const totalCost = maintenanceRequests.reduce((sum, req) => sum + req.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
          <p className="text-muted-foreground">
            Track repairs, schedule maintenance, and manage work orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
                <DialogDescription>Submit a new maintenance work order</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input id="title" placeholder="Brief description of the issue" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Room number or area" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="mechanical">Mechanical</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Detailed description of the issue..."
                    rows={3}
                  />
                </div>
                <Button className="w-full">Submit Request</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="requests">Work Orders</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Work Orders Tab */}
        <TabsContent value="requests" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{totalRequests}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingRequests}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{inProgressRequests}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completedThisMonth}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
              <CardDescription>Active and recent maintenance work orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="text-sm text-muted-foreground">#{request.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(request.category)}
                            <span>{request.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(request.priority)} variant="secondary">
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)} variant="secondary">
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.assignedTo ? (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="text-sm">{request.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.estimatedCompletion ? (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              <span className="text-sm">{request.estimatedCompletion}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              View
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
        </TabsContent>

        {/* Scheduled Maintenance Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
              <CardDescription>Preventive maintenance and regular inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledMaintenance.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.equipment}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>{item.frequency}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span className="text-sm">{item.nextDue}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.technician}</TableCell>
                        <TableCell>${item.cost}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              Schedule
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
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
        </TabsContent>

        {/* Technicians Tab */}
        <TabsContent value="technicians" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Technicians</CardTitle>
              <CardDescription>Manage internal and external maintenance staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {technicians.map((tech) => (
                  <Card key={tech.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{tech.name}</h3>
                          <p className="text-sm text-muted-foreground">{tech.specialization}</p>
                        </div>
                        <Badge 
                          variant={tech.status === 'available' ? 'default' : 
                                 tech.status === 'busy' ? 'destructive' : 'secondary'}
                        >
                          {tech.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{tech.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{tech.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-3 w-3" />
                          <span>{tech.currentTasks} active tasks</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Button size="sm" className="w-full">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Costs</CardTitle>
                <CardDescription>Monthly maintenance expenditure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Month</span>
                    <span className="text-2xl font-bold">${totalCost.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preventive Maintenance</span>
                      <span>$1,350</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Emergency Repairs</span>
                      <span>$245</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Scheduled Inspections</span>
                      <span>$500</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Categories</CardTitle>
                <CardDescription>Breakdown by maintenance type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['HVAC', 'Plumbing', 'Electrical', 'Mechanical'].map((category) => {
                    const count = maintenanceRequests.filter(req => req.category === category).length;
                    const percentage = (count / totalRequests) * 100;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            {category}
                          </span>
                          <span>{count} requests ({Math.round(percentage)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key maintenance performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">On-time Completion</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.5h</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.8</div>
                  <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Maintenance Calendar</CardTitle>
                <CardDescription>Schedule and track maintenance activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded">
                    <CalendarIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">HVAC Inspection</p>
                      <p className="text-xs text-muted-foreground">Building Wide - Jan 25</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded">
                    <CalendarIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pool Maintenance</p>
                      <p className="text-xs text-muted-foreground">Pool Area - Jan 20</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded">
                    <CalendarIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Fire Safety Check</p>
                      <p className="text-xs text-muted-foreground">All Floors - Feb 15</p>
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
