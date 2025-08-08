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
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ClipboardList,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  Timer,
  BedDouble,
  Bath,
  Utensils,
  Wifi,
  Coffee,
  Car,
  Shield,
  Wrench,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Download,
  Upload,
  MessageSquare,
  Bell,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Square,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  Camera,
  FileText,
  Clipboard,
  CalendarDays,
  UserCheck,
  Zap,
  Target,
  Award,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  Home,
  Building,
  Layers,
  Grid,
  List,
  Archive,
  Database,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Mouse,
  Keyboard,
  Headphones,
  Speaker,
} from "lucide-react";

interface Task {
  id: string;
  roomNumber: string;
  taskType: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  assignedTo: string;
  estimatedTime: number; // in minutes
  actualTime?: number;
  startTime?: string;
  endTime?: string;
  notes: string;
  checklist: TaskChecklistItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  guestName?: string;
  checkoutTime?: string;
  checkinTime?: string;
  specialRequests?: string[];
  supplies: SupplyItem[];
  maintenanceIssues?: MaintenanceIssue[];
  qualityScore?: number;
  photos?: string[];
}

interface TaskChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  estimatedMinutes: number;
}

interface SupplyItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: "available" | "low-stock" | "out-of-stock";
  lastRestocked: string;
  minimumStock: number;
  currentStock: number;
  cost: number;
}

interface MaintenanceIssue {
  id: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "reported" | "scheduled" | "in-progress" | "completed";
  reportedBy: string;
  reportedAt: string;
  photos?: string[];
}

interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  shift: string;
  status: "available" | "busy" | "break" | "off-duty";
  currentTask?: string;
  performance: number;
  tasksCompleted: number;
  averageTime: number;
  location: string;
}

