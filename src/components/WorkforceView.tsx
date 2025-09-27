import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp, 
  UserCheck,
  UserX,
  Award,
  Target,
  BarChart3,
  AlertCircle,
  Plus
} from 'lucide-react';
import { AppPage } from '../App';

interface WorkforceViewProps {
  onNavigate: (page: AppPage) => void;
}

export function WorkforceView({ onNavigate }: WorkforceViewProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const workforceStats = {
    totalEmployees: 342,
    activeToday: 298,
    attendanceRate: 87.1,
    avgProductivity: 92.5
  };

  const departments = [
    { id: 'operations', name: 'Operations', count: 127, active: 118, productivity: 94 },
    { id: 'logistics', name: 'Logistics', count: 89, active: 82, productivity: 91 },
    { id: 'maintenance', name: 'Maintenance', count: 64, active: 58, productivity: 88 },
    { id: 'administration', name: 'Administration', count: 62, active: 40, productivity: 96 }
  ];

  const topPerformers = [
    { id: '1', name: 'Alex Chen', department: 'Operations', score: 98, shift: 'Day', status: 'active' },
    { id: '2', name: 'Maria Garcia', department: 'Logistics', score: 96, shift: 'Day', status: 'active' },
    { id: '3', name: 'James Wilson', department: 'Maintenance', score: 94, shift: 'Night', status: 'active' },
    { id: '4', name: 'Sophie Turner', department: 'Operations', score: 93, shift: 'Day', status: 'break' }
  ];

  const scheduleAlerts = [
    { id: '1', type: 'understaffed', message: 'Night shift understaffed in Logistics', severity: 'high' },
    { id: '2', type: 'overtime', message: '5 employees approaching overtime limit', severity: 'medium' },
    { id: '3', type: 'training', message: '12 employees due for safety training', severity: 'low' },
    { id: '4', type: 'absence', message: 'Unexpected absence in Maintenance', severity: 'high' }
  ];

  const shiftData = [
    { shift: 'Day (6AM-2PM)', scheduled: 156, present: 142, productivity: 94 },
    { shift: 'Evening (2PM-10PM)', scheduled: 98, present: 89, productivity: 91 },
    { shift: 'Night (10PM-6AM)', scheduled: 88, present: 67, productivity: 85 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1>Workforce Management</h1>
            <p className="text-muted-foreground text-sm">Employee scheduling and performance tracking</p>
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
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold text-green-600">{workforceStats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold text-blue-600">{workforceStats.activeToday}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-primary">{workforceStats.attendanceRate}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Productivity</p>
                <p className="text-2xl font-bold text-purple-600">{workforceStats.avgProductivity}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Department Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept) => (
                <div 
                  key={dept.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedDepartment === dept.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">{dept.active}/{dept.count} active</p>
                    </div>
                    <Badge variant="secondary">
                      {dept.productivity}% productive
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attendance</span>
                      <span>{Math.round((dept.active / dept.count) * 100)}%</span>
                    </div>
                    <Progress value={(dept.active / dept.count) * 100} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-muted-foreground w-4">
                      #{index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(performer.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">{performer.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{performer.score}</p>
                    <div className={`w-2 h-2 rounded-full ${
                      performer.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Shift Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Today's Shifts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shiftData.map((shift, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{shift.shift}</p>
                    <Badge variant="outline">
                      {shift.present}/{shift.scheduled}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Attendance: {Math.round((shift.present / shift.scheduled) * 100)}%</span>
                    <span>Productivity: {shift.productivity}%</span>
                  </div>
                  
                  <Progress value={(shift.present / shift.scheduled) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Schedule Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduleAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {alert.severity} priority • {alert.type}
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
              onClick={() => onNavigate('settings')}
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Employee</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => onNavigate('simulator')}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Schedule</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2" onClick={() => onNavigate('reports')}>
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">View Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col space-y-2"
              onClick={() => onNavigate('dashboard')}
            >
              <Award className="h-5 w-5" />
              <span className="text-xs">Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}