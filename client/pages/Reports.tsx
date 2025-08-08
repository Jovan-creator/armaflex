import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart3,
  Download,
  Upload,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BedDouble,
  Star,
  Clock,
  Target,
  Percent,
  Activity,
  PieChart,
  LineChart,
  AreaChart,
  FileText,
  File,
  Mail,
  Send,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Hash,
  Calendar as CalendarIcon,
  ClockIcon,
  MapPin,
  Building,
  Award,
  ThumbsUp,
  MessageSquare,
  Phone,
  Globe,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Wifi,
  Car,
  Utensils,
  Coffee,
  Dumbbell,
  Spa,
  CreditCard,
  Receipt,
  Calculator,
  Banknote,
  Coins,
  PiggyBank,
  Wallet,
  Database,
  Server,
  HardDrive,
  Network,
  Signal,
  Zap,
  Timer,
  Gauge,
  TrendingDown as Down,
  ArrowUp,
  ArrowDown,
  Equal,
  Maximize2,
  Minimize2,
  RotateCcw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipForward,
  Rewind,
  FastForward,
} from "lucide-react";

interface ReportMetrics {
  occupancyRate: {
    current: number;
    previous: number;
    trend: "up" | "down" | "stable";
    target: number;
  };
  revenue: {
    total: number;
    previous: number;
    trend: "up" | "down" | "stable";
    breakdown: {
      rooms: number;
      services: number;
      dining: number;
      other: number;
    };
  };
  guestSatisfaction: {
    average: number;
    previous: number;
    trend: "up" | "down" | "stable";
    breakdown: {
      service: number;
      cleanliness: number;
      location: number;
      value: number;
      amenities: number;
    };
  };
  adr: number; // Average Daily Rate
  revpar: number; // Revenue Per Available Room
  totalGuests: number;
  repeatGuests: number;
  averageStayLength: number;
}

interface ReportData {
  period: string;
  occupancy: number;
  revenue: number;
  adr: number;
  revpar: number;
  guests: number;
  satisfaction: number;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: "occupancy" | "revenue" | "guest" | "financial" | "operational" | "custom";
  metrics: string[];
  filters: {
    dateRange: string;
    properties: string[];
    departments: string[];
    guestTypes: string[];
  };
  schedule: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "monthly" | "quarterly";
    recipients: string[];
    format: "pdf" | "excel" | "csv";
  };
  createdAt: string;
  lastRun: string;
  status: "active" | "paused" | "draft";
}

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  nextRun: string;
  lastRun: string;
  recipients: string[];
  status: "active" | "paused" | "failed";
}