export default function Housekeeping() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [newTask, setNewTask] = useState({
    roomNumber: "",
    taskType: "",
    priority: "medium",
    assignedTo: "",
    estimatedTime: 60,
    notes: "",
    specialRequests: "",
  });

  // Standard room cleaning checklist
  const standardChecklist: TaskChecklistItem[] = [
    { id: "1", description: "Strip and make beds with fresh linens", completed: false, priority: "high", estimatedMinutes: 15 },
    { id: "2", description: "Clean and disinfect bathroom thoroughly", completed: false, priority: "high", estimatedMinutes: 20 },
    { id: "3", description: "Vacuum carpets and mop floors", completed: false, priority: "high", estimatedMinutes: 15 },
    { id: "4", description: "Dust all surfaces and furniture", completed: false, priority: "medium", estimatedMinutes: 10 },
    { id: "5", description: "Clean windows and mirrors", completed: false, priority: "medium", estimatedMinutes: 10 },
    { id: "6", description: "Restock toiletries and amenities", completed: false, priority: "high", estimatedMinutes: 5 },
    { id: "7", description: "Empty trash and replace liners", completed: false, priority: "high", estimatedMinutes: 5 },
    { id: "8", description: "Check and replace towels", completed: false, priority: "high", estimatedMinutes: 5 },
    { id: "9", description: "Organize closet and drawers", completed: false, priority: "low", estimatedMinutes: 10 },
    { id: "10", description: "Final inspection and room setup", completed: false, priority: "high", estimatedMinutes: 10 },
  ];

  // Mock data initialization
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: "1",
        roomNumber: "101",
        taskType: "Standard Cleaning",
        priority: "high",
        status: "in-progress",
        assignedTo: "Maria Garcia",
        estimatedTime: 90,
        actualTime: 45,
        startTime: "09:30",
        notes: "Guest checked out early. VIP arrival expected at 3 PM.",
        checklist: standardChecklist.map(item => ({ ...item, id: `1-${item.id}` })),
        createdBy: "Front Desk",
        createdAt: "2024-12-27 08:30",
        updatedAt: "2024-12-27 09:30",
        guestName: "John Smith",
        checkoutTime: "08:30",
        checkinTime: "15:00",
        specialRequests: ["Extra towels", "Late checkout"],
        supplies: [
          { id: "1", name: "Toilet Paper", quantity: 2, unit: "rolls", status: "available", lastRestocked: "2024-12-26", minimumStock: 10, currentStock: 25, cost: 2.50 },
          { id: "2", name: "Towels", quantity: 4, unit: "sets", status: "available", lastRestocked: "2024-12-26", minimumStock: 5, currentStock: 20, cost: 15.00 },
        ],
        qualityScore: 95,
      },
      {
        id: "2",
        roomNumber: "205",
        taskType: "Deep Cleaning",
        priority: "urgent",
        status: "pending",
        assignedTo: "Sarah Johnson",
        estimatedTime: 120,
        notes: "Guest complaint about bathroom cleanliness. Priority cleaning required.",
        checklist: [...standardChecklist, 
          { id: "11", description: "Deep clean carpet stains", completed: false, priority: "high", estimatedMinutes: 30 },
          { id: "12", description: "Sanitize all surfaces", completed: false, priority: "high", estimatedMinutes: 20 }
        ].map(item => ({ ...item, id: `2-${item.id}` })),
        createdBy: "Guest Services",
        createdAt: "2024-12-27 09:15",
        updatedAt: "2024-12-27 09:15",
        guestName: "Emily Davis",
        specialRequests: ["Extra cleaning attention", "Guest complaint resolution"],
        supplies: [
          { id: "3", name: "Disinfectant", quantity: 1, unit: "bottle", status: "available", lastRestocked: "2024-12-25", minimumStock: 3, currentStock: 8, cost: 8.00 },
          { id: "4", name: "Carpet Cleaner", quantity: 1, unit: "bottle", status: "low-stock", lastRestocked: "2024-12-20", minimumStock: 2, currentStock: 1, cost: 12.00 },
        ],
        maintenanceIssues: [
          { id: "1", description: "Bathroom faucet leaking", severity: "medium", status: "reported", reportedBy: "Maria Garcia", reportedAt: "2024-12-27 09:00" }
        ],
      },
      {
        id: "3",
        roomNumber: "314",
        taskType: "Maintenance Check",
        priority: "medium",
        status: "completed",
        assignedTo: "Robert Wilson",
        estimatedTime: 45,
        actualTime: 38,
        startTime: "07:00",
        endTime: "07:38",
        notes: "Routine maintenance check completed. All systems operational.",
        checklist: [
          { id: "3-1", description: "Check HVAC system", completed: true, priority: "high", estimatedMinutes: 15 },
          { id: "3-2", description: "Test all electrical outlets", completed: true, priority: "medium", estimatedMinutes: 10 },
          { id: "3-3", description: "Inspect plumbing fixtures", completed: true, priority: "high", estimatedMinutes: 15 },
          { id: "3-4", description: "Check safety equipment", completed: true, priority: "high", estimatedMinutes: 5 },
        ],
        createdBy: "Maintenance",
        createdAt: "2024-12-27 06:30",
        updatedAt: "2024-12-27 07:38",
        supplies: [],
        qualityScore: 98,
      },
      {
        id: "4",
        roomNumber: "401",
        taskType: "VIP Preparation",
        priority: "high",
        status: "pending",
        assignedTo: "Lisa Brown",
        estimatedTime: 150,
        notes: "Presidential suite preparation for VIP guest. Special amenities required.",
        checklist: [...standardChecklist,
          { id: "14", description: "Arrange welcome amenities", completed: false, priority: "high", estimatedMinutes: 20 },
          { id: "15", description: "Fresh flowers arrangement", completed: false, priority: "medium", estimatedMinutes: 15 },
          { id: "16", description: "Premium toiletries setup", completed: false, priority: "high", estimatedMinutes: 10 },
          { id: "17", description: "Champagne service preparation", completed: false, priority: "medium", estimatedMinutes: 10 }
        ].map(item => ({ ...item, id: `4-${item.id}` })),
        createdBy: "Guest Services",
        createdAt: "2024-12-27 08:00",
        updatedAt: "2024-12-27 08:00",
        guestName: "Alexander Thompson",
        checkinTime: "15:00",
        specialRequests: ["Fresh flowers", "Champagne service", "Extra pillows", "City view"],
        supplies: [
          { id: "5", name: "Premium Toiletries", quantity: 1, unit: "set", status: "available", lastRestocked: "2024-12-26", minimumStock: 2, currentStock: 5, cost: 45.00 },
          { id: "6", name: "Welcome Amenities", quantity: 1, unit: "basket", status: "available", lastRestocked: "2024-12-26", minimumStock: 1, currentStock: 3, cost: 75.00 },
        ],
      },
    ];

    const mockSupplies: SupplyItem[] = [
      { id: "1", name: "Toilet Paper", quantity: 100, unit: "rolls", status: "available", lastRestocked: "2024-12-26", minimumStock: 20, currentStock: 45, cost: 2.50 },
      { id: "2", name: "Towels", quantity: 50, unit: "sets", status: "available", lastRestocked: "2024-12-26", minimumStock: 10, currentStock: 32, cost: 15.00 },
      { id: "3", name: "Bed Sheets", quantity: 80, unit: "sets", status: "available", lastRestocked: "2024-12-25", minimumStock: 15, currentStock: 28, cost: 25.00 },
      { id: "4", name: "Disinfectant", quantity: 20, unit: "bottles", status: "available", lastRestocked: "2024-12-25", minimumStock: 5, currentStock: 12, cost: 8.00 },
      { id: "5", name: "Vacuum Bags", quantity: 25, unit: "pieces", status: "low-stock", lastRestocked: "2024-12-20", minimumStock: 10, currentStock: 8, cost: 3.00 },
      { id: "6", name: "Carpet Cleaner", quantity: 8, unit: "bottles", status: "low-stock", lastRestocked: "2024-12-20", minimumStock: 5, currentStock: 2, cost: 12.00 },
      { id: "7", name: "Glass Cleaner", quantity: 15, unit: "bottles", status: "available", lastRestocked: "2024-12-24", minimumStock: 8, currentStock: 18, cost: 6.50 },
      { id: "8", name: "Shampoo", quantity: 40, unit: "bottles", status: "available", lastRestocked: "2024-12-26", minimumStock: 15, currentStock: 22, cost: 4.00 },
      { id: "9", name: "Soap", quantity: 60, unit: "bars", status: "available", lastRestocked: "2024-12-26", minimumStock: 20, currentStock: 35, cost: 2.00 },
      { id: "10", name: "Air Freshener", quantity: 12, unit: "bottles", status: "out-of-stock", lastRestocked: "2024-12-18", minimumStock: 6, currentStock: 0, cost: 5.50 },
    ];

    const mockStaff: StaffMember[] = [
      {
        id: "1",
        name: "Maria Garcia",
        avatar: "/placeholder.svg",
        role: "Senior Housekeeper",
        shift: "Morning (6AM-2PM)",
        status: "busy",
        currentTask: "Room 101 - Standard Cleaning",
        performance: 92,
        tasksCompleted: 156,
        averageTime: 78,
        location: "Floor 1",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg", 
        role: "Housekeeper",
        shift: "Day (8AM-4PM)",
        status: "available",
        performance: 88,
        tasksCompleted: 134,
        averageTime: 85,
        location: "Floor 2",
      },
      {
        id: "3",
        name: "Lisa Brown",
        avatar: "/placeholder.svg",
        role: "VIP Services",
        shift: "Full Day (7AM-3PM)",
        status: "available",
        performance: 95,
        tasksCompleted: 89,
        averageTime: 95,
        location: "VIP Floor",
      },
      {
        id: "4",
        name: "Robert Wilson",
        avatar: "/placeholder.svg",
        role: "Maintenance",
        shift: "Morning (6AM-2PM)",
        status: "busy",
        currentTask: "Room 205 - Maintenance Check",
        performance: 91,
        tasksCompleted: 78,
        averageTime: 45,
        location: "Floor 2",
      },
      {
        id: "5",
        name: "Jennifer Lopez",
        avatar: "/placeholder.svg",
        role: "Supervisor",
        shift: "Full Day (7AM-5PM)",
        status: "available",
        performance: 96,
        tasksCompleted: 203,
        averageTime: 65,
        location: "Central",
      },
    ];

    setTasks(mockTasks);
    setSupplies(mockSupplies);
    setStaff(mockStaff);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.roomNumber.includes(searchTerm) ||
                         task.taskType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.guestName && task.guestName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === "all" || task.assignedTo === filterAssignee;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue: tasks.filter(t => t.status === "pending" && t.priority === "urgent").length,
  };

  const supplyStats = {
    total: supplies.length,
    available: supplies.filter(s => s.status === "available").length,
    lowStock: supplies.filter(s => s.status === "low-stock").length,
    outOfStock: supplies.filter(s => s.status === "out-of-stock").length,
    totalValue: supplies.reduce((sum, s) => sum + (s.currentStock * s.cost), 0),
  };

  const staffStats = {
    total: staff.length,
    available: staff.filter(s => s.status === "available").length,
    busy: staff.filter(s => s.status === "busy").length,
    onBreak: staff.filter(s => s.status === "break").length,
    avgPerformance: Math.round(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length),
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSupplyStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "low-stock": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out-of-stock": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const createTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      roomNumber: newTask.roomNumber,
      taskType: newTask.taskType,
      priority: newTask.priority as any,
      status: "pending",
      assignedTo: newTask.assignedTo,
      estimatedTime: newTask.estimatedTime,
      notes: newTask.notes,
      checklist: newTask.taskType === "Standard Cleaning" ? 
        standardChecklist.map(item => ({ ...item, id: `${Date.now()}-${item.id}` })) : 
        [],
      createdBy: "System",
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      specialRequests: newTask.specialRequests ? newTask.specialRequests.split(",").map(s => s.trim()) : [],
      supplies: [],
    };

    setTasks(prev => [task, ...prev]);
    setShowCreateTask(false);
    setNewTask({
      roomNumber: "",
      taskType: "",
      priority: "medium",
      assignedTo: "",
      estimatedTime: 60,
      notes: "",
      specialRequests: "",
    });
  };

  const updateTaskStatus = (taskId: string, status: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: status as any, 
            updatedAt: new Date().toLocaleString(),
            ...(status === "in-progress" ? { startTime: new Date().toLocaleTimeString() } : {}),
            ...(status === "completed" ? { endTime: new Date().toLocaleTimeString() } : {})
          }
        : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Housekeeping Management</h1>
          <p className="text-muted-foreground">
            Streamlined cleaning schedules, task tracking, and room maintenance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
            <DialogTrigger asChild>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Housekeeping Task</DialogTitle>
                <DialogDescription>
                  Assign a new cleaning or maintenance task to staff members
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      value={newTask.roomNumber}
                      onChange={(e) => setNewTask(prev => ({ ...prev, roomNumber: e.target.value }))}
                      placeholder="e.g., 101, 205"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskType">Task Type</Label>
                    <Select value={newTask.taskType} onValueChange={(value) => setNewTask(prev => ({ ...prev, taskType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard Cleaning">Standard Cleaning</SelectItem>
                        <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                        <SelectItem value="VIP Preparation">VIP Preparation</SelectItem>
                        <SelectItem value="Maintenance Check">Maintenance Check</SelectItem>
                        <SelectItem value="Turn-over Cleaning">Turn-over Cleaning</SelectItem>
                        <SelectItem value="Emergency Cleaning">Emergency Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
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
                  <div>
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask(prev => ({ ...prev, assignedTo: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.filter(s => s.status === "available").map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 60 }))}
                    min="15"
                    max="480"
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests (comma-separated)</Label>
                  <Input
                    id="specialRequests"
                    value={newTask.specialRequests}
                    onChange={(e) => setNewTask(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="e.g., Extra towels, Late checkout, VIP amenities"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newTask.notes}
                    onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional instructions or notes..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                  Cancel
                </Button>
                <Button onClick={createTask} className="bg-hotel-500 hover:bg-hotel-600">
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Available</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{staffStats.available}</div>
            <p className="text-xs text-muted-foreground">Ready for tasks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="supplies">Supplies</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          {/* Filters */}
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
                    placeholder="Search tasks, rooms, staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {staff.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Tasks List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Tasks ({filteredTasks.length})</CardTitle>
                  <CardDescription>Current housekeeping assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedTask?.id === task.id ? "border-hotel-500 bg-hotel-50/50" : ""
                          }`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(task.status)}
                              <h4 className="font-medium">Room {task.roomNumber}</h4>
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                            </div>
                            <Badge className={getStatusColor(task.status)} variant="outline">
                              {task.status.replace("-", " ")}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{task.taskType}</span>
                              <span className="text-muted-foreground">
                                Est: {task.estimatedTime}min
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <UserCheck className="h-3 w-3" />
                                <span>{task.assignedTo}</span>
                              </div>
                              {task.guestName && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{task.guestName}</span>
                                </div>
                              )}
                            </div>

                            {task.specialRequests && task.specialRequests.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {task.specialRequests.slice(0, 2).map((request, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {request}
                                  </Badge>
                                ))}
                                {task.specialRequests.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{task.specialRequests.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            {task.checklist && (
                              <div className="mt-2">
                                <Progress 
                                  value={(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}
                                  className="h-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {task.checklist.filter(item => item.completed).length}/{task.checklist.length} tasks completed
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="text-xs text-muted-foreground">
                              {task.startTime ? `Started: ${task.startTime}` : `Created: ${task.createdAt}`}
                            </div>
                            <div className="flex gap-1">
                              {task.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskStatus(task.id, "in-progress");
                                  }}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Start
                                </Button>
                              )}
                              {task.status === "in-progress" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskStatus(task.id, "completed");
                                  }}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Task Details */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTask ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedTask.status)}
                        <h3 className="font-medium">Room {selectedTask.roomNumber}</h3>
                        <Badge className={getPriorityColor(selectedTask.priority)} variant="outline">
                          {selectedTask.priority}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <Label className="font-medium">Task Type</Label>
                          <p className="mt-1">{selectedTask.taskType}</p>
                        </div>
                        
                        <div>
                          <Label className="font-medium">Assigned To</Label>
                          <p className="mt-1">{selectedTask.assignedTo}</p>
                        </div>
                        
                        <div>
                          <Label className="font-medium">Estimated Time</Label>
                          <p className="mt-1">{selectedTask.estimatedTime} minutes</p>
                        </div>

                        {selectedTask.guestName && (
                          <div>
                            <Label className="font-medium">Guest</Label>
                            <p className="mt-1">{selectedTask.guestName}</p>
                          </div>
                        )}

                        {selectedTask.notes && (
                          <div>
                            <Label className="font-medium">Notes</Label>
                            <p className="mt-1">{selectedTask.notes}</p>
                          </div>
                        )}

                        {selectedTask.specialRequests && selectedTask.specialRequests.length > 0 && (
                          <div>
                            <Label className="font-medium">Special Requests</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedTask.specialRequests.map((request, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {request}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedTask.checklist && selectedTask.checklist.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <Label className="font-medium">Checklist Progress</Label>
                            <div className="mt-2 space-y-2">
                              {selectedTask.checklist.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 text-sm">
                                  <Checkbox checked={item.completed} disabled />
                                  <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                                    {item.description}
                                  </span>
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {item.estimatedMinutes}min
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {selectedTask.maintenanceIssues && selectedTask.maintenanceIssues.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <Label className="font-medium">Maintenance Issues</Label>
                            <div className="mt-2 space-y-2">
                              {selectedTask.maintenanceIssues.map((issue) => (
                                <div key={issue.id} className="p-2 border rounded text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{issue.description}</span>
                                    <Badge variant="outline" className={
                                      issue.severity === "critical" ? "bg-red-100 text-red-800" :
                                      issue.severity === "high" ? "bg-orange-100 text-orange-800" :
                                      "bg-yellow-100 text-yellow-800"
                                    }>
                                      {issue.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-muted-foreground">
                                    Reported by {issue.reportedBy} on {issue.reportedAt}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a task to view details
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Supervisor
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Package className="h-4 w-4 mr-2" />
                    Request Supplies
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Wrench className="h-4 w-4 mr-2" />
                    Report Maintenance
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Photo Documentation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        member.status === "available" ? "bg-green-100 text-green-800" :
                        member.status === "busy" ? "bg-red-100 text-red-800" :
                        member.status === "break" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Shift:</span>
                      <span className="font-medium">{member.shift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{member.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className={`font-medium ${
                        member.performance >= 90 ? "text-green-600" :
                        member.performance >= 80 ? "text-yellow-600" :
                        "text-red-600"
                      }`}>
                        {member.performance}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasks Completed:</span>
                      <span className="font-medium">{member.tasksCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Time:</span>
                      <span className="font-medium">{member.averageTime}min</span>
                    </div>
                  </div>

                  {member.currentTask && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-sm font-medium">Current Task:</Label>
                      <p className="text-sm mt-1">{member.currentTask}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Tasks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="supplies" className="space-y-6">
          {/* Supply Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{supplyStats.total}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">{supplyStats.lowStock}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{supplyStats.outOfStock}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">${supplyStats.totalValue.toFixed(0)}</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supplies Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Supply Inventory</CardTitle>
                <CardDescription>Current stock levels and supply management</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-hotel-500 hover:bg-hotel-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supply
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Minimum Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Restocked</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplies.map((supply) => (
                      <TableRow key={supply.id}>
                        <TableCell className="font-medium">{supply.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{supply.currentStock} {supply.unit}</span>
                            <Progress 
                              value={(supply.currentStock / (supply.minimumStock * 3)) * 100}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{supply.minimumStock} {supply.unit}</TableCell>
                        <TableCell>
                          <Badge className={getSupplyStatusColor(supply.status)} variant="outline">
                            {supply.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{supply.lastRestocked}</TableCell>
                        <TableCell>${supply.cost.toFixed(2)}</TableCell>
                        <TableCell>${(supply.currentStock * supply.cost).toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4" />
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

        <TabsContent value="schedule" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Daily Schedule</h3>
              <p className="text-sm text-muted-foreground">Room cleaning and maintenance schedule</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Task
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Time</th>
                      <th className="text-left p-2 font-medium">Room</th>
                      <th className="text-left p-2 font-medium">Task</th>
                      <th className="text-left p-2 font-medium">Staff</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { time: "07:00", room: "101", task: "Standard Cleaning", staff: "Maria Garcia", status: "completed", duration: "90 min" },
                      { time: "08:30", room: "102", task: "Checkout Cleaning", staff: "Sarah Johnson", status: "in-progress", duration: "60 min" },
                      { time: "09:00", room: "205", task: "Deep Cleaning", staff: "Maria Garcia", status: "pending", duration: "120 min" },
                      { time: "10:00", room: "301", task: "Maintenance Check", staff: "Robert Wilson", status: "pending", duration: "45 min" },
                      { time: "11:00", room: "401", task: "VIP Preparation", staff: "Lisa Brown", status: "scheduled", duration: "150 min" },
                      { time: "13:00", room: "103", task: "Turn-over Cleaning", staff: "Sarah Johnson", status: "scheduled", duration: "75 min" },
                    ].map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{item.time}</td>
                        <td className="p-3">Room {item.room}</td>
                        <td className="p-3">{item.task}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {item.staff.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{item.staff}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(item.status)} variant="outline">
                            {item.status.replace("-", " ")}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quality Scores</CardTitle>
                <CardDescription>Room inspection ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { room: "101", score: 95, inspector: "Supervisor", date: "Today" },
                    { room: "205", score: 88, inspector: "Manager", date: "Yesterday" },
                    { room: "314", score: 98, inspector: "Supervisor", date: "Today" },
                    { room: "401", score: 92, inspector: "Manager", date: "Yesterday" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Room {item.room}</p>
                        <p className="text-sm text-muted-foreground">
                          Inspected by {item.inspector} • {item.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          item.score >= 95 ? "text-green-600" :
                          item.score >= 85 ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {item.score}%
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${
                                star <= Math.floor(item.score / 20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inspection Checklist</CardTitle>
                <CardDescription>Standard quality control points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { item: "Bed made properly", weight: 20 },
                    { item: "Bathroom cleanliness", weight: 25 },
                    { item: "Floor cleanliness", weight: 15 },
                    { item: "Dust-free surfaces", weight: 10 },
                    { item: "Amenities stocked", weight: 15 },
                    { item: "Towels arranged", weight: 10 },
                    { item: "Overall presentation", weight: 5 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Checkbox defaultChecked />
                        <span>{item.item}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.weight}%
                      </Badge>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Overall Score:</span>
                  <span className="text-2xl font-bold text-green-600">95%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Average Completion Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Standard Cleaning</span>
                    <span className="font-medium">78 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Deep Cleaning</span>
                    <span className="font-medium">125 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">VIP Preparation</span>
                    <span className="font-medium">145 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Maintenance Check</span>
                    <span className="font-medium">42 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Tasks Completed</span>
                    <span className="font-medium text-green-600">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quality Score</span>
                    <span className="font-medium text-green-600">+5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Time Efficiency</span>
                    <span className="font-medium text-green-600">+8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Guest Satisfaction</span>
                    <span className="font-medium text-green-600">+15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Daily Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Rooms Cleaned</span>
                    <span className="font-medium">34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Staff Hours</span>
                    <span className="font-medium">156h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Supply Usage</span>
                    <span className="font-medium">$145</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Efficiency Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Weekly housekeeping metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Performance analytics chart would be displayed here</p>
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
