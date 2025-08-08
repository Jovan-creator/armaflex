import { useUser } from "@/contexts/UserContext";
import {
  AdminDashboard,
  ReceptionistDashboard,
  HousekeepingDashboard,
  MaintenanceDashboard,
  AccountantDashboard,
  RestaurantDashboard,
  SupportDashboard,
} from "@/components/RoleDashboards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BedDouble,
  Users,
  CreditCard,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserPlus,
  CalendarPlus,
  ArrowRight,
  MapPin,
  Star,
} from "lucide-react";

// Default dashboard for guest users or fallback
function DefaultDashboard() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$47,289",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month",
    },
    {
      title: "Occupancy Rate",
      value: "78%",
      change: "+3.2%",
      trend: "up",
      icon: BedDouble,
      description: "Current month",
    },
    {
      title: "Total Guests",
      value: "1,247",
      change: "+8.1%",
      trend: "up",
      icon: Users,
      description: "This month",
    },
    {
      title: "Avg. Daily Rate",
      value: "$189",
      change: "-2.4%",
      trend: "down",
      icon: CreditCard,
      description: "Per room",
    },
  ];

  const roomStatus = [
    { status: "Occupied", count: 34, color: "bg-green-500", percentage: 68 },
    { status: "Available", count: 12, color: "bg-blue-500", percentage: 24 },
    { status: "Maintenance", count: 3, color: "bg-yellow-500", percentage: 6 },
    { status: "Out of Order", count: 1, color: "bg-red-500", percentage: 2 },
  ];

  const recentReservations = [
    {
      id: "RES-001",
      guest: "Sarah Johnson",
      room: "Deluxe Suite 201",
      checkIn: "Today",
      checkOut: "Dec 28",
      status: "confirmed",
      avatar: "/placeholder.svg",
    },
    {
      id: "RES-002",
      guest: "Michael Chen",
      room: "Standard Room 105",
      checkIn: "Tomorrow",
      checkOut: "Dec 30",
      status: "pending",
      avatar: "/placeholder.svg",
    },
    {
      id: "RES-003",
      guest: "Emily Davis",
      room: "Presidential Suite",
      checkIn: "Dec 27",
      checkOut: "Jan 2",
      status: "confirmed",
      avatar: "/placeholder.svg",
    },
  ];

  const housekeepingTasks = [
    { room: "Room 101", task: "Deep Cleaning", priority: "high", eta: "2 hours" },
    { room: "Room 205", task: "Standard Cleaning", priority: "medium", eta: "1 hour" },
    { room: "Room 314", task: "Maintenance Check", priority: "low", eta: "3 hours" },
    { room: "Suite 401", task: "VIP Preparation", priority: "high", eta: "1.5 hours" },
  ];

  const recentActivity = [
    {
      action: "New reservation created",
      details: "Sarah Johnson - Deluxe Suite 201",
      time: "5 min ago",
      icon: CalendarPlus,
    },
    {
      action: "Guest checked in",
      details: "Robert Wilson - Room 305",
      time: "23 min ago",
      icon: UserPlus,
    },
    {
      action: "Payment received",
      details: "$450 from Maria Garcia",
      time: "1 hour ago",
      icon: CreditCard,
    },
    {
      action: "Room maintenance completed",
      details: "Room 208 - Air conditioning fixed",
      time: "2 hours ago",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your hotel today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={stat.trend === "up" ? "text-green-600" : "text-red-600"}
                >
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Room Status */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BedDouble className="h-5 w-5" />
              <span>Room Status</span>
            </CardTitle>
            <CardDescription>Current room availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomStatus.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${status.color}`} />
                  <span className="text-sm font-medium">{status.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{status.count}</span>
                  <div className="w-16">
                    <Progress value={status.percentage} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reservations */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Reservations</span>
              </CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={reservation.avatar} alt={reservation.guest} />
                      <AvatarFallback>
                        {reservation.guest.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{reservation.guest}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{reservation.room}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={reservation.status === "confirmed" ? "default" : "secondary"}
                      className="mb-1"
                    >
                      {reservation.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {reservation.checkIn} - {reservation.checkOut}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Housekeeping Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Housekeeping</span>
            </CardTitle>
            <CardDescription>Pending tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {housekeepingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.room}</p>
                    <p className="text-xs text-muted-foreground">{task.task}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{task.eta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hotel-100 text-hotel-700">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <CalendarPlus className="h-6 w-6" />
              <span>New Reservation</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <UserPlus className="h-6 w-6" />
              <span>Check In Guest</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BedDouble className="h-6 w-6" />
              <span>Room Status</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <CreditCard className="h-6 w-6" />
              <span>Process Payment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();

  if (!user) {
    return <DefaultDashboard />;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'housekeeping':
      return <HousekeepingDashboard />;
    case 'maintenance':
      return <MaintenanceDashboard />;
    case 'accountant':
      return <AccountantDashboard />;
    case 'restaurant':
      return <RestaurantDashboard />;
    case 'support':
      return <SupportDashboard />;
    case 'guest':
    default:
      return <DefaultDashboard />;
  }
}
