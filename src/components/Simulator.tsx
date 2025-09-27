import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { OperationType } from './LoginPage';
import { useDataService } from './DataService';
import { 
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  Rewind,
  RotateCcw,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Package,
  Building2,
  Truck,
  Zap,
  BarChart3,
  Settings,
  MapPin,
  Activity,
  Battery,
  Gauge,
  Timer,
  Target,
  Loader2
} from 'lucide-react';
import { AppPage } from '../App';

interface SimulatorProps {
  onNavigate: (page: AppPage) => void;
  operationType?: OperationType;
}

interface Event {
  id: string;
  time: string;
  type: 'delay' | 'alert' | 'info' | 'critical' | 'success';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact?: string;
  action?: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  objectives: string[];
}

interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  target?: string;
  unit?: string;
}

export function Simulator({ onNavigate, operationType = 'terminal' }: SimulatorProps) {
  const { getKPIValues, hasRealData } = useDataService();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Minutes since start
  const [simulationSpeed, setSimulationSpeed] = useState([60]); // 60x speed
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [performanceData, setPerformanceData] = useState<{time: string, throughput: number, efficiency: number, responseTime: number}[]>([]);
  
  // Get real data for the current operation
  const kpiData = React.useMemo(() => getKPIValues(operationType), [getKPIValues, operationType]);
  const hasData = React.useMemo(() => hasRealData(operationType), [hasRealData, operationType]);

  const getOperationConfig = (operation: OperationType) => {
    const configs = {
      terminal: {
        name: 'Terminal Operations',
        icon: Building2,
        color: '#0891b2',
        unit: 'containers'
      },
      courier: {
        name: 'Courier Hub',
        icon: Truck,
        color: '#059669',
        unit: 'deliveries'
      },
      workforce: {
        name: 'Workforce Management',
        icon: Users,
        color: '#7c3aed',
        unit: 'employees'
      },
      energy: {
        name: 'Energy Management',
        icon: Zap,
        color: '#ca8a04',
        unit: 'kWh'
      }
    };
    return configs[operation] || configs.terminal;
  };

  const getScenarios = (operation: OperationType): Scenario[] => {
    const scenarioSets = {
      terminal: [
        {
          id: 'peak-hours',
          name: 'Peak Hour Rush',
          description: 'Simulate high-traffic terminal operations during peak hours',
          duration: 480, // 8 hours
          difficulty: 'medium' as const,
          objectives: ['Maintain 90% efficiency', 'Process 500+ containers', 'Keep delays under 15 min']
        },
        {
          id: 'equipment-failure',
          name: 'Equipment Failure Scenario',
          description: 'Handle critical crane malfunction during busy period',
          duration: 360, // 6 hours
          difficulty: 'hard' as const,
          objectives: ['Reroute operations', 'Minimize downtime', 'Maintain safety standards']
        },
        {
          id: 'weather-disruption',
          name: 'Weather Disruption',
          description: 'Navigate operations during severe weather conditions',
          duration: 240, // 4 hours
          difficulty: 'medium' as const,
          objectives: ['Ensure worker safety', 'Protect cargo', 'Plan recovery operations']
        }
      ],
      courier: [
        {
          id: 'holiday-surge',
          name: 'Holiday Delivery Surge',
          description: 'Manage increased package volume during holiday season',
          duration: 600, // 10 hours
          difficulty: 'hard' as const,
          objectives: ['Process 2000+ packages', 'Maintain delivery times', 'Optimize routes']
        },
        {
          id: 'driver-shortage',
          name: 'Driver Shortage Crisis',
          description: 'Operate with 30% fewer drivers than optimal',
          duration: 480, // 8 hours
          difficulty: 'hard' as const,
          objectives: ['Reschedule deliveries', 'Prioritize urgent packages', 'Maintain service quality']
        },
        {
          id: 'route-optimization',
          name: 'Route Optimization Challenge',
          description: 'Test new routing algorithms under normal conditions',
          duration: 360, // 6 hours
          difficulty: 'easy' as const,
          objectives: ['Reduce fuel consumption', 'Improve delivery times', 'Increase efficiency']
        }
      ],
      workforce: [
        {
          id: 'shift-transition',
          name: 'Complex Shift Transition',
          description: 'Manage handovers during critical operations',
          duration: 120, // 2 hours
          difficulty: 'medium' as const,
          objectives: ['Smooth knowledge transfer', 'Maintain productivity', 'Ensure continuity']
        },
        {
          id: 'training-day',
          name: 'New Employee Training',
          description: 'Integrate new hires while maintaining operations',
          duration: 480, // 8 hours
          difficulty: 'easy' as const,
          objectives: ['Complete training modules', 'Pair with mentors', 'Monitor progress']
        },
        {
          id: 'emergency-response',
          name: 'Emergency Response Drill',
          description: 'Test emergency procedures and response times',
          duration: 180, // 3 hours
          difficulty: 'hard' as const,
          objectives: ['Execute emergency protocols', 'Evacuate safely', 'Resume operations quickly']
        }
      ],
      energy: [
        {
          id: 'peak-demand',
          name: 'Peak Energy Demand',
          description: 'Manage operations during maximum energy consumption',
          duration: 360, // 6 hours
          difficulty: 'medium' as const,
          objectives: ['Balance load distribution', 'Avoid grid overload', 'Maintain efficiency']
        },
        {
          id: 'renewable-integration',
          name: 'Renewable Energy Integration',
          description: 'Optimize mix of renewable and traditional energy sources',
          duration: 720, // 12 hours
          difficulty: 'hard' as const,
          objectives: ['Maximize renewable usage', 'Ensure stable supply', 'Reduce carbon footprint']
        },
        {
          id: 'equipment-maintenance',
          name: 'Scheduled Maintenance',
          description: 'Perform maintenance while minimizing service disruption',
          duration: 480, // 8 hours
          difficulty: 'easy' as const,
          objectives: ['Complete maintenance tasks', 'Minimize downtime', 'Test all systems']
        }
      ]
    };
    return scenarioSets[operation] || scenarioSets.terminal;
  };

  const getMetrics = (operation: OperationType): MetricData[] => {
    const currentKpiData = getKPIValues(operation);
    
    const metricSets = {
      terminal: [
        { 
          title: 'Container Throughput', 
          value: currentKpiData.throughput.toLocaleString(), 
          change: '+12%', 
          trend: 'up' as const,
          icon: Package,
          color: 'text-blue-600',
          target: (currentKpiData.throughput * 1.15).toLocaleString(),
          unit: 'containers/day'
        },
        { 
          title: 'Processing Time', 
          value: `${currentKpiData.avgProcessingTime} min`, 
          change: '-8%', 
          trend: 'down' as const,
          icon: Clock,
          color: 'text-green-600',
          target: `< ${(currentKpiData.avgProcessingTime * 0.9).toFixed(1)} min`,
          unit: 'avg'
        },
        { 
          title: 'Berth Utilization', 
          value: `${currentKpiData.efficiency}%`, 
          change: '+5%', 
          trend: 'up' as const,
          icon: Building2,
          color: 'text-purple-600',
          target: `${Math.min(95, currentKpiData.efficiency + 5)}%`,
          unit: 'utilization'
        },
        { 
          title: 'Safety Score', 
          value: `${Math.round(100 - currentKpiData.errorRate)}%`, 
          change: '+2%', 
          trend: 'up' as const,
          icon: Target,
          color: 'text-teal-600',
          target: '95%',
          unit: 'score'
        }
      ],
      courier: [
        { 
          title: 'Delivery Rate', 
          value: `${currentKpiData.efficiency}%`, 
          change: '+3%', 
          trend: 'up' as const,
          icon: Truck,
          color: 'text-blue-600',
          target: `${Math.min(98, currentKpiData.efficiency + 2)}%`,
          unit: 'on-time'
        },
        { 
          title: 'Route Efficiency', 
          value: `${Math.round(currentKpiData.uptime * 0.85)}%`, 
          change: '+7%', 
          trend: 'up' as const,
          icon: MapPin,
          color: 'text-green-600',
          target: '90%',
          unit: 'optimal'
        },
        { 
          title: 'Avg Processing Time', 
          value: `${currentKpiData.avgProcessingTime} min`, 
          change: '-5%', 
          trend: 'down' as const,
          icon: Gauge,
          color: 'text-purple-600',
          target: `< ${(currentKpiData.avgProcessingTime * 0.9).toFixed(1)} min`,
          unit: 'per delivery'
        },
        { 
          title: 'Active Vehicles', 
          value: currentKpiData.activeUnits.toString(), 
          change: '+3', 
          trend: 'up' as const,
          icon: Target,
          color: 'text-teal-600',
          target: (currentKpiData.activeUnits + 5).toString(),
          unit: 'vehicles'
        }
      ],
      workforce: [
        { 
          title: 'Staff Utilization', 
          value: '89%', 
          change: '+4%', 
          trend: 'up' as const,
          icon: Users,
          color: 'text-blue-600',
          target: '85%',
          unit: 'optimal'
        },
        { 
          title: 'Productivity Index', 
          value: '127', 
          change: '+8%', 
          trend: 'up' as const,
          icon: TrendingUp,
          color: 'text-green-600',
          target: '130',
          unit: 'index'
        },
        { 
          title: 'Training Progress', 
          value: '78%', 
          change: '+12%', 
          trend: 'up' as const,
          icon: Activity,
          color: 'text-purple-600',
          target: '85%',
          unit: 'completion'
        },
        { 
          title: 'Satisfaction Score', 
          value: '8.2', 
          change: '+0.3', 
          trend: 'up' as const,
          icon: Target,
          color: 'text-teal-600',
          target: '8.5',
          unit: '/10'
        }
      ],
      energy: [
        { 
          title: 'Energy Efficiency', 
          value: '91%', 
          change: '+6%', 
          trend: 'up' as const,
          icon: Zap,
          color: 'text-blue-600',
          target: '95%',
          unit: 'efficiency'
        },
        { 
          title: 'Power Consumption', 
          value: '847 kW', 
          change: '-3%', 
          trend: 'down' as const,
          icon: Battery,
          color: 'text-green-600',
          target: '< 850 kW',
          unit: 'current'
        },
        { 
          title: 'Renewable Mix', 
          value: '67%', 
          change: '+15%', 
          trend: 'up' as const,
          icon: Activity,
          color: 'text-purple-600',
          target: '70%',
          unit: 'renewable'
        },
        { 
          title: 'Cost Savings', 
          value: '$2,340', 
          change: '+18%', 
          trend: 'up' as const,
          icon: Target,
          color: 'text-teal-600',
          target: '$2,500',
          unit: 'today'
        }
      ]
    };
    return metricSets[operation] || metricSets.terminal;
  };

  // Simulate real-time updates
  useEffect(() => {
    if (!isPlaying || !selectedScenario) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        const scenario = getScenarios(operationType).find(s => s.id === selectedScenario);
        if (scenario) {
          const progress = (newTime / scenario.duration) * 100;
          setSimulationProgress(Math.min(progress, 100));
          
          // Generate performance data point every 15 seconds
          if (newTime % 15 === 0) {
            generatePerformanceDataPoint(newTime, scenario);
          }
          
          // Generate random events based on scenario
          if (newTime % 30 === 0) { // Every 30 seconds of simulation
            generateRandomEvent(newTime, scenario);
          }
          
          // Auto-complete scenario when finished
          if (newTime >= scenario.duration) {
            setIsPlaying(false);
            toast.success(`Scenario "${scenario.name}" completed successfully!`);
            return scenario.duration;
          }
        }
        return newTime;
      });
    }, 1000 / simulationSpeed[0]); // Adjust speed
    
    return () => clearInterval(interval);
  }, [isPlaying, selectedScenario, simulationSpeed, operationType]);

  const generateRandomEvent = (time: number, scenario: Scenario) => {
    const eventTypes = ['info', 'alert', 'delay', 'success'];
    
    // Generate events based on real data patterns when available
    const baseMessages = {
      terminal: [
        'Container ship arrived at berth 3',
        'Crane #2 efficiency increased to 95%',
        'Traffic congestion detected at gate',
        'New cargo manifest received',
        'Shift handover completed successfully'
      ],
      courier: [
        'New delivery batch processed',
        'Route optimization improved by 12%',
        'Driver check-in at location Alpha',
        'Package sorting completed',
        'Customer delivery confirmed'
      ],
      workforce: [
        'Employee training session completed',
        'Shift productivity target achieved',
        'Safety inspection passed',
        'New hire orientation started',
        'Team performance milestone reached'
      ],
      energy: [
        'Solar panel efficiency optimized',
        'Power grid load balanced',
        'Equipment maintenance scheduled',
        'Energy consumption reduced',
        'Renewable target achieved'
      ]
    };

    // Add data-driven context when real data is available
    const dataContextMessages = hasData ? [
      `Data anomaly detected in ${operationType} metrics`,
      `Performance threshold from imported data exceeded`,
      `Historical pattern match identified in current operation`,
      `Real-time data validation completed successfully`,
      `Data-driven optimization suggestion generated`
    ] : [];
    
    const allMessages = [...(baseMessages[operationType] || baseMessages.terminal), ...dataContextMessages];
    const randomMessage = allMessages[Math.floor(Math.random() * allMessages.length)];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)] as any;
    const randomSeverity = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any;
    
    const newEvent: Event = {
      id: Date.now().toString(),
      time: formatTime(time),
      type: randomType,
      message: randomMessage,
      severity: randomSeverity,
      impact: scenario.difficulty === 'hard' ? 'High impact on operations' : 'Normal operational impact',
      action: randomType === 'alert' ? 'Review and respond' : undefined
    };
    
    setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  const generatePerformanceDataPoint = (time: number, scenario: Scenario) => {
    const timeLabel = formatTime(time);
    
    // Base performance values from real data or defaults
    const baseThroughput = hasData ? kpiData.throughput : 150;
    const baseEfficiency = hasData ? kpiData.efficiency : 85;
    const baseResponseTime = hasData ? kpiData.avgProcessingTime : 45;
    
    // Add variability based on scenario difficulty and time progression
    const difficultyMultiplier = scenario.difficulty === 'hard' ? 0.8 : scenario.difficulty === 'medium' ? 0.9 : 1.0;
    const timeProgressFactor = Math.sin((time / scenario.duration) * Math.PI) * 0.2 + 0.9; // Slight performance curve
    const randomVariation = (Math.random() - 0.5) * 0.1; // ±5% random variation
    
    const dataPoint = {
      time: timeLabel,
      throughput: Math.round(baseThroughput * difficultyMultiplier * timeProgressFactor * (1 + randomVariation)),
      efficiency: Math.round(baseEfficiency * difficultyMultiplier * timeProgressFactor * (1 + randomVariation * 0.5)),
      responseTime: Math.round(baseResponseTime * (2 - difficultyMultiplier) * (2 - timeProgressFactor) * (1 + randomVariation * 0.3))
    };
    
    setPerformanceData(prev => {
      const newData = [...prev, dataPoint];
      // Keep last 20 data points for performance
      return newData.slice(-20);
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60) + 8; // Start at 8:00 AM
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleScenarioStart = async (scenarioId: string) => {
    setIsLoading(true);
    setSelectedScenario(scenarioId);
    setCurrentTime(0);
    setSimulationProgress(0);
    setEvents([]);
    setPerformanceData([]);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsPlaying(true);
    
    const scenario = getScenarios(operationType).find(s => s.id === scenarioId);
    toast.success(`Started scenario: ${scenario?.name}`);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setSimulationProgress(0);
    setEvents([]);
    setSelectedScenario('');
    toast.info('Simulation reset');
  };

  const operationConfig = getOperationConfig(operationType);
  const scenarios = getScenarios(operationType);
  const metrics = getMetrics(operationType);
  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Check if data is available before showing simulator content
  if (!hasData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('home')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: operationConfig.color }}>
                  <operationConfig.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-foreground">Operations Simulator</h1>
                  <p className="text-muted-foreground text-sm">{operationConfig.name}</p>
                </div>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              No Data
            </Badge>
          </div>
        </div>

        {/* No Data State */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            
            <h2 className="text-lg font-medium text-foreground mb-2">No Data Files Imported</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              The Operations Simulator requires real data to run meaningful training scenarios. 
              Import your operational data files to unlock comprehensive simulation capabilities 
              with realistic metrics and scenarios.
            </p>

            <Card className="border border-border bg-accent/5 mb-6">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-3">What you can import:</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Performance metrics (.xlsx, .csv, .json)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Operational records and logs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Historical data for trend analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>KPI dashboards and reports</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={() => onNavigate('settings')}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Import Data Files
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => onNavigate('home')}
                className="w-full"
              >
                Back to Control Center
              </Button>
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Tip:</strong> Upload at least one data file containing {operationType} operations 
                data to enable simulator functionality and start training scenarios.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: operationConfig.color }}>
                <operationConfig.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-foreground">Operations Simulator</h1>
                <p className="text-muted-foreground text-sm">{operationConfig.name}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasData && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Real Data
              </Badge>
            )}
            {isPlaying && (
              <Badge className="bg-green-100 text-green-700 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            )}
            <Badge variant="outline">
              {formatTime(currentTime)}
            </Badge>
          </div>
        </div>

        {/* Scenario Selection */}
        {!selectedScenario ? (
          <div className="mt-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-2">Select Training Scenario</h3>
              <div className="grid gap-3">
                {scenarios.map((scenario) => (
                  <Card 
                    key={scenario.id} 
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border"
                    onClick={() => handleScenarioStart(scenario.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-sm font-medium">{scenario.name}</h4>
                            <Badge className={`text-xs ${getDifficultyColor(scenario.difficulty)}`}>
                              {scenario.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{scenario.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Timer className="h-3 w-3 mr-1" />
                              {Math.floor(scenario.duration / 60)}h {scenario.duration % 60}m
                            </span>
                            <span className="flex items-center">
                              <Target className="h-3 w-3 mr-1" />
                              {scenario.objectives.length} objectives
                            </span>
                          </div>
                        </div>
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Simulation Controls */
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium">{selectedScenarioData?.name}</h3>
                <Badge className={`text-xs ${getDifficultyColor(selectedScenarioData?.difficulty || 'easy')}`}>
                  {selectedScenarioData?.difficulty}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round(simulationProgress)}% Complete
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <Progress value={simulationProgress} className="h-2" />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isLoading}
                  className={isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentTime(Math.max(0, currentTime - 30))}>
                  <Rewind className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentTime(currentTime + 30)}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Speed:</span>
                <div className="w-20">
                  <Slider
                    value={simulationSpeed}
                    onValueChange={setSimulationSpeed}
                    max={120}
                    min={10}
                    step={10}
                    className="h-2"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{simulationSpeed[0]}x</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto pb-20">
        {isLoading ? (
          /* Loading State */
          <div className="p-4 flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <h3 className="text-sm font-medium mb-2">Initializing Simulation</h3>
              <p className="text-xs text-muted-foreground">Setting up scenario parameters...</p>
            </div>
          </div>
        ) : !selectedScenario ? (
          /* Scenario Selection Help */
          <div className="p-4">
            <Card className="border border-border bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <operationConfig.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-2">Welcome to {operationConfig.name} Simulator</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Practice real-world scenarios using your imported operational data. Each scenario uses
                      your actual performance metrics to provide realistic simulations and improve decision-making skills.
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium">Simulation Features:</h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Real data-driven scenarios</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Live performance monitoring</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Dynamic event generation</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="text-xs font-medium mb-1">Difficulty Levels:</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-green-100 text-green-700 text-xs">Easy: Basic operations</Badge>
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">Medium: Complex challenges</Badge>
                          <Badge className="bg-red-100 text-red-700 text-xs">Hard: Crisis management</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Data Source Indicator */}
            <div className="px-4 pt-2 pb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Real Data Source
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Using imported {operationType} data
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Metrics */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const trendColor = metric.trend === 'up' ? 'text-green-600' : 
                                   metric.trend === 'down' ? 'text-red-600' : 'text-gray-600';
                return (
                  <Card key={metric.title} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`h-5 w-5 ${metric.color}`} />
                        <Badge className={`text-xs ${
                          metric.trend === 'up' ? 'bg-green-100 text-green-700' : 
                          metric.trend === 'down' ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {metric.change}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">{metric.value}</h3>
                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                        {metric.target && (
                          <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Scenario Objectives */}
            {selectedScenarioData && (
              <div className="px-4 pb-4">
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Scenario Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedScenarioData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-foreground">{objective}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Live Performance Chart */}
            <div className="px-4 pb-4">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-32 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-full h-16 bg-gradient-to-r from-blue-200 via-teal-200 to-blue-200 rounded opacity-50 mb-2 animate-pulse"></div>
                    <p className="text-xs text-muted-foreground">Live performance visualization</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Log */}
            <div className="px-4 pb-4">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Live Event Feed
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {events.length} events
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-48">
                    <div className="space-y-2 p-4">
                      {events.length === 0 ? (
                        <div className="text-center py-6">
                          <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Waiting for events...</p>
                        </div>
                      ) : (
                        events.map((event) => (
                          <div 
                            key={event.id} 
                            className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
                              event.type === 'delay' ? 'bg-orange-50 border-l-orange-400' :
                              event.type === 'alert' ? 'bg-red-50 border-l-red-400' :
                              event.type === 'critical' ? 'bg-red-100 border-l-red-600' :
                              event.type === 'success' ? 'bg-green-50 border-l-green-400' :
                              'bg-blue-50 border-l-blue-400'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full mt-1 ${
                              event.severity === 'critical' ? 'bg-red-600' :
                              event.severity === 'high' ? 'bg-red-500' :
                              event.severity === 'medium' ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">{event.time}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    event.type === 'delay' ? 'border-orange-200 text-orange-700' :
                                    event.type === 'alert' ? 'border-red-200 text-red-700' :
                                    event.type === 'critical' ? 'border-red-300 text-red-800' :
                                    event.type === 'success' ? 'border-green-200 text-green-700' :
                                    'border-blue-200 text-blue-700'
                                  }`}
                                >
                                  {event.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground">{event.message}</p>
                              {event.impact && (
                                <p className="text-xs text-muted-foreground mt-1">{event.impact}</p>
                              )}
                              {event.action && (
                                <Button size="sm" variant="outline" className="mt-2 h-6 text-xs">
                                  {event.action}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}