import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  Shield,
  ShieldCheck,
  Users,
  Coffee,
  Wrench,
  Calculator,
  ChefHat,
  HeadphonesIcon,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  MoreVertical,
} from "lucide-react";

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);

  const userRoles = {
    admin: {
      name: "Admin",
      icon: Shield,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: "Full system control and oversight",
      permissions: ["All modules", "User management", "System settings", "Reports & analytics"],
    },
    receptionist: {
      name: "Receptionist",
      icon: UserCheck,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Front desk operations and guest interactions",
      permissions: ["Bookings", "Check-in/out", "Payments", "Guest profiles"],
    },
    housekeeping: {
      name: "Housekeeping",
      icon: Coffee,
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Room cleanliness and maintenance",
      permissions: ["Cleaning tasks", "Room status", "Maintenance reports"],
    },
    maintenance: {
      name: "Maintenance",
      icon: Wrench,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      description: "Repairs and technical issues",
      permissions: ["Maintenance tasks", "Repair logs", "Inventory requests"],
    },
    accountant: {
      name: "Accountant",
      icon: Calculator,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      description: "Financial operations oversight",
      permissions: ["Financial reports", "Payments", "Refunds", "Data export"],
    },
    restaurant: {
      name: "Restaurant Staff",
      icon: ChefHat,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Food and beverage services",
      permissions: ["Menu management", "Orders", "Table reservations", "F&B billing"],
    },
    support: {
      name: "Support",
      icon: HeadphonesIcon,
      color: "bg-pink-100 text-pink-800 border-pink-200",
      description: "System support and user assistance",
      permissions: ["Support tickets", "System logs", "User assistance"],
    },
    guest: {
      name: "Guest",
      icon: User,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      description: "Public interface access",
      permissions: ["Browse rooms", "Make bookings", "Leave reviews"],
    },
  };

  const staff = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@armaflex.com",
      phone: "+1 (555) 123-4567",
      role: "admin",
      department: "Management",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-15 09:30",
      schedule: "Full-time",
      performance: 95,
      address: "123 Main St, City",
      emergencyContact: "+1 (555) 987-6543",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@armaflex.com",
      phone: "+1 (555) 234-5678",
      role: "receptionist",
      department: "Front Desk",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "2023-03-20",
      lastLogin: "2024-01-15 08:45",
      schedule: "Full-time",
      performance: 92,
      address: "456 Oak Ave, City",
      emergencyContact: "+1 (555) 876-5432",
    },
    {
      id: 3,
      name: "Maria Garcia",
      email: "maria.g@armaflex.com",
      phone: "+1 (555) 345-6789",
      role: "housekeeping",
      department: "Housekeeping",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "2023-05-10",
      lastLogin: "2024-01-15 07:00",
      schedule: "Part-time",
      performance: 88,
      address: "789 Pine Rd, City",
      emergencyContact: "+1 (555) 765-4321",
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "robert.w@armaflex.com",
      phone: "+1 (555) 456-7890",
      role: "maintenance",
      department: "Maintenance",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "2023-02-14",
      lastLogin: "2024-01-15 06:30",
      schedule: "Full-time",
      performance: 91,
      address: "321 Elm St, City",
      emergencyContact: "+1 (555) 654-3210",
    },
    {
      id: 5,
      name: "Emily Davis",
      email: "emily.d@armaflex.com",
      phone: "+1 (555) 567-8901",
      role: "accountant",
      department: "Finance",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "2023-04-01",
      lastLogin: "2024-01-15 09:00",
      schedule: "Full-time",
      performance: 96,
      address: "654 Maple Dr, City",
      emergencyContact: "+1 (555) 543-2109",
    },
    {
      id: 6,
      name: "Michael Chen",
      email: "michael.c@armaflex.com",
      phone: "+1 (555) 678-9012",
      role: "restaurant",
      department: "Restaurant",
      status: "active",
      avatar: "/placeholder.svg",
      joinDate: "2023-06-15",
      lastLogin: "2024-01-14 22:30",
      schedule: "Part-time",
      performance: 89,
      address: "987 Cedar Ln, City",
      emergencyContact: "+1 (555) 432-1098",
    },
    {
      id: 7,
      name: "Lisa Brown",
      email: "lisa.b@armaflex.com",
      phone: "+1 (555) 789-0123",
      role: "support",
      department: "IT Support",
      status: "inactive",
      avatar: "/placeholder.svg",
      joinDate: "2023-07-20",
      lastLogin: "2024-01-10 16:45",
      schedule: "Full-time",
      performance: 85,
      address: "147 Birch Ave, City",
      emergencyContact: "+1 (555) 321-0987",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      userRoles[member.role as keyof typeof userRoles].name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || member.department.toLowerCase() === departmentFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const staffStats = {
    total: staff.length,
    active: staff.filter(s => s.status === "active").length,
    inactive: staff.filter(s => s.status === "inactive").length,
    onLeave: staff.filter(s => s.status === "on-leave").length,
    departments: new Set(staff.map(s => s.department)).size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage employees, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
            <DialogTrigger asChild>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>Create a new employee profile with role and permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(userRoles).map(([key, role]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center space-x-2">
                              <role.icon className="h-4 w-4" />
                              <span>{role.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="it-support">IT Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="schedule">Schedule</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter address" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Active Status</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddStaffDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-hotel-500 hover:bg-hotel-600">
                    Add Staff Member
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold">{staffStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{staffStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{staffStats.inactive}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">{staffStats.onLeave}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{staffStats.departments}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff-list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="staff-list">Staff Directory</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="staff-list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="front desk">Front Desk</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="it support">IT Support</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Staff Table */}
          <Card>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => {
                      const role = userRoles[member.role as keyof typeof userRoles];
                      const RoleIcon = role.icon;
                      
                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {member.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{member.email}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={role.color} variant="outline">
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {role.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span>{member.department}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(member.status)} variant="outline">
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                                {member.performance}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{member.lastLogin}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(userRoles).map(([key, role]) => {
              const RoleIcon = role.icon;
              const roleStaffCount = staff.filter(s => s.role === key).length;
              
              return (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg bg-hotel-100 flex items-center justify-center">
                          <RoleIcon className="h-6 w-6 text-hotel-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <CardDescription>{roleStaffCount} members</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Key Permissions:</h4>
                      <ul className="space-y-1">
                        {role.permissions.map((permission, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-hotel-500" />
                            <span>{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Configure Role
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Staff members with highest performance scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staff
                    .filter(s => s.status === "active")
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 5)
                    .map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-hotel-100 text-hotel-700 text-sm font-medium">
                            {index + 1}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.department}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Average performance by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(staff.map(s => s.department))).map(department => {
                    const deptStaff = staff.filter(s => s.department === department && s.status === "active");
                    const avgPerformance = Math.round(
                      deptStaff.reduce((sum, s) => sum + s.performance, 0) / deptStaff.length
                    );
                    
                    return (
                      <div key={department} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{department}</p>
                          <p className="text-xs text-muted-foreground">{deptStaff.length} members</p>
                        </div>
                        <span className={`text-sm font-medium ${getPerformanceColor(avgPerformance)}`}>
                          {avgPerformance}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
