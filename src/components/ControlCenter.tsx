import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useActivityMonitor } from './ActivityMonitor';
import { useDataService } from '../hooks/useDataService';
import { 
  Users, 
  Truck, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw,
  BarChart3,
  Brain,
  FileText,
  ChevronRight,
  Target,
  Activity,
  TrendingUp,
  Shield,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { AppPage } from '../App';

interface ControlCenterProps {
  onNavigate: (page: AppPage) => void;
}

export function ControlCenter({ onNavigate }: ControlCenterProps) {
  const { logActivity } = useActivityMonitor();
  const { getKPIValues, hasRealData } = useDataService();
  const [simulationStatus, setSimulationStatus] = React.useState<'running' | 'paused' | 'stopped'>('running');
  const [simulationProgress, setSimulationProgress] = React.useState(67);
  
  // Get real KPI values - for Control Center, we'll use 'terminal' as default
  const kpiData = React.useMemo(() => getKPIValues('terminal'), [getKPIValues]);
  const hasData = React.useMemo(() => hasRealData('terminal'), [hasRealData]);

  // Log dashboard loading activity
  useEffect(() => {
    logActivity(
      'Dashboard Load',
      'Control Center',
      'User accessed Control Center dashboard with real-time metrics',
      {
        analyzed: ['Terminal status', 'Performance metrics', 'User personas', 'System health'],
        predictions: ['Peak efficiency at 2PM today', 'Terminal A throughput +12%', 'Weather impact minimal'],
        insights: ['Dock 3 highest throughput', 'Staff optimization opportunity at Gate 7', 'Equipment utilization at 89%'],
        dataProcessed: 'Real-time terminal metrics, historical performance data, weather conditions'
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // logActivity is memoized in context
  
  const personas = [
    {
      id: 'courier',
      title: 'Courier Hub',
      subtitle: 'Delivery Operations',
      icon: Truck,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      stats: { active: 24, efficiency: '94%' }
    },
    {
      id: 'workforce',
      title: 'Workforce View',
      subtitle: 'Staff Management',
      icon: Users,
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      stats: { active: 18, efficiency: '87%' }
    },
    {
      id: 'energy',
      title: 'Energy View',
      subtitle: 'Power Systems',
      icon: Zap,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      stats: { active: 12, efficiency: '91%' }
    }
  ];

  const quickActions = [
    {
      id: 'customize',
      title: 'Select My Insights',
      subtitle: 'Customize Dashboard Features',
      icon: Target,
      page: 'customize' as AppPage,
      featured: true
    },
    {
      id: 'dashboard',
      title: 'Dashboard Builder',
      subtitle: 'Self-Service Analytics',
      icon: BarChart3,
      page: 'dashboard' as AppPage
    },

    {
      id: 'whatif',
      title: 'What-If Analysis',
      subtitle: 'Scenario Planning',
      icon: Brain,
      page: 'whatif' as AppPage
    },
    {
      id: 'reports',
      title: 'Reports',
      subtitle: 'Export & Share',
      icon: FileText,
      page: 'reports' as AppPage
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5">
      {/* Enhanced Header with Status */}
      <div className="bg-card/80 backdrop-blur-lg border-b border-border px-4 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Control Center
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Terminal operations at a glance • Live monitoring active
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-auto p-4 space-y-8 pb-20">
        {/* Key Metrics Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">Key Metrics</h2>
            {hasData && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-primary/5 to-cyan-50 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-2xl font-semibold text-primary">{kpiData.efficiency}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary/70" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Units</p>
                    <p className="text-2xl font-semibold text-emerald-700">{kpiData.activeUnits}</p>
                  </div>
                  <Activity className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+{Math.floor(kpiData.activeUnits * 0.1)} today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-semibold text-orange-700">{kpiData.uptime}%</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-orange-600">24/7 active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alerts</p>
                    <p className="text-2xl font-semibold text-purple-700">{kpiData.alerts}</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-purple-600">
                    {kpiData.alerts <= 2 ? 'Low priority' : 'Medium priority'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced Persona Selector */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Operational Views
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose your specialized dashboard experience
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {personas.map((persona) => {
              const Icon = persona.icon;
              return (
                <Card 
                  key={persona.id} 
                  className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm group"
                  onClick={() => {
                    logActivity(
                      'View Switch',
                      'Control Center',
                      `User switched to ${persona.title} operational view`,
                      {
                        analyzed: [`${persona.title} metrics`, 'User workflow patterns', 'Operational efficiency'],
                        predictions: [`${persona.title} performance trends`, 'Optimal resource allocation'],
                        insights: [`${persona.title} efficiency at ${persona.stats.efficiency}`, 'Active operations monitored'],
                        dataProcessed: 'Operational metrics, efficiency data, active resource counts'
                      }
                    );
                    onNavigate(persona.id as AppPage);
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-4">
                      <div className={`${persona.color} rounded-2xl p-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-card-foreground text-lg font-medium group-hover:text-primary transition-colors">
                          {persona.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">{persona.subtitle}</p>
                        <div className="flex items-center space-x-3 mt-3">
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            <Activity className="w-3 h-3 mr-1" />
                            {persona.stats.active} Active
                          </Badge>
                          <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {persona.stats.efficiency} Efficiency
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Enhanced Simulation Controls */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Simulation Environment
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Control and monitor terminal simulations
              </p>
            </div>
          </div>
          <Card className="border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-cyan-50 to-primary/5 px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Terminal Simulation</h3>
                  <p className="text-sm text-muted-foreground">Multi-day operational scenario</p>
                </div>
                <Badge className={
                  simulationStatus === 'running' ? 'bg-green-100 text-green-700 border-green-200' :
                  simulationStatus === 'paused' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  'bg-gray-100 text-gray-700 border-gray-200'
                }>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    simulationStatus === 'running' ? 'bg-green-500 animate-pulse' :
                    simulationStatus === 'paused' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  {simulationStatus === 'running' ? 'Running' :
                   simulationStatus === 'paused' ? 'Paused' : 'Stopped'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Button 
                  className={`flex flex-col items-center py-8 px-4 text-white transition-all duration-300 ${
                    simulationStatus === 'running' 
                      ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  }`}
                  disabled={simulationStatus === 'running'}
                  onClick={() => {
                    setSimulationStatus('running');
                    logActivity(
                      'Simulation Control',
                      'Control Center',
                      'User started terminal simulation',
                      {
                        analyzed: ['Terminal state', 'Resource availability', 'Operational readiness'],
                        predictions: ['Simulation completion in 45 minutes', 'Peak efficiency at 2PM'],
                        insights: ['All systems operational', 'Optimal conditions for simulation'],
                        dataProcessed: 'Real-time terminal metrics, simulation parameters'
                      }
                    );
                  }}
                >
                  <div className="bg-white/20 rounded-lg p-2 mb-2">
                    <Play className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Start</span>
                  <span className="text-xs opacity-80">Begin simulation</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center py-8 px-4 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                  disabled={simulationStatus !== 'running'}
                  onClick={() => {
                    setSimulationStatus('paused');
                    logActivity(
                      'Simulation Control',
                      'Control Center',
                      'User paused terminal simulation',
                      {
                        analyzed: ['Current simulation state', 'Progress metrics'],
                        predictions: ['Resume recommended within 10 minutes'],
                        insights: ['Simulation can be safely paused', 'Current progress preserved'],
                        dataProcessed: 'Simulation state data, progress metrics'
                      }
                    );
                  }}
                >
                  <div className="bg-primary/10 text-primary rounded-lg p-2 mb-2">
                    <Pause className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Pause</span>
                  <span className="text-xs text-muted-foreground">Save progress</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center py-8 px-4 border-2 hover:border-destructive hover:bg-destructive/5 transition-all duration-300"
                  onClick={() => {
                    setSimulationStatus('stopped');
                    setSimulationProgress(0);
                    logActivity(
                      'Simulation Control',
                      'Control Center',
                      'User reset terminal simulation',
                      {
                        analyzed: ['Simulation history', 'Reset requirements'],
                        predictions: ['Fresh simulation ready to start'],
                        insights: ['All progress cleared', 'System ready for new simulation'],
                        dataProcessed: 'Simulation reset data, system state'
                      }
                    );
                  }}
                >
                  <div className="bg-destructive/10 text-destructive rounded-lg p-2 mb-2">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Reset</span>
                  <span className="text-xs text-muted-foreground">Clear all data</span>
                </Button>
              </div>
              
              <div className="bg-gradient-to-r from-primary/5 via-cyan-50 to-primary/5 rounded-xl p-5 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Progress Monitor</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{simulationProgress}% complete</span>
                </div>
                <div className="relative bg-white/70 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                      simulationStatus === 'running' ? 'bg-gradient-to-r from-primary via-cyan-500 to-primary' :
                      simulationStatus === 'paused' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${simulationProgress}%` }}
                  >
                    {simulationStatus === 'running' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {simulationStatus === 'stopped' ? 'Ready to start new simulation' :
                     simulationStatus === 'paused' ? 'Simulation paused • Progress saved' :
                     'Day 3 of 5 • 14:32 simulated time'}
                  </p>
                  {simulationStatus === 'running' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Live simulation
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Quick Actions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Powerful tools for terminal management
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const gradients = [
                'bg-gradient-to-br from-primary to-cyan-600',
                'bg-gradient-to-br from-emerald-500 to-teal-600',
                'bg-gradient-to-br from-violet-500 to-purple-600',
                'bg-gradient-to-br from-orange-500 to-red-600'
              ];
              return (
                <Card 
                  key={action.id} 
                  className={`cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm group ${
                    action.featured ? 'ring-2 ring-primary/30 shadow-lg' : ''
                  }`}
                  onClick={() => {
                    logActivity(
                      'Quick Action',
                      'Control Center',
                      `User clicked ${action.title} quick action`,
                      {
                        analyzed: [`${action.title} requirements`, 'User workflow patterns', 'System readiness'],
                        predictions: [`${action.title} completion probability: 94%`, 'Optimal usage time detected'],
                        insights: [`${action.title} most effective for current operations`, 'Recommended next steps identified'],
                        dataProcessed: 'User interaction history, system performance metrics'
                      }
                    );
                    onNavigate(action.page);
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center space-x-4">
                      <div className={`${gradients[index]} rounded-2xl p-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                        <Icon className="h-6 w-6 text-white relative z-10" />
                        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-300"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-card-foreground text-lg font-medium group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          {action.featured && (
                            <Badge variant="outline" className="text-xs border-primary text-primary bg-primary/10 animate-pulse">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{action.subtitle}</p>
                        {action.featured && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Most used
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}