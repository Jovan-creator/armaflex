import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, UserRole } from "@/contexts/UserContext";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Shield,
  UserCheck,
  Coffee,
  Wrench,
  Calculator,
  ChefHat,
  HeadphonesIcon,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building,
  Calendar
} from "lucide-react";

interface StaffMember {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export default function StaffAdmin() {
  const { user } = useUser();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dialog states
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showEditStaff, setShowEditStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [staffForm, setStaffForm] = useState({
    email: '',
    name: '',
    role: '' as UserRole | '',
    department: '',
    password: ''
  });

  const roleOptions: { value: UserRole; label: string; icon: any; description: string }[] = [
    { value: 'admin', label: 'Administrator', icon: Shield, description: 'Full system access and management' },
    { value: 'receptionist', label: 'Receptionist', icon: UserCheck, description: 'Front desk operations and guest services' },
    { value: 'housekeeping', label: 'Housekeeping', icon: Coffee, description: 'Room cleaning and maintenance status' },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench, description: 'Facility repairs and maintenance' },
    { value: 'accountant', label: 'Accountant', icon: Calculator, description: 'Financial management and reporting' },
    { value: 'restaurant', label: 'Restaurant', icon: ChefHat, description: 'Food service and dining management' },
    { value: 'support', label: 'Support', icon: HeadphonesIcon, description: 'IT support and customer assistance' }
  ];

  const departmentOptions = [
    'Management', 'Front Desk', 'Housekeeping', 'Maintenance', 
    'Finance', 'Restaurant', 'IT Support', 'Marketing', 'Security'
  ];

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || '';
  };

  // Fetch staff from API
  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/hotel/users', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      setStaff(data);
    } catch (err) {
      setError('Failed to load staff members');
      console.error('Fetch staff error:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStaff();
      setLoading(false);
    };

    loadData();
  }, []);

  // Create new staff member
  const createStaff = async () => {
    try {
      const response = await fetch('/api/hotel/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(staffForm)
      });

      if (!response.ok) {
        throw new Error('Failed to create staff member');
      }

      setSuccess('Staff member created successfully');
      setShowAddStaff(false);
      setStaffForm({ email: '', name: '', role: '', department: '', password: '' });
      fetchStaff();
    } catch (err) {
      setError('Failed to create staff member');
      console.error('Create staff error:', err);
    }
  };

  // Update staff member
  const updateStaff = async () => {
    if (!selectedStaff) return;

    try {
      const updateData = {
        name: staffForm.name,
        role: staffForm.role,
        department: staffForm.department,
        ...(staffForm.password && { password: staffForm.password })
      };

      const response = await fetch(`/api/hotel/users/${selectedStaff.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update staff member');
      }

      setSuccess('Staff member updated successfully');
      setShowEditStaff(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (err) {
      setError('Failed to update staff member');
      console.error('Update staff error:', err);
    }
  };

  // Toggle staff active status
  const toggleStaffStatus = async (staffId: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/hotel/users/${staffId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ is_active: !isActive })
      });

      if (!response.ok) {
        throw new Error('Failed to update staff status');
      }

      setSuccess(`Staff member ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchStaff();
    } catch (err) {
      setError('Failed to update staff status');
      console.error('Toggle status error:', err);
    }
  };

  // Delete staff member
  const deleteStaff = async (staffId: number) => {
    try {
      const response = await fetch(`/api/hotel/users/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }

      setSuccess('Staff member deleted successfully');
      fetchStaff();
    } catch (err) {
      setError('Failed to delete staff member');
      console.error('Delete staff error:', err);
    }
  };

  // Filter staff
  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && member.is_active) ||
                         (filterStatus === 'inactive' && !member.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get role color
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'receptionist': return 'bg-blue-100 text-blue-800';
      case 'housekeeping': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'accountant': return 'bg-purple-100 text-purple-800';
      case 'restaurant': return 'bg-orange-100 text-orange-800';
      case 'support': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role icon
  const getRoleIcon = (role: UserRole) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.icon : Users;
  };

  // Open edit dialog
  const openEditDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setStaffForm({
      email: member.email,
      name: member.name,
      role: member.role,
      department: member.department,
      password: ''
    });
    setShowEditStaff(true);
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
        <div className="text-lg">Loading staff...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage hotel staff accounts and permissions</p>
        </div>
        <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
        </Dialog>
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

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff ({staff.length})</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <CardDescription>{member.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={member.is_active}
                          onCheckedChange={() => toggleStaffStatus(member.id, member.is_active)}
                          disabled={member.id === user?.id}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getRoleColor(member.role)}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleOptions.find(r => r.value === member.role)?.label}
                        </Badge>
                        <Badge variant={member.is_active ? "default" : "secondary"}>
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="w-4 h-4 mr-1" />
                        {member.department}
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {new Date(member.created_at).toLocaleDateString()}
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={member.id === user?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {member.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteStaff(member.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredStaff.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No staff members found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          {/* Role Permissions Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleOptions.map((role) => {
              const RoleIcon = role.icon;
              return (
                <Card key={role.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <RoleIcon className="w-5 h-5" />
                      <span>{role.label}</span>
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Staff with this role: {staff.filter(s => s.role === role.value && s.is_active).length}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Create a new staff account with role-based permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                  placeholder="john@armaflex.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={staffForm.role} onValueChange={(value: UserRole) => setStaffForm({...staffForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(role => {
                      const RoleIcon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center space-x-2">
                            <RoleIcon className="w-4 h-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={staffForm.department} onValueChange={(value) => setStaffForm({...staffForm, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
                  placeholder="Create a secure password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddStaff(false)}>Cancel</Button>
            <Button onClick={createStaff}>Create Staff Member</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={showEditStaff} onOpenChange={setShowEditStaff}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff member information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={staffForm.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select value={staffForm.role} onValueChange={(value: UserRole) => setStaffForm({...staffForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(role => {
                      const RoleIcon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center space-x-2">
                            <RoleIcon className="w-4 h-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <Select value={staffForm.department} onValueChange={(value) => setStaffForm({...staffForm, department: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editPassword">New Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="editPassword"
                  type={showPassword ? "text" : "password"}
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
                  placeholder="Leave empty to keep current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditStaff(false)}>Cancel</Button>
            <Button onClick={updateStaff}>Update Staff Member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
