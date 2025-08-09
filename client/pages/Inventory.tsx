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
import { Progress } from '@/components/ui/progress';
import { 
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Plus,
  Edit,
  Search,
  Filter,
  Download,
  Upload,
  Scan,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  RefreshCw
} from 'lucide-react';

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'Bath Towels',
      category: 'Linens',
      sku: 'LIN-001',
      currentStock: 45,
      minStock: 50,
      maxStock: 200,
      unit: 'pieces',
      location: 'Housekeeping Storage',
      supplier: 'Hotel Linens Co.',
      unitCost: 12.50,
      lastRestocked: '2024-01-10',
      status: 'low'
    },
    {
      id: 2,
      name: 'Toilet Paper',
      category: 'Bathroom Supplies',
      sku: 'BAT-005',
      currentStock: 250,
      minStock: 100,
      maxStock: 500,
      unit: 'rolls',
      location: 'Main Storage',
      supplier: 'Hygiene Plus Ltd.',
      unitCost: 2.25,
      lastRestocked: '2024-01-12',
      status: 'good'
    },
    {
      id: 3,
      name: 'Coffee Pods',
      category: 'Food & Beverage',
      sku: 'FB-012',
      currentStock: 15,
      minStock: 50,
      maxStock: 300,
      unit: 'boxes',
      location: 'Kitchen Storage',
      supplier: 'Premium Coffee Co.',
      unitCost: 8.75,
      lastRestocked: '2024-01-08',
      status: 'critical'
    },
    {
      id: 4,
      name: 'Hand Soap',
      category: 'Bathroom Supplies',
      sku: 'BAT-002',
      currentStock: 80,
      minStock: 30,
      maxStock: 150,
      unit: 'bottles',
      location: 'Housekeeping Storage',
      supplier: 'Clean Solutions Inc.',
      unitCost: 4.50,
      lastRestocked: '2024-01-14',
      status: 'good'
    },
    {
      id: 5,
      name: 'Bed Sheets (Queen)',
      category: 'Linens',
      sku: 'LIN-003',
      currentStock: 120,
      minStock: 80,
      maxStock: 300,
      unit: 'sets',
      location: 'Housekeeping Storage',
      supplier: 'Hotel Linens Co.',
      unitCost: 28.00,
      lastRestocked: '2024-01-11',
      status: 'good'
    }
  ]);

  const [assets, setAssets] = useState([
    {
      id: 1,
      name: 'Smart TV 55"',
      category: 'Electronics',
      assetTag: 'ELE-001',
      location: 'Room 101',
      purchaseDate: '2023-06-15',
      warranty: '2025-06-15',
      value: 800,
      condition: 'excellent',
      lastMaintenance: '2024-01-05'
    },
    {
      id: 2,
      name: 'Mini Refrigerator',
      category: 'Appliances',
      assetTag: 'APP-001',
      location: 'Room 102',
      purchaseDate: '2023-08-20',
      warranty: '2025-08-20',
      value: 450,
      condition: 'good',
      lastMaintenance: '2023-12-20'
    },
    {
      id: 3,
      name: 'Vacuum Cleaner',
      category: 'Cleaning Equipment',
      assetTag: 'CLN-005',
      location: 'Housekeeping',
      purchaseDate: '2023-04-10',
      warranty: '2024-04-10',
      value: 320,
      condition: 'fair',
      lastMaintenance: '2024-01-08'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockPercentage = (current: number, min: number, max: number) => {
    return (current / max) * 100;
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalItems = inventoryItems.filter(item => item.status === 'critical').length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'low').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage hotel supplies, assets, and inventory levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="supplies">Supplies</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{inventoryItems.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical Stock</p>
                    <p className="text-2xl font-bold text-red-600">{criticalItems}</p>
                    <p className="text-xs text-muted-foreground">Needs immediate attention</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                    <p className="text-xs text-muted-foreground">Below minimum level</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Current inventory value</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Stock Alerts
              </CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems
                  .filter(item => item.status === 'critical' || item.status === 'low')
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.currentStock} {item.unit} remaining (Min: {item.minStock})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)} variant="secondary">
                          {item.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Levels by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels by Category</CardTitle>
              <CardDescription>Overview of inventory levels across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Linens', 'Bathroom Supplies', 'Food & Beverage', 'Cleaning Supplies'].map((category) => {
                  const categoryItems = inventoryItems.filter(item => item.category === category);
                  const totalItems = categoryItems.length;
                  const criticalCount = categoryItems.filter(item => item.status === 'critical').length;
                  const lowCount = categoryItems.filter(item => item.status === 'low').length;
                  
                  return (
                    <div key={category} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-muted-foreground">{totalItems} items</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {criticalCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {criticalCount} critical
                          </Badge>
                        )}
                        {lowCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {lowCount} low
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplies Tab */}
        <TabsContent value="supplies" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items, SKU, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="linens">Linens</SelectItem>
                      <SelectItem value="bathroom">Bathroom</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Complete list of hotel supplies and consumables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.unitCost} per {item.unit}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.currentStock} {item.unit}</span>
                              <span className="text-muted-foreground">
                                {Math.round(getStockPercentage(item.currentStock, item.minStock, item.maxStock))}%
                              </span>
                            </div>
                            <Progress 
                              value={getStockPercentage(item.currentStock, item.minStock, item.maxStock)} 
                              className="h-2"
                            />
                            <p className="text-xs text-muted-foreground">
                              Min: {item.minStock} | Max: {item.maxStock}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm">{item.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)} variant="secondary">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-3 w-3" />
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

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management</CardTitle>
              <CardDescription>Track and manage hotel equipment and assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Tag</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Warranty</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-sm text-muted-foreground">{asset.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{asset.assetTag}</TableCell>
                        <TableCell>{asset.location}</TableCell>
                        <TableCell>${asset.value.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={asset.condition === 'excellent' ? 'default' : 
                                   asset.condition === 'good' ? 'secondary' : 'destructive'}
                          >
                            {asset.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{asset.warranty}</p>
                            <p className="text-muted-foreground">
                              Last maintenance: {asset.lastMaintenance}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Scan className="h-3 w-3" />
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

        {/* Purchase Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Manage procurement and supplier orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Purchase Orders</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first purchase order to restock inventory
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Purchase Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
