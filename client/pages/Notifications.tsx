import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/UserContext";
import {
  Bell,
  BellRing,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Settings,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Filter,
  Search,
  Archive,
  Trash2,
  Star,
  StarOff,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Download,
  Upload,
  BarChart3,
  Target,
  Zap,
  Webhook,
  Database,
  Shield,
  Globe,
  Wifi,
  WifiOff,
  Pause,
  Play,
  RotateCcw,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  BookmarkPlus,
  MessageCircle,
  Video,
  Image,
  FileText,
  Paperclip,
  Hash,
  AtSign,
  MapPin,
  Activity,
  Layers,
  GitBranch,
  Workflow,
  Timer,
  Calendar as CalendarIcon,
  Clock3,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  LineChart,
  Rss,
  Radio,
  Broadcast,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success" | "urgent";
  priority: "low" | "medium" | "high" | "urgent";
  status: "unread" | "read" | "archived";
  timestamp: string;
  sender: string;
  department: string;
  category: string;
  tags: string[];
  actionRequired: boolean;
  dueDate?: string;
  recipients: string[];
  attachments?: { name: string; url: string; type: string }[];
  relatedModule: string;
  escalationLevel: number;
  readBy: string[];
  acknowledgedBy: string[];
}

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  content: string;
  type: string;
  triggers: string[];
  channels: string[];
  recipients: string[];
  active: boolean;
}

interface NotificationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: string;
  channels: string[];
  active: boolean;
  schedule?: string;
}

