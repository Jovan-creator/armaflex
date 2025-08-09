import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  UserCheck,
  Coffee,
  Wrench,
  Calculator,
  ChefHat,
  HeadphonesIcon,
  User,
  BedDouble,
  Calendar,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Settings,
  Bell,
  FileText,
  Package,
  ClipboardList,
  Utensils,
  MessageSquare,
  Activity,
  BarChart3,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

export function AdminDashboard() {
  const navigate = useNavigate();

  const systemStats = [
    { title: "Total Revenue", value: "$47,289", change: "+12.5%", icon: DollarSign },
    { title: "Active Staff", value: "24", change: "+2", icon: Users },
    { title: "System Health", value: "98.5%", change: "+0.2%", icon: Activity },
    { title: "Occupancy Rate", value: "78%", change: "+3.2%", icon: BedDouble },
  ];

  const recentActivity = [
    { action: "New user added", details: "Sarah Johnson - Receptionist", time: "5 min ago" },
    { action: "System backup completed", details: "Database backup successful", time: "30 min ago" },
    { action: "Payment processed", details: "$450 from Maria Garcia", time: "1 hour ago" },
    { action: "Room maintenance completed", details: "Room 208 - Air conditioning fixed", time: "2 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management controls</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800 border-purple-200" variant="outline">
          <Shield className="h-3 w-3 mr-1" />
          Administrator
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Management</CardTitle>
            <CardDescription>Quick access to admin functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/staff')}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users & Roles
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => navigate('/reports')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View All Reports
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => alert('System logs feature coming soon!')}
            >
              <Activity className="h-4 w-4 mr-2" />
              System Logs
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest system events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hotel-100 text-hotel-700">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ReceptionistDashboard() {
  const frontDeskStats = [
    { title: "Check-ins Today", value: "12", icon: UserCheck, color: "text-blue-600" },
    { title: "Check-outs Today", value: "8", icon: Users, color: "text-green-600" },
    { title: "Pending Payments", value: "3", icon: CreditCard, color: "text-yellow-600" },
    { title: "Available Rooms", value: "15", icon: BedDouble, color: "text-blue-600" },
  ];

  const upcomingArrivals = [
    { guest: "John Smith", room: "201", time: "2:00 PM", status: "confirmed" },
    { guest: "Emily Davis", room: "305", time: "3:30 PM", status: "pending" },
    { guest: "Robert Wilson", room: "102", time: "4:15 PM", status: "confirmed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Front Desk Dashboard</h1>
          <p className="text-muted-foreground">Guest services and booking management</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
          <UserCheck className="h-3 w-3 mr-1" />
          Receptionist
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {frontDeskStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common front desk tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-hotel-500 hover:bg-hotel-600">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Booking
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <UserCheck className="h-4 w-4 mr-2" />
              Check-in Guest
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Check-out Guest
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Arrivals</CardTitle>
            <CardDescription>Guests checking in today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingArrivals.map((arrival, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{arrival.guest}</p>
                    <p className="text-sm text-muted-foreground">Room {arrival.room} • {arrival.time}</p>
                  </div>
                  <Badge variant={arrival.status === "confirmed" ? "default" : "secondary"}>
                    {arrival.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function HousekeepingDashboard() {
  const housekeepingStats = [
    { title: "Rooms to Clean", value: "8", icon: Coffee, color: "text-yellow-600" },
    { title: "Completed Today", value: "12", icon: CheckCircle, color: "text-green-600" },
    { title: "Maintenance Issues", value: "2", icon: AlertTriangle, color: "text-red-600" },
    { title: "Supplies Low", value: "3", icon: Package, color: "text-orange-600" },
  ];

  const todaysTasks = [
    { room: "101", task: "Deep Cleaning", priority: "high", eta: "2 hours" },
    { room: "205", task: "Standard Cleaning", priority: "medium", eta: "1 hour" },
    { room: "314", task: "Maintenance Check", priority: "low", eta: "30 min" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Housekeeping Dashboard</h1>
          <p className="text-muted-foreground">Room cleaning and maintenance tasks</p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
          <Coffee className="h-3 w-3 mr-1" />
          Housekeeping
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {housekeepingStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Your assigned cleaning schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">Room {task.room}</p>
                    <p className="text-sm text-muted-foreground">{task.task}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                      className="mb-1"
                    >
                      {task.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{task.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common housekeeping tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-hotel-500 hover:bg-hotel-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Room Complete
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Request Supplies
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ClipboardList className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function MaintenanceDashboard() {
  const maintenanceStats = [
    { title: "Open Tickets", value: "5", icon: Wrench, color: "text-orange-600" },
    { title: "Completed Today", value: "3", icon: CheckCircle, color: "text-green-600" },
    { title: "High Priority", value: "2", icon: AlertTriangle, color: "text-red-600" },
    { title: "Avg. Resolution", value: "2.5h", icon: Clock, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Dashboard</h1>
          <p className="text-muted-foreground">Repair requests and technical issues</p>
        </div>
        <Badge className="bg-orange-100 text-orange-800 border-orange-200" variant="outline">
          <Wrench className="h-3 w-3 mr-1" />
          Maintenance
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {maintenanceStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AccountantDashboard() {
  const financialStats = [
    { title: "Today's Revenue", value: "$2,450", icon: DollarSign, color: "text-green-600" },
    { title: "Pending Payments", value: "$890", icon: Clock, color: "text-yellow-600" },
    { title: "Monthly Revenue", value: "$47,289", icon: TrendingUp, color: "text-blue-600" },
    { title: "Outstanding Invoices", value: "12", icon: FileText, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">Financial operations and reporting</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200" variant="outline">
          <Calculator className="h-3 w-3 mr-1" />
          Accountant
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function RestaurantDashboard() {
  const restaurantStats = [
    { title: "Orders Today", value: "24", icon: Utensils, color: "text-yellow-600" },
    { title: "Table Reservations", value: "8", icon: Calendar, color: "text-blue-600" },
    { title: "Revenue Today", value: "$1,240", icon: DollarSign, color: "text-green-600" },
    { title: "Menu Items", value: "45", icon: ChefHat, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurant Dashboard</h1>
          <p className="text-muted-foreground">Food & beverage operations</p>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200" variant="outline">
          <ChefHat className="h-3 w-3 mr-1" />
          Restaurant Staff
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {restaurantStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SupportDashboard() {
  const supportStats = [
    { title: "Open Tickets", value: "7", icon: MessageSquare, color: "text-blue-600" },
    { title: "Resolved Today", value: "12", icon: CheckCircle, color: "text-green-600" },
    { title: "Avg Response Time", value: "15m", icon: Clock, color: "text-yellow-600" },
    { title: "User Reports", value: "3", icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
          <p className="text-muted-foreground">User assistance and system support</p>
        </div>
        <Badge className="bg-pink-100 text-pink-800 border-pink-200" variant="outline">
          <HeadphonesIcon className="h-3 w-3 mr-1" />
          Support
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {supportStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
