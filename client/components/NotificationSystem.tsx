import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import {
  Bell,
  Check,
  X,
  Clock,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MessageSquare,
  Settings,
  BedDouble,
  Utensils,
  Wrench,
  Star,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking' | 'payment' | 'maintenance' | 'review';
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  relatedUser?: string;
  relatedRoom?: string;
}

// Mock notifications data based on user role
const generateNotifications = (userRole: string): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: "1",
      title: "New Booking Confirmed",
      message: "Sarah Johnson has booked Deluxe Suite 201 for 5 nights",
      type: "booking",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionRequired: true,
      priority: "high",
      category: "Reservations",
      relatedUser: "Sarah Johnson",
      relatedRoom: "201",
    },
    {
      id: "2",
      title: "Payment Received",
      message: "$1,375 payment processed for Invoice INV-2024-001",
      type: "payment",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionRequired: false,
      priority: "medium",
      category: "Billing",
    },
    {
      id: "3",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight from 2:00 AM - 4:00 AM",
      type: "info",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      actionRequired: false,
      priority: "low",
      category: "System",
    },
  ];

  // Role-specific notifications
  const roleNotifications: Record<string, Notification[]> = {
    admin: [
      {
        id: "admin-1",
        title: "Weekly Revenue Report",
        message: "Revenue increased by 12.5% this week - $127,450 total",
        type: "success",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        actionRequired: false,
        priority: "medium",
        category: "Reports",
      },
      {
        id: "admin-2",
        title: "Staff Performance Alert",
        message: "3 staff members need performance review this month",
        type: "warning",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "high",
        category: "Staff",
      },
    ],
    receptionist: [
      {
        id: "recep-1",
        title: "Guest Check-in Reminder",
        message: "Michael Chen arriving in 30 minutes - Room 105",
        type: "info",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "high",
        category: "Front Desk",
        relatedUser: "Michael Chen",
        relatedRoom: "105",
      },
      {
        id: "recep-2",
        title: "Late Check-out Request",
        message: "Emily Davis requests late checkout until 2 PM",
        type: "info",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "medium",
        category: "Front Desk",
        relatedUser: "Emily Davis",
      },
    ],
    housekeeping: [
      {
        id: "house-1",
        title: "Room Cleaning Required",
        message: "Room 208 needs immediate deep cleaning",
        type: "warning",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "high",
        category: "Housekeeping",
        relatedRoom: "208",
      },
      {
        id: "house-2",
        title: "Supply Inventory Low",
        message: "Cleaning supplies running low - reorder needed",
        type: "warning",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "medium",
        category: "Inventory",
      },
    ],
    maintenance: [
      {
        id: "maint-1",
        title: "AC Repair Completed",
        message: "Air conditioning in Room 208 has been fixed",
        type: "success",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        actionRequired: false,
        priority: "low",
        category: "Maintenance",
        relatedRoom: "208",
      },
      {
        id: "maint-2",
        title: "Urgent Repair Request",
        message: "Plumbing issue reported in Suite 401",
        type: "error",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "high",
        category: "Maintenance",
        relatedRoom: "401",
      },
    ],
    restaurant: [
      {
        id: "rest-1",
        title: "Large Group Reservation",
        message: "12-person dinner reservation tonight at 7 PM",
        type: "info",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "high",
        category: "Restaurant",
      },
    ],
    accountant: [
      {
        id: "acc-1",
        title: "Invoice Overdue",
        message: "Invoice INV-2024-003 is 5 days overdue - $4,400",
        type: "error",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        actionRequired: true,
        priority: "high",
        category: "Billing",
      },
    ],
  };

  return [...baseNotifications, ...(roleNotifications[userRole] || [])];
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'booking':
      return <Calendar className="h-4 w-4" />;
    case 'payment':
      return <CreditCard className="h-4 w-4" />;
    case 'maintenance':
      return <Wrench className="h-4 w-4" />;
    case 'review':
      return <Star className="h-4 w-4" />;
    case 'success':
      return <CheckCircle className="h-4 w-4" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4" />;
    case 'error':
      return <X className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    case 'booking':
      return 'text-blue-600';
    case 'payment':
      return 'text-green-600';
    case 'maintenance':
      return 'text-orange-600';
    case 'review':
      return 'text-purple-600';
    default:
      return 'text-blue-600';
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
    case 'low':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
    default:
      return null;
  }
};

export function NotificationSystem() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setNotifications(generateNotifications(user.role));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const category = notification.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-hotel-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
          
          {actionRequiredCount > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    {actionRequiredCount} notification{actionRequiredCount !== 1 ? 's' : ''} require{actionRequiredCount === 1 ? 's' : ''} your attention
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([category, categoryNotifications]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {category}
                </h3>
                <div className="space-y-3">
                  {categoryNotifications
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .map((notification) => (
                      <Card
                        key={notification.id}
                        className={`transition-all hover:shadow-md cursor-pointer ${
                          !notification.read ? 'border-hotel-200 bg-hotel-50' : ''
                        } ${notification.actionRequired ? 'border-l-4 border-l-orange-500' : ''}`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-medium">{notification.title}</p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-hotel-500" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                  {getPriorityBadge(notification.priority)}
                                  {notification.actionRequired && (
                                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                      Action Required
                                    </Badge>
                                  )}
                                </div>
                                {(notification.relatedUser || notification.relatedRoom) && (
                                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                    {notification.relatedUser && (
                                      <div className="flex items-center space-x-1">
                                        <Users className="h-3 w-3" />
                                        <span>{notification.relatedUser}</span>
                                      </div>
                                    )}
                                    {notification.relatedRoom && (
                                      <div className="flex items-center space-x-1">
                                        <BedDouble className="h-3 w-3" />
                                        <span>Room {notification.relatedRoom}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
                {category !== Object.keys(groupedNotifications)[Object.keys(groupedNotifications).length - 1] && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// Notification toast component for real-time alerts
export function NotificationToast({ notification }: { notification: Notification }) {
  return (
    <Card className="w-80 shadow-lg border-l-4 border-l-hotel-500">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center ${getNotificationColor(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