export default function Reports() {
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CustomReport | null>(null);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [isGenerating, setIsGenerating] = useState(false);

  const [newReport, setNewReport] = useState({
    name: "",
    description: "",
    type: "revenue" as const,
    metrics: [] as string[],
    schedule: {
      enabled: false,
      frequency: "monthly" as const,
      recipients: "",
      format: "pdf" as const,
    },
  });

  // Mock data initialization
  useEffect(() => {
    const mockMetrics: ReportMetrics = {
      occupancyRate: {
        current: 78.5,
        previous: 75.2,
        trend: "up",
        target: 80.0,
      },
      revenue: {
        total: 847650,
        previous: 782340,
        trend: "up",
        breakdown: {
          rooms: 625400,
          services: 89250,
          dining: 98760,
          other: 34240,
        },
      },
      guestSatisfaction: {
        average: 4.7,
        previous: 4.5,
        trend: "up",
        breakdown: {
          service: 4.8,
          cleanliness: 4.6,
          location: 4.9,
          value: 4.5,
          amenities: 4.7,
        },
      },
      adr: 185.50,
      revpar: 145.62,
      totalGuests: 3420,
      repeatGuests: 1254,
      averageStayLength: 2.8,
    };

    const mockReportData: ReportData[] = [
      { period: "Week 1", occupancy: 72, revenue: 180450, adr: 175, revpar: 126, guests: 420, satisfaction: 4.6 },
      { period: "Week 2", occupancy: 78, revenue: 195670, adr: 182, revpar: 142, guests: 465, satisfaction: 4.7 },
      { period: "Week 3", occupancy: 82, revenue: 215430, adr: 188, revpar: 154, guests: 498, satisfaction: 4.8 },
      { period: "Week 4", occupancy: 81, revenue: 256100, adr: 195, revpar: 158, guests: 523, satisfaction: 4.9 },
    ];

    const mockCustomReports: CustomReport[] = [
      {
        id: "1",
        name: "Weekly Revenue Summary",
        description: "Comprehensive weekly revenue breakdown with department analysis",
        type: "revenue",
        metrics: ["revenue", "adr", "revpar", "departmental-breakdown"],
        filters: {
          dateRange: "7d",
          properties: ["all"],
          departments: ["rooms", "dining", "spa"],
          guestTypes: ["all"],
        },
        schedule: {
          enabled: true,
          frequency: "weekly",
          recipients: ["finance@hotel.com", "manager@hotel.com"],
          format: "pdf",
        },
        createdAt: "2024-11-15",
        lastRun: "2024-12-23",
        status: "active",
      },
      {
        id: "2",
        name: "Guest Satisfaction Analysis",
        description: "Monthly guest satisfaction trends and improvement areas",
        type: "guest",
        metrics: ["satisfaction", "reviews", "complaints", "nps"],
        filters: {
          dateRange: "30d",
          properties: ["all"],
          departments: ["all"],
          guestTypes: ["all"],
        },
        schedule: {
          enabled: true,
          frequency: "monthly",
          recipients: ["gm@hotel.com", "guest-services@hotel.com"],
          format: "excel",
        },
        createdAt: "2024-10-20",
        lastRun: "2024-12-01",
        status: "active",
      },
      {
        id: "3",
        name: "Occupancy Forecast Model",
        description: "Predictive occupancy analysis with booking patterns",
        type: "occupancy",
        metrics: ["occupancy", "booking-pace", "forecast", "competition"],
        filters: {
          dateRange: "90d",
          properties: ["all"],
          departments: ["all"],
          guestTypes: ["business", "leisure"],
        },
        schedule: {
          enabled: false,
          frequency: "weekly",
          recipients: ["revenue@hotel.com"],
          format: "pdf",
        },
        createdAt: "2024-09-10",
        lastRun: "2024-12-20",
        status: "draft",
      },
    ];

    const mockScheduledReports: ScheduledReport[] = [
      {
        id: "1",
        name: "Daily Operations Dashboard",
        type: "Operational",
        frequency: "Daily at 8:00 AM",
        nextRun: "Tomorrow at 8:00 AM",
        lastRun: "Today at 8:00 AM",
        recipients: ["operations@hotel.com", "manager@hotel.com"],
        status: "active",
      },
      {
        id: "2",
        name: "Weekly Financial Summary",
        type: "Financial",
        frequency: "Monday at 9:00 AM",
        nextRun: "Next Monday at 9:00 AM",
        lastRun: "This Monday at 9:00 AM",
        recipients: ["finance@hotel.com", "cfo@hotel.com"],
        status: "active",
      },
      {
        id: "3",
        name: "Monthly Guest Analysis",
        type: "Guest Analytics",
        frequency: "1st of every month",
        nextRun: "January 1st at 10:00 AM",
        lastRun: "December 1st at 10:00 AM",
        recipients: ["marketing@hotel.com", "gm@hotel.com"],
        status: "paused",
      },
    ];

    setMetrics(mockMetrics);
    setReportData(mockReportData);
    setCustomReports(mockCustomReports);
    setScheduledReports(mockScheduledReports);
  }, []);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "stable": return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      case "stable": return "text-gray-600";
    }
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable" as const
    };
  };

  const generateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // In real implementation, this would trigger actual report generation
    console.log("Report generated");
  };

  const createCustomReport = () => {
    const report: CustomReport = {
      id: Date.now().toString(),
      name: newReport.name,
      description: newReport.description,
      type: newReport.type,
      metrics: newReport.metrics,
      filters: {
        dateRange: "30d",
        properties: ["all"],
        departments: ["all"],
        guestTypes: ["all"],
      },
      schedule: {
        enabled: newReport.schedule.enabled,
        frequency: newReport.schedule.frequency,
        recipients: newReport.schedule.recipients.split(",").map(r => r.trim()),
        format: newReport.schedule.format,
      },
      createdAt: new Date().toISOString().split('T')[0],
      lastRun: "",
      status: "draft",
    };

    setCustomReports(prev => [report, ...prev]);
    setShowCreateReport(false);
    setNewReport({
      name: "",
      description: "",
      type: "revenue",
      metrics: [],
      schedule: {
        enabled: false,
        frequency: "monthly",
        recipients: "",
        format: "pdf",
      },
    });
  };

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreateReport} onOpenChange={setShowCreateReport}>
            <DialogTrigger asChild>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Custom Report</DialogTitle>
                <DialogDescription>
                  Build a custom report with specific metrics and scheduling
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    value={newReport.name}
                    onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newReport.description}
                    onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the report"
                  />
                </div>
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={newReport.type} onValueChange={(value: any) => setNewReport(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue & Financial</SelectItem>
                      <SelectItem value="occupancy">Occupancy Analysis</SelectItem>
                      <SelectItem value="guest">Guest Analytics</SelectItem>
                      <SelectItem value="operational">Operational Metrics</SelectItem>
                      <SelectItem value="custom">Custom Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Include Metrics</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { id: "revenue", label: "Revenue" },
                      { id: "occupancy", label: "Occupancy" },
                      { id: "adr", label: "ADR" },
                      { id: "revpar", label: "RevPAR" },
                      { id: "satisfaction", label: "Guest Satisfaction" },
                      { id: "staff-performance", label: "Staff Performance" },
                    ].map((metric) => (
                      <label key={metric.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newReport.metrics.includes(metric.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewReport(prev => ({ ...prev, metrics: [...prev.metrics, metric.id] }));
                            } else {
                              setNewReport(prev => ({ ...prev, metrics: prev.metrics.filter(m => m !== metric.id) }));
                            }
                          }}
                        />
                        <span className="text-sm">{metric.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      checked={newReport.schedule.enabled}
                      onCheckedChange={(checked) => setNewReport(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, enabled: checked }
                      }))}
                    />
                    <Label>Schedule automatic delivery</Label>
                  </div>
                  {newReport.schedule.enabled && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select 
                          value={newReport.schedule.frequency} 
                          onValueChange={(value: any) => setNewReport(prev => ({
                            ...prev,
                            schedule: { ...prev.schedule, frequency: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="recipients">Email Recipients (comma-separated)</Label>
                        <Input
                          id="recipients"
                          value={newReport.schedule.recipients}
                          onChange={(e) => setNewReport(prev => ({
                            ...prev,
                            schedule: { ...prev.schedule, recipients: e.target.value }
                          }))}
                          placeholder="email1@company.com, email2@company.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="format">Export Format</Label>
                        <Select 
                          value={newReport.schedule.format} 
                          onValueChange={(value: any) => setNewReport(prev => ({
                            ...prev,
                            schedule: { ...prev.schedule, format: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateReport(false)}>
                  Cancel
                </Button>
                <Button onClick={createCustomReport} className="bg-hotel-500 hover:bg-hotel-600">
                  Create Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.occupancyRate.current}%</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(metrics.occupancyRate.trend)}
              <span className={getTrendColor(metrics.occupancyRate.trend)}>
                {calculateChange(metrics.occupancyRate.current, metrics.occupancyRate.previous).value}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
            <div className="mt-2">
              <Progress value={(metrics.occupancyRate.current / metrics.occupancyRate.target) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Target: {metrics.occupancyRate.target}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revenue.total.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(metrics.revenue.trend)}
              <span className={getTrendColor(metrics.revenue.trend)}>
                {calculateChange(metrics.revenue.total, metrics.revenue.previous).value}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Rooms: ${metrics.revenue.breakdown.rooms.toLocaleString()}</span>
                <span>Services: ${metrics.revenue.breakdown.services.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.guestSatisfaction.average}/5</div>
            <div className="flex items-center space-x-1 text-xs">
              {getTrendIcon(metrics.guestSatisfaction.trend)}
              <span className={getTrendColor(metrics.guestSatisfaction.trend)}>
                {(metrics.guestSatisfaction.average - metrics.guestSatisfaction.previous).toFixed(1)}
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-3 w-3 ${
                    star <= metrics.guestSatisfaction.average ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`} 
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revpar}</div>
            <div className="text-xs text-muted-foreground">Revenue Per Available Room</div>
            <div className="mt-2 space-y-1">
              <div className="text-xs">
                <span>ADR: ${metrics.adr}</span>
              </div>
              <div className="text-xs">
                <span>Total Guests: {metrics.totalGuests.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="guests">Guest Analytics</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Real-time Dashboard Widgets */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="font-medium text-green-600">+8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Occupancy Trend</span>
                    <span className="font-medium text-green-600">+3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Guest Satisfaction</span>
                    <span className="font-medium text-green-600">+0.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Staff Efficiency</span>
                    <span className="font-medium text-blue-600">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Guest Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Business Travelers</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Leisure Guests</span>
                    <span className="font-medium">55%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Repeat Guests</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">International</span>
                    <span className="font-medium">28%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  KPI Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Occupancy Target</span>
                      <span>78.5% / 80%</span>
                    </div>
                    <Progress value={98.1} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Revenue Target</span>
                      <span>$847K / $900K</span>
                    </div>
                    <Progress value={94.1} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Satisfaction Target</span>
                      <span>4.7 / 4.8</span>
                    </div>
                    <Progress value={97.9} className="h-2 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trending Charts Placeholder */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
                <CardDescription>Daily revenue performance and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Revenue trend chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library required</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Occupancy Analysis</CardTitle>
                <CardDescription>Room occupancy patterns and forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Occupancy chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate Analytics</CardTitle>
              <CardDescription>Detailed occupancy analysis and forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Period Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Average Occupancy</span>
                      <span className="font-medium">{metrics.occupancyRate.current}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Occupancy</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lowest Occupancy</span>
                      <span className="font-medium">62%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forecast Next 30 Days</span>
                      <span className="font-medium text-green-600">82%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Room Type Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Standard Rooms</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deluxe Rooms</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suites</span>
                      <span className="font-medium">71%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Presidential Suite</span>
                      <span className="font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Trends</CardTitle>
              <CardDescription>Year-over-year occupancy comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <AreaChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Seasonal occupancy trends chart would be displayed here</p>
                  <p className="text-sm">Comparison between current year and previous years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Department-wise revenue analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Room Revenue</span>
                    <span className="font-medium">${metrics.revenue.breakdown.rooms.toLocaleString()}</span>
                  </div>
                  <Progress value={(metrics.revenue.breakdown.rooms / metrics.revenue.total) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Dining Revenue</span>
                    <span className="font-medium">${metrics.revenue.breakdown.dining.toLocaleString()}</span>
                  </div>
                  <Progress value={(metrics.revenue.breakdown.dining / metrics.revenue.total) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Services Revenue</span>
                    <span className="font-medium">${metrics.revenue.breakdown.services.toLocaleString()}</span>
                  </div>
                  <Progress value={(metrics.revenue.breakdown.services / metrics.revenue.total) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Other Revenue</span>
                    <span className="font-medium">${metrics.revenue.breakdown.other.toLocaleString()}</span>
                  </div>
                  <Progress value={(metrics.revenue.breakdown.other / metrics.revenue.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
                <CardDescription>Key financial performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Daily Rate (ADR)</span>
                    <span className="font-medium">${metrics.adr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Per Available Room (RevPAR)</span>
                    <span className="font-medium">${metrics.revpar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Revenue Per Guest</span>
                    <span className="font-medium">${(metrics.revenue.total / metrics.totalGuests).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Stay Length</span>
                    <span className="font-medium">{metrics.averageStayLength} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repeat Guest Revenue</span>
                    <span className="font-medium">${((metrics.repeatGuests / metrics.totalGuests) * metrics.revenue.total).toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue performance and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Revenue trends chart would be displayed here</p>
                  <p className="text-sm">Monthly breakdown with year-over-year comparison</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guests" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Guest Satisfaction Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Service Quality</span>
                    <span className="font-medium">{metrics.guestSatisfaction.breakdown.service}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleanliness</span>
                    <span className="font-medium">{metrics.guestSatisfaction.breakdown.cleanliness}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location</span>
                    <span className="font-medium">{metrics.guestSatisfaction.breakdown.location}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value for Money</span>
                    <span className="font-medium">{metrics.guestSatisfaction.breakdown.value}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amenities</span>
                    <span className="font-medium">{metrics.guestSatisfaction.breakdown.amenities}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Loyalty Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Repeat Guest Rate</span>
                    <span className="font-medium">{((metrics.repeatGuests / metrics.totalGuests) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Promoter Score</span>
                    <span className="font-medium text-green-600">72</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Lifetime Value</span>
                    <span className="font-medium">$2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral Rate</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate</span>
                    <span className="font-medium text-red-600">8.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Avg. Booking Lead Time</span>
                    <span className="font-medium">18 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Bookings</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Bookings</span>
                    <span className="font-medium">58%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Early Check-ins</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Check-outs</span>
                    <span className="font-medium">28%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Guest Satisfaction Trends</CardTitle>
              <CardDescription>Monthly satisfaction scores and improvement areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Guest satisfaction trends chart would be displayed here</p>
                  <p className="text-sm">Category-wise satisfaction scores over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Front Desk</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Housekeeping</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance</span>
                    <span className="font-medium text-yellow-600">88%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Restaurant</span>
                    <span className="font-medium text-green-600">91%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guest Services</span>
                    <span className="font-medium text-green-600">96%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tasks Completed</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Response Time</span>
                    <span className="font-medium">12 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Score</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Hours</span>
                    <span className="font-medium">156h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overtime Hours</span>
                    <span className="font-medium text-orange-600">23h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Employee Satisfaction</span>
                    <span className="font-medium">4.2/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention Rate</span>
                    <span className="font-medium text-green-600">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Absenteeism</span>
                    <span className="font-medium text-yellow-600">3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Promotions</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Completion</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Trends</CardTitle>
              <CardDescription>Department-wise performance and productivity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Staff performance trends chart would be displayed here</p>
                  <p className="text-sm">Performance metrics across different departments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>Build and manage custom analytics reports</CardDescription>
              </div>
              <Button onClick={() => setShowCreateReport(true)} className="bg-hotel-500 hover:bg-hotel-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={report.status === "active" ? "default" : report.status === "paused" ? "secondary" : "outline"}
                        >
                          {report.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Type: {report.type}</span>
                      <span>•</span>
                      <span>Metrics: {report.metrics.length}</span>
                      <span>•</span>
                      <span>Last run: {report.lastRun || "Never"}</span>
                      {report.schedule.enabled && (
                        <>
                          <span>•</span>
                          <span>Schedule: {report.schedule.frequency}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={generateReport}>
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Run Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Report Delivery</CardTitle>
              <CardDescription>Automated report scheduling and email delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                      </div>
                      <Badge
                        variant={report.status === "active" ? "default" : report.status === "paused" ? "secondary" : "destructive"}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Frequency: </span>
                        <span>{report.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Run: </span>
                        <span>{report.nextRun}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Run: </span>
                        <span>{report.lastRun}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Recipients: </span>
                        <span>{report.recipients.length} people</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Schedule
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-3 w-3 mr-1" />
                        Send Now
                      </Button>
                      <Button variant="outline" size="sm">
                        {report.status === "active" ? (
                          <>
                            <PauseCircle className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Formats & Settings</CardTitle>
              <CardDescription>Configure export formats and delivery preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold">Available Export Formats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium">PDF Report</p>
                          <p className="text-sm text-muted-foreground">Professional formatted reports</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Excel Spreadsheet</p>
                          <p className="text-sm text-muted-foreground">Data analysis and manipulation</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">CSV Data</p>
                          <p className="text-sm text-muted-foreground">Raw data for integration</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Delivery Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email Delivery</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dashboard Notifications</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mobile Push Notifications</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Archive Reports</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      {isGenerating && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Generating report... This may take a few moments.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
