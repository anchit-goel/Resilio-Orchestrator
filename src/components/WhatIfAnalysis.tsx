import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  ArrowLeft,
  Play,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Clock,
  Truck,
  Zap,
  Activity,
  ChevronRight,
  ChevronLeft,
  Database,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { AppPage } from '../App';
import { OperationType } from './LoginPage';

interface WhatIfAnalysisProps {
  onNavigate: (page: AppPage) => void;
  operationType?: OperationType;
}

interface SimulationParameters {
  workforceLevel: number;
  bayAllocation: string;
  truckFrequency: boolean;
  cargoPriority: boolean;
  equipmentCapacity: number;
  processTime: number;
}

interface KPIResult {
  name: string;
  current: number;
  projected: number;
  unit: string;
  impact: 'positive' | 'negative' | 'neutral';
  change: number;
  priority: 'high' | 'medium' | 'low';
}

export function WhatIfAnalysis({ onNavigate, operationType = 'terminal' }: WhatIfAnalysisProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [hasRunSimulation, setHasRunSimulation] = useState(false);

  const [parameters, setParameters] = useState<SimulationParameters>({
    workforceLevel: 100,
    bayAllocation: 'balanced',
    truckFrequency: false,
    cargoPriority: false,
    equipmentCapacity: 100,
    processTime: 100
  });

  // Mock simulation results
  const generateSimulationResults = () => {
    const baseMetrics = {
      throughput: 2847,
      waitingTime: 3.2,
      costEfficiency: 87.5,
      utilization: 78.3,
      errorRate: 2.1,
      energyUsage: 245
    };

    // Calculate impact multipliers based on parameters
    const workforceMultiplier = parameters.workforceLevel / 100;
    const bayMultiplier = parameters.bayAllocation === 'optimized' ? 1.15 : 
                         parameters.bayAllocation === 'priority' ? 1.08 : 1.0;
    const equipmentMultiplier = parameters.equipmentCapacity / 100;
    const processMultiplier = 100 / parameters.processTime;

    const combined = workforceMultiplier * bayMultiplier * equipmentMultiplier * processMultiplier;
    const frequencyBonus = parameters.truckFrequency ? 1.1 : 1.0;
    const priorityBonus = parameters.cargoPriority ? 1.05 : 1.0;

    const finalMultiplier = combined * frequencyBonus * priorityBonus;

    return {
      throughput: Math.round(baseMetrics.throughput * finalMultiplier),
      waitingTime: Math.round((baseMetrics.waitingTime / finalMultiplier) * 10) / 10,
      costEfficiency: Math.min(100, Math.round(baseMetrics.costEfficiency * finalMultiplier * 10) / 10),
      utilization: Math.min(100, Math.round(baseMetrics.utilization * finalMultiplier * 10) / 10),
      errorRate: Math.max(0.1, Math.round((baseMetrics.errorRate / finalMultiplier) * 10) / 10),
      energyUsage: Math.round(baseMetrics.energyUsage / (finalMultiplier * 0.8))
    };
  };

  // Generate KPI comparison data
  const generateKPIResults = (): KPIResult[] => {
    if (!hasRunSimulation) return [];

    const simulationResults = generateSimulationResults();
    const baseMetrics = {
      throughput: 2847,
      waitingTime: 3.2,
      costEfficiency: 87.5,
      utilization: 78.3,
      errorRate: 2.1,
      energyUsage: 245
    };

    return [
      {
        name: 'Throughput',
        current: baseMetrics.throughput,
        projected: simulationResults.throughput,
        unit: 'packages/hour',
        impact: simulationResults.throughput > baseMetrics.throughput ? 'positive' : 'negative',
        change: ((simulationResults.throughput - baseMetrics.throughput) / baseMetrics.throughput) * 100,
        priority: 'high'
      },
      {
        name: 'Waiting Time',
        current: baseMetrics.waitingTime,
        projected: simulationResults.waitingTime,
        unit: 'minutes',
        impact: simulationResults.waitingTime < baseMetrics.waitingTime ? 'positive' : 'negative',
        change: ((simulationResults.waitingTime - baseMetrics.waitingTime) / baseMetrics.waitingTime) * 100,
        priority: 'high'
      },
      {
        name: 'Cost Efficiency',
        current: baseMetrics.costEfficiency,
        projected: simulationResults.costEfficiency,
        unit: '%',
        impact: simulationResults.costEfficiency > baseMetrics.costEfficiency ? 'positive' : 'negative',
        change: ((simulationResults.costEfficiency - baseMetrics.costEfficiency) / baseMetrics.costEfficiency) * 100,
        priority: 'medium'
      },
      {
        name: 'Utilization',
        current: baseMetrics.utilization,
        projected: simulationResults.utilization,
        unit: '%',
        impact: simulationResults.utilization > baseMetrics.utilization ? 'positive' : 'negative',
        change: ((simulationResults.utilization - baseMetrics.utilization) / baseMetrics.utilization) * 100,
        priority: 'medium'
      },
      {
        name: 'Error Rate',
        current: baseMetrics.errorRate,
        projected: simulationResults.errorRate,
        unit: '%',
        impact: simulationResults.errorRate < baseMetrics.errorRate ? 'positive' : 'negative',
        change: ((simulationResults.errorRate - baseMetrics.errorRate) / baseMetrics.errorRate) * 100,
        priority: 'low'
      },
      {
        name: 'Energy Usage',
        current: baseMetrics.energyUsage,
        projected: simulationResults.energyUsage,
        unit: 'kWh',
        impact: simulationResults.energyUsage < baseMetrics.energyUsage ? 'positive' : 'negative',
        change: ((simulationResults.energyUsage - baseMetrics.energyUsage) / baseMetrics.energyUsage) * 100,
        priority: 'low'
      }
    ];
  };

  const runSimulation = async () => {
    setIsSimulationRunning(true);
    setSimulationProgress(0);
    setHasRunSimulation(false);

    // Simulate processing steps
    const steps = ['Analyzing parameters', 'Processing dataset', 'Running models', 'Calculating impact', 'Generating results'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSimulationProgress((i + 1) * 20);
    }

    setHasRunSimulation(true);
    setIsSimulationRunning(false);
    setSimulationProgress(100);
  };

  const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return TrendingUp;
      case 'negative': return TrendingDown;
      default: return Activity;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'minutes') return `${value.toFixed(1)} min`;
    if (unit === 'kWh') return `${value.toFixed(0)} kWh`;
    return `${value.toLocaleString()} ${unit}`;
  };

  const kpiResults = generateKPIResults();

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isDrawerOpen ? 'mr-96' : 'mr-0'}`}>
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
              <div>
                <h1 className="text-foreground">What-If Analysis</h1>
                <p className="text-muted-foreground text-sm">Scenario planning and simulation</p>
              </div>
            </div>
            
            {/* Data Source Indicator */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="text-foreground">Sample Dataset</div>
                  <div className="text-muted-foreground text-xs">2,847 records</div>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">Ready</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-auto p-6">
          {!hasRunSimulation ? (
            <div className="text-center py-12">
              <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl text-foreground mb-2">Ready for Simulation</h2>
              <p className="text-muted-foreground mb-6">
                Configure your parameters in the control panel and run the simulation to see projected results.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPI Comparison Grid */}
              <section>
                <h2 className="text-foreground mb-4">Performance Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kpiResults.map((kpi) => {
                    const ImpactIcon = getImpactIcon(kpi.impact);
                    return (
                      <Card key={kpi.name} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-foreground">{kpi.name}</h3>
                            <Badge 
                              variant={kpi.priority === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {kpi.priority}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Current</span>
                              <span className="text-foreground">
                                {formatValue(kpi.current, kpi.unit)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Projected</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-foreground">
                                  {formatValue(kpi.projected, kpi.unit)}
                                </span>
                                <div className={`flex items-center space-x-1 ${getImpactColor(kpi.impact)}`}>
                                  <ImpactIcon className="h-3 w-3" />
                                  <span className="text-xs">
                                    {Math.abs(kpi.change).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* Chart Placeholder */}
              <section>
                <h2 className="text-foreground mb-4">Performance Comparison</h2>
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-sm">Impact Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-muted rounded"></div>
                            <span className="text-xs text-muted-foreground">Current State</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-primary rounded"></div>
                            <span className="text-xs text-muted-foreground">Projected State</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Interactive visualization showing projected improvements
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel Drawer */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-card border-l border-border z-20 transform transition-transform duration-300 ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Drawer Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute -left-10 top-4 bg-card border border-border rounded-l-lg rounded-r-none px-2 py-2 hover:bg-accent transition-all duration-200`}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          {isDrawerOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="border-b border-border p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-foreground">Simulation Controls</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Adjust parameters to explore different scenarios
            </p>
          </div>

          {/* Parameters */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Workforce Level */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Workforce Level</span>
                </div>
                <Badge variant="secondary">{parameters.workforceLevel}%</Badge>
              </div>
              <Slider
                value={[parameters.workforceLevel]}
                onValueChange={(value) => setParameters(prev => ({ ...prev, workforceLevel: value[0] }))}
                max={150}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50%</span>
                <span>100%</span>
                <span>150%</span>
              </div>
            </div>

            <Separator />

            {/* Bay Allocation */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium">Bay Allocation Strategy</span>
              </div>
              <Select value={parameters.bayAllocation} onValueChange={(value) => setParameters(prev => ({ ...prev, bayAllocation: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Distribution</SelectItem>
                  <SelectItem value="priority">Priority-Based</SelectItem>
                  <SelectItem value="optimized">AI Optimized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Equipment Capacity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Equipment Capacity</span>
                </div>
                <Badge variant="secondary">{parameters.equipmentCapacity}%</Badge>
              </div>
              <Slider
                value={[parameters.equipmentCapacity]}
                onValueChange={(value) => setParameters(prev => ({ ...prev, equipmentCapacity: value[0] }))}
                max={120}
                min={70}
                step={5}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Process Time Optimization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Process Time</span>
                </div>
                <Badge variant="secondary">{parameters.processTime}%</Badge>
              </div>
              <Slider
                value={[parameters.processTime]}
                onValueChange={(value) => setParameters(prev => ({ ...prev, processTime: value[0] }))}
                max={120}
                min={80}
                step={5}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Toggle Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <div>
                    <span className="text-sm font-medium">High Frequency Trucks</span>
                    <p className="text-xs text-muted-foreground">Increase truck arrival rate</p>
                  </div>
                </div>
                <Switch
                  checked={parameters.truckFrequency}
                  onCheckedChange={(checked) => setParameters(prev => ({ ...prev, truckFrequency: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-orange-600" />
                  <div>
                    <span className="text-sm font-medium">Priority Cargo</span>
                    <p className="text-xs text-muted-foreground">Prioritize high-value shipments</p>
                  </div>
                </div>
                <Switch
                  checked={parameters.cargoPriority}
                  onCheckedChange={(checked) => setParameters(prev => ({ ...prev, cargoPriority: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Run Simulation Button */}
          <div className="border-t border-border p-4">
            {isSimulationRunning && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Processing simulation...</span>
                  <span className="text-foreground">{simulationProgress}%</span>
                </div>
                <Progress value={simulationProgress} className="h-2" />
              </div>
            )}
            
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              onClick={runSimulation}
              disabled={isSimulationRunning}
            >
              {isSimulationRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
            
            {hasRunSimulation && (
              <div className="flex items-center justify-center mt-3 text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Simulation completed successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}