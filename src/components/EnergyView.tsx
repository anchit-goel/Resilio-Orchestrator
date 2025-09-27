import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  Gauge, 
  Battery,
  Sun,
  Wind,
  Thermometer,
  DollarSign,
  AlertTriangle,
  Settings,
  BarChart3
} from 'lucide-react';
import { AppPage } from '../App';

interface EnergyViewProps {
  onNavigate: (page: AppPage) => void;
}

export function EnergyView({ onNavigate }: EnergyViewProps) {
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const energyStats = {
    totalConsumption: 2847.5, // kWh
    efficiency: 87.3,
    costToday: 1847.32,
    carbonReduction: 12.4
  };

  const energyZones = [
    { 
      id: 'warehouse', 
      name: 'Warehouse', 
      consumption: 1247.8, 
      efficiency: 89, 
      status: 'optimal',
      trend: 'down',
      savings: '$124'
    },
    { 
      id: 'office', 
      name: 'Office Building', 
      consumption: 687.3, 
      efficiency: 92, 
      status: 'efficient',
      trend: 'down',
      savings: '$67'
    },
    { 
      id: 'loading', 
      name: 'Loading Docks', 
      consumption: 512.9, 
      efficiency: 78, 
      status: 'attention',
      trend: 'up',
      savings: '-$23'
    },
    { 
      id: 'parking', 
      name: 'Parking Areas', 
      consumption: 399.5, 
      efficiency: 85, 
      status: 'good',
      trend: 'stable',
      savings: '$45'
    }
  ];

  const renewableSources = [
    { type: 'Solar Panels', capacity: 450, current: 387, efficiency: 86, icon: Sun },
    { type: 'Wind Turbines', capacity: 200, current: 156, efficiency: 78, icon: Wind },
    { type: 'Battery Storage', capacity: 300, current: 234, efficiency: 91, icon: Battery }
  ];

  const energyAlerts = [
    { id: '1', type: 'high_usage', message: 'Loading Dock 3 exceeding normal consumption', severity: 'high' },
    { id: '2', type: 'maintenance', message: 'Solar panel efficiency below 85%', severity: 'medium' },
    { id: '3', type: 'cost', message: 'Peak hour rates starting in 30 minutes', severity: 'low' },
    { id: '4', type: 'temperature', message: 'HVAC optimization opportunity detected', severity: 'medium' }
  ];

  const hourlyData = [
    { hour: '00:00', consumption: 234, cost: 89.23, efficiency: 91 },
    { hour: '06:00', consumption: 456, cost: 145.67, efficiency: 87 },
    { hour: '12:00', consumption: 678, cost: 234.56, efficiency: 82 },
    { hour: '18:00', consumption: 543, cost: 189.34, efficiency: 85 },
    { hour: '24:00', consumption: 287, cost: 98.76, efficiency: 89 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'efficient': return 'bg-blue-500';
      case 'good': return 'bg-teal-500';
      case 'attention': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <span className="text-muted-foreground">—</span>;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1>Energy Management</h1>
            <p className="text-muted-foreground text-sm">Energy consumption and efficiency monitoring</p>
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
                <p className="text-sm text-muted-foreground">Total Consumption</p>
                <p className="text-2xl font-bold text-yellow-600">{energyStats.totalConsumption}</p>
                <p className="text-xs text-muted-foreground">kWh today</p>
              </div>
              <Gauge className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold text-green-600">{energyStats.efficiency}%</p>
                <p className="text-xs text-green-600">+2.3% vs yesterday</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Today</p>
                <p className="text-2xl font-bold text-primary">${energyStats.costToday}</p>
                <p className="text-xs text-green-600">-$89 savings</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Carbon Reduction</p>
                <p className="text-2xl font-bold text-green-600">{energyStats.carbonReduction}%</p>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </div>
              <Sun className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Energy Zones */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Energy Zones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {energyZones.map((zone) => (
                <div 
                  key={zone.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedZone === zone.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(zone.status)}`}></div>
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">{zone.consumption} kWh</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(zone.trend)}
                      <Badge variant={zone.savings.startsWith('-') ? 'destructive' : 'secondary'}>
                        {zone.savings}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span>{zone.efficiency}%</span>
                    </div>
                    <Progress value={zone.efficiency} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Renewable Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <span>Renewable Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {renewableSources.map((source, index) => {
                const Icon = source.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{source.type}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {source.efficiency}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{source.current} kW</span>
                      <span>{source.capacity} kW max</span>
                    </div>
                    
                    <Progress value={(source.current / source.capacity) * 100} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hourly Consumption */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Today's Consumption</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium w-12">{data.hour}</span>
                    <div>
                      <p className="text-sm font-medium">{data.consumption} kWh</p>
                      <p className="text-xs text-muted-foreground">${data.cost}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{data.efficiency}%</p>
                    <p className="text-xs text-muted-foreground">efficient</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Energy Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Energy Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {energyAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {alert.severity} priority • {alert.type.replace('_', ' ')}
                  </p>
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
              onClick={() => onNavigate('dashboard')}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Optimize</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => onNavigate('simulator')}
            >
              <Thermometer className="h-5 w-5" />
              <span className="text-xs">HVAC Control</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2" onClick={() => onNavigate('reports')}>
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Energy Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => onNavigate('dashboard')}
            >
              <Sun className="h-5 w-5" />
              <span className="text-xs">Renewables</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}