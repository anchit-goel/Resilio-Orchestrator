import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Users, 
  TrendingUp,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Route
} from 'lucide-react';
import { AppPage } from '../App';

interface CourierHubProps {
  onNavigate: (page: AppPage) => void;
}

export function CourierHub({ onNavigate }: CourierHubProps) {
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);

  const courierStats = {
    activeDeliveries: 127,
    completedToday: 89,
    onTimeRate: 94,
    activeCouriers: 23
  };

  const activeCouriers = [
    { id: '1', name: 'Mike Johnson', vehicle: 'VAN-001', deliveries: 8, completion: 85, status: 'delivering' },
    { id: '2', name: 'Sarah Chen', vehicle: 'BIKE-005', deliveries: 12, completion: 92, status: 'available' },
    { id: '3', name: 'David Rodriguez', vehicle: 'VAN-003', deliveries: 6, completion: 78, status: 'returning' },
    { id: '4', name: 'Emma Wilson', vehicle: 'BIKE-002', deliveries: 15, completion: 96, status: 'delivering' }
  ];

  const deliveryRoutes = [
    { id: 'R1', name: 'Downtown Circuit', packages: 34, progress: 67, eta: '2h 15m', courier: 'Mike Johnson' },
    { id: 'R2', name: 'Industrial Zone', packages: 18, progress: 89, eta: '45m', courier: 'Sarah Chen' },
    { id: 'R3', name: 'Residential East', packages: 27, progress: 34, eta: '3h 20m', courier: 'David Rodriguez' },
    { id: 'R4', name: 'Business District', packages: 22, progress: 78, eta: '1h 30m', courier: 'Emma Wilson' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivering': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'returning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivering': return 'On Route';
      case 'available': return 'Available';
      case 'returning': return 'Returning';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1>Courier Hub</h1>
            <p className="text-muted-foreground text-sm">Delivery management and courier operations</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => onNavigate('settings')}>
          Settings
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deliveries</p>
                <p className="text-2xl font-bold text-blue-600">{courierStats.activeDeliveries}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{courierStats.completedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold text-primary">{courierStats.onTimeRate}%</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Couriers</p>
                <p className="text-2xl font-bold text-purple-600">{courierStats.activeCouriers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Couriers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Active Couriers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCouriers.map((courier) => (
                <div 
                  key={courier.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedCourier === courier.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCourier(courier.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(courier.status)}`}></div>
                      <div>
                        <p className="font-medium">{courier.name}</p>
                        <p className="text-sm text-muted-foreground">{courier.vehicle}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getStatusText(courier.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Today's deliveries: {courier.deliveries}</span>
                    <span className="text-muted-foreground">Completion: {courier.completion}%</span>
                  </div>
                  
                  <Progress value={courier.completion} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Route className="h-5 w-5" />
              <span>Active Routes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveryRoutes.map((route) => (
                <div key={route.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{route.name}</p>
                      <p className="text-sm text-muted-foreground">Assigned to: {route.courier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{route.packages} packages</p>
                      <p className="text-xs text-muted-foreground">ETA: {route.eta}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-muted-foreground">{route.progress}%</span>
                  </div>
                  
                  <Progress value={route.progress} className="mb-2" />
                  
                  <div className="flex justify-between">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => onNavigate('simulator')}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      Track
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => onNavigate('dashboard')}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Optimize
                    </Button>
                  </div>
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => onNavigate('simulator')}
            >
              <Package className="h-5 w-5" />
              <span className="text-xs">New Delivery</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => onNavigate('dashboard')}
            >
              <Route className="h-5 w-5" />
              <span className="text-xs">Route Planning</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2" onClick={() => onNavigate('reports')}>
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">View Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => onNavigate('reports')}
            >
              <AlertTriangle className="h-5 w-5" />
              <span className="text-xs">Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}