export default function Notifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showCompose, setShowCompose] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "medium",
    recipients: [] as string[],
    category: "",
    tags: "",
    dueDate: "",
    actionRequired: false,
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Room 205 - Maintenance Required",
        message: "Air conditioning unit in Room 205 is not functioning. Guest has reported issue. Priority repair needed.",
        type: "urgent",
        priority: "urgent",
        status: "unread",
        timestamp: "2024-12-27 10:30 AM",
        sender: "Sarah Johnson",
        department: "Housekeeping",
        category: "Maintenance",
        tags: ["urgent", "guest-complaint", "hvac"],
        actionRequired: true,
        dueDate: "2024-12-27 2:00 PM",
        recipients: ["maintenance", "management"],
        relatedModule: "rooms",
        escalationLevel: 1,
        readBy: [],
        acknowledgedBy: [],
      },
      {
        id: "2",
        title: "New VIP Guest Arrival",
        message: "Mr. Alexander Thompson (VIP Guest) will be arriving today at 3:00 PM. Presidential Suite prepared with welcome amenities.",
        type: "info",
        priority: "high",
        status: "unread",
        timestamp: "2024-12-27 9:15 AM",
        sender: "Front Desk",
        department: "Reception",
        category: "Guest Services",
        tags: ["vip", "arrival", "presidential-suite"],
        actionRequired: true,
        recipients: ["reception", "housekeeping", "concierge"],
        relatedModule: "guests",
        escalationLevel: 0,
        readBy: [],
        acknowledgedBy: [],
      },
      {
        id: "3",
        title: "Daily Revenue Report",
        message: "Today's revenue: $23,450 (15% above yesterday). Occupancy rate: 89%. Total check-ins: 34, Check-outs: 28.",
        type: "success",
        priority: "low",
        status: "read",
        timestamp: "2024-12-27 8:00 AM",
        sender: "System",
        department: "Finance",
        category: "Reports",
        tags: ["revenue", "daily-report", "analytics"],
        actionRequired: false,
        recipients: ["management", "finance"],
        relatedModule: "billing",
        escalationLevel: 0,
        readBy: ["admin", "accountant"],
        acknowledgedBy: [],
      },
      {
        id: "4",
        title: "Staff Schedule Update",
        message: "Emergency schedule change: Maria Garcia (Housekeeping) called in sick. Coverage needed for afternoon shift (2 PM - 10 PM).",
        type: "warning",
        priority: "high",
        status: "unread",
        timestamp: "2024-12-27 7:45 AM",
        sender: "HR Department",
        department: "Human Resources",
        category: "Staffing",
        tags: ["schedule", "emergency", "housekeeping"],
        actionRequired: true,
        dueDate: "2024-12-27 1:00 PM",
        recipients: ["management", "housekeeping"],
        relatedModule: "staff",
        escalationLevel: 0,
        readBy: [],
        acknowledgedBy: [],
      },
    ];

    setNotifications(mockNotifications);

    const mockTemplates: NotificationTemplate[] = [
      {
        id: "1",
        name: "Guest Complaint Alert",
        title: "Guest Complaint - Room {room_number}",
        content: "Guest complaint received for Room {room_number}. Issue: {complaint_type}. Priority: {priority_level}.",
        type: "warning",
        triggers: ["guest_complaint"],
        channels: ["email", "sms", "push"],
        recipients: ["management", "guest_services"],
        active: true,
      },
      {
        id: "2",
        name: "VIP Arrival Notification",
        title: "VIP Guest Arrival - {guest_name}",
        content: "VIP Guest {guest_name} arriving at {arrival_time}. Special requests: {special_requests}.",
        type: "info",
        triggers: ["vip_arrival"],
        channels: ["email", "push"],
        recipients: ["management", "reception", "concierge"],
        active: true,
      },
    ];

    setTemplates(mockTemplates);

    const mockRules: NotificationRule[] = [
      {
        id: "1",
        name: "High Priority Maintenance",
        condition: "maintenance_priority = 'urgent' AND guest_occupied = true",
        action: "send_immediate_notification",
        priority: "urgent",
        channels: ["email", "sms", "push"],
        active: true,
        schedule: "immediate",
      },
      {
        id: "2",
        name: "Daily Revenue Threshold",
        condition: "daily_revenue < target_revenue * 0.8",
        action: "send_revenue_alert",
        priority: "high",
        channels: ["email"],
        active: true,
        schedule: "daily_9am",
      },
    ];

    setRules(mockRules);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === "unread").length,
    urgent: notifications.filter(n => n.priority === "urgent").length,
    actionRequired: notifications.filter(n => n.actionRequired).length,
    byType: {
      info: notifications.filter(n => n.type === "info").length,
      warning: notifications.filter(n => n.type === "warning").length,
      error: notifications.filter(n => n.type === "error").length,
      success: notifications.filter(n => n.type === "success").length,
      urgent: notifications.filter(n => n.type === "urgent").length,
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: "read" as const, readBy: [...n.readBy, user?.id || "current-user"] } : n
    ));
  };

  const markAsArchived = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: "archived" as const } : n
    ));
  };

  const acknowledgeNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, acknowledgedBy: [...n.acknowledgedBy, user?.id || "current-user"] } : n
    ));
  };

  const sendNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type as any,
      priority: newNotification.priority as any,
      status: "unread",
      timestamp: new Date().toLocaleString(),
      sender: user?.name || "System",
      department: user?.department || "System",
      category: newNotification.category,
      tags: newNotification.tags.split(",").map(t => t.trim()),
      actionRequired: newNotification.actionRequired,
      dueDate: newNotification.dueDate,
      recipients: newNotification.recipients,
      relatedModule: "notifications",
      escalationLevel: 0,
      readBy: [],
      acknowledgedBy: [],
    };

    setNotifications(prev => [notification, ...prev]);
    setShowCompose(false);
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      recipients: [],
      category: "",
      tags: "",
      dueDate: "",
      actionRequired: false,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "error": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">
            Manage notifications, alerts, and communication across all hotel operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCompose} onOpenChange={setShowCompose}>
            <DialogTrigger asChild>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>
                  Compose and send a notification to specific departments or staff members
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Notification message content"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newNotification.type} onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newNotification.priority} onValueChange={(value) => setNewNotification(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newNotification.category}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Maintenance, Guest Services, Operations"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newNotification.tags}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., urgent, maintenance, guest-complaint"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="actionRequired"
                    checked={newNotification.actionRequired}
                    onCheckedChange={(checked) => setNewNotification(prev => ({ ...prev, actionRequired: checked }))}
                  />
                  <Label htmlFor="actionRequired">Action Required</Label>
                </div>
                {newNotification.actionRequired && (
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={newNotification.dueDate}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCompose(false)}>
                  Cancel
                </Button>
                <Button onClick={sendNotification} className="bg-hotel-500 hover:bg-hotel-600">
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationStats.total}</div>
            <p className="text-xs text-muted-foreground">All time notifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{notificationStats.unread}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{notificationStats.urgent}</div>
            <p className="text-xs text-muted-foreground">High priority items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{notificationStats.actionRequired}</div>
            <p className="text-xs text-muted-foreground">Need response</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Notifications Feed */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications Feed</CardTitle>
                  <CardDescription>
                    Recent notifications and alerts ({filteredNotifications.length} found)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                            notification.status === "unread" ? "border-hotel-500 bg-hotel-50/50" : ""
                          }`}
                          onClick={() => setSelectedNotification(notification)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getTypeIcon(notification.type)}
                                <h4 className="font-medium">{notification.title}</h4>
                                <Badge className={getPriorityColor(notification.priority)} variant="outline">
                                  {notification.priority}
                                </Badge>
                                {notification.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message.substring(0, 120)}...
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{notification.timestamp}</span>
                                <span>From: {notification.sender}</span>
                                <span>{notification.department}</span>
                              </div>
                              {notification.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {notification.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {notification.status === "unread" && (
                                <div className="h-2 w-2 bg-hotel-500 rounded-full" />
                              )}
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsArchived(notification.id);
                                  }}
                                >
                                  <Archive className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Notification Details */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedNotification ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(selectedNotification.type)}
                        <h3 className="font-medium">{selectedNotification.title}</h3>
                      </div>
                      <Badge className={getPriorityColor(selectedNotification.priority)} variant="outline">
                        {selectedNotification.priority} Priority
                      </Badge>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium">Message</Label>
                        <p className="text-sm mt-1">{selectedNotification.message}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <Label className="text-sm font-medium">Sender</Label>
                          <p className="mt-1">{selectedNotification.sender}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Department</Label>
                          <p className="mt-1">{selectedNotification.department}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Category</Label>
                          <p className="mt-1">{selectedNotification.category}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Timestamp</Label>
                          <p className="mt-1">{selectedNotification.timestamp}</p>
                        </div>
                      </div>
                      {selectedNotification.dueDate && (
                        <div>
                          <Label className="text-sm font-medium">Due Date</Label>
                          <p className="text-sm mt-1 text-orange-600">{selectedNotification.dueDate}</p>
                        </div>
                      )}
                      {selectedNotification.tags.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Tags</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedNotification.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Separator />
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => acknowledgeNotification(selectedNotification.id)}
                          disabled={selectedNotification.acknowledgedBy.includes(user?.id || "current-user")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {selectedNotification.acknowledgedBy.includes(user?.id || "current-user") ? "Acknowledged" : "Acknowledge"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => markAsRead(selectedNotification.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a notification to view details
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Sent Today</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Read Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notification Templates</CardTitle>
                <CardDescription>Pre-configured message templates for common scenarios</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{template.title}</p>
                    <p className="text-sm">{template.content}</p>
                    <div className="flex gap-2 mt-2">
                      {template.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Automation Rules</CardTitle>
                <CardDescription>Automated notification triggers and conditions</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.active} />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Condition:</span> {rule.condition}</p>
                      <p><span className="font-medium">Action:</span> {rule.action}</p>
                      <p><span className="font-medium">Priority:</span> {rule.priority}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {rule.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label>SMTP Server</Label>
                  <Input defaultValue="smtp.hotel.com" />
                </div>
                <div>
                  <Label>From Address</Label>
                  <Input defaultValue="notifications@armaflex.com" />
                </div>
                <Button className="w-full">Test Email Connection</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label>SMS Provider</Label>
                  <Select defaultValue="twilio">
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
                  <Label>API Key</Label>
                  <Input type="password" placeholder="••••••••••••••••" />
                </div>
                <Button className="w-full">Test SMS Connection</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Browser Push</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile App Push</span>
                  <Switch defaultChecked />
                </div>
                <div>
                  <Label>Firebase Server Key</Label>
                  <Input type="password" placeholder="••••••••••••••••" />
                </div>
                <Button className="w-full">Test Push Notifications</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Webhook Integration</span>
                  <Switch />
                </div>
                <div>
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://api.external-service.com/webhook" />
                </div>
                <div>
                  <Label>Secret Key</Label>
                  <Input type="password" placeholder="••••••••••••••••" />
                </div>
                <Button className="w-full">Test Webhook</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Delivery Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Delivered</span>
                    <span className="font-medium text-green-600">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Failed</span>
                    <span className="font-medium text-red-600">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium text-orange-600">45</span>
                  </div>
                  <Progress value={95} className="h-2" />
                  <p className="text-xs text-muted-foreground">95% delivery rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Open Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Click Rate</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Response Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <p className="text-xs text-muted-foreground">Above average engagement</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Response</span>
                    <span className="font-medium">12 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fastest</span>
                    <span className="font-medium text-green-600">2 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Slowest</span>
                    <span className="font-medium text-red-600">45 min</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs text-muted-foreground">Response time trending down</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Notification Volume Over Time</CardTitle>
              <CardDescription>Daily notification sending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics chart would be displayed here</p>
                  <p className="text-sm">Integration with charting library required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
