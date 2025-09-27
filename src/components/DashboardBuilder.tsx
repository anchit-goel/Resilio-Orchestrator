import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { useDataContext, DatasetColumn } from './DataContext';
import { ImportModal } from './ImportModal';
import { useDataService } from './DataService';
import { toast } from 'sonner';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  ArrowLeft,
  Plus,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Layout,
  Layers,
  Hash,
  Calendar,
  Database,
  TrendingUp,
  Trash2,
  Eye,
  EyeOff,
  AreaChart as AreaChartIcon,
  Gauge,
  Save,
  X,
  Upload,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sparkles,
  FileText,
  Settings,
  Play
} from 'lucide-react';
import { AppPage } from '../App';
import { OperationType } from './LoginPage';

interface DashboardBuilderProps {
  onNavigate: (page: AppPage) => void;
  operationType?: OperationType;
}

interface ChartField {
  id: string;
  name: string;
  type: 'dimension' | 'measure' | 'date' | 'string' | 'number';
  datasetId: string;
  column: DatasetColumn;
}

interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'gauge' | 'kpi';
  datasetId: string;
  xAxis: ChartField[];
  yAxis: ChartField[];
  color: ChartField[];
  filters: ChartField[];
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
  config?: {
    showLegend?: boolean;
    showGrid?: boolean;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
    colors?: string[];
  };
}

type BuilderStep = 'dataset' | 'chart-type' | 'fields' | 'preview';

const CHART_TYPES = [
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare categories', color: 'bg-blue-500' },
  { id: 'line', name: 'Line Chart', icon: LineChartIcon, description: 'Show trends over time', color: 'bg-green-500' },
  { id: 'pie', name: 'Pie Chart', icon: PieChartIcon, description: 'Show proportions', color: 'bg-orange-500' },
  { id: 'area', name: 'Area Chart', icon: AreaChartIcon, description: 'Stacked values over time', color: 'bg-purple-500' },
  { id: 'gauge', name: 'Gauge', icon: Gauge, description: 'Show single value progress', color: 'bg-cyan-500' },
  { id: 'kpi', name: 'KPI Card', icon: Layout, description: 'Key performance indicator', color: 'bg-teal-500' },
];

// Step Progress Component
function StepProgress({ currentStep, steps }: { currentStep: BuilderStep; steps: { id: BuilderStep; name: string; completed: boolean }[] }) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.completed;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              isActive ? 'bg-primary text-primary-foreground shadow-lg' :
              isCompleted ? 'bg-green-500 text-white' :
              'bg-muted text-muted-foreground'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Modern Field Selector Component
function ModernFieldSelector({ 
  title, 
  description, 
  fields, 
  availableFields,
  onFieldAdd, 
  onFieldRemove, 
  acceptedTypes = [],
  allowMultiple = true,
  icon: Icon
}: { 
  title: string; 
  description: string; 
  fields: ChartField[]; 
  availableFields: ChartField[];
  onFieldAdd: (field: ChartField) => void; 
  onFieldRemove: (fieldId: string) => void;
  acceptedTypes?: string[];
  allowMultiple?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const filteredFields = availableFields.filter(field => 
    acceptedTypes.length === 0 || acceptedTypes.includes(field.type)
  ).filter(field => 
    !fields.find(f => f.id === field.id)
  );

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'date': return Calendar;
      case 'number': return Hash;
      case 'measure': return TrendingUp;
      case 'dimension': return Layers;
      default: return Database;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Fields */}
        {fields.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Selected Fields</Label>
            <div className="space-y-2">
              {fields.map((field) => {
                const FieldIcon = getFieldIcon(field.type);
                return (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <FieldIcon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{field.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {field.type}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onFieldRemove(field.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Field Dropdown */}
        {(allowMultiple || fields.length === 0) && filteredFields.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Add Field</Label>
            <Select onValueChange={(fieldId) => {
              const field = availableFields.find(f => f.id === fieldId);
              if (field) onFieldAdd(field);
            }}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${title.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {filteredFields.map((field) => {
                  const FieldIcon = getFieldIcon(field.type);
                  return (
                    <SelectItem key={field.id} value={field.id}>
                      <div className="flex items-center space-x-2">
                        <FieldIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{field.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {field.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Empty State */}
        {fields.length === 0 && filteredFields.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No compatible fields available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Enhanced Chart Preview Component with Real Charts
const ChartPreview = React.memo(function ChartPreview({ chart, dataFields }: { chart: ChartConfig; dataFields: ChartField[] }) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Chart configuration received

  const generateMockData = useCallback(() => {
    if (!chart.xAxis.length || !chart.yAxis.length) return [];
    
    const data = [];
    const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const colors = ['Primary', 'Secondary', 'Tertiary'];
    
    for (let i = 0; i < categories.length; i++) {
      const item: any = {};
      
      // X-axis data
      if (chart.xAxis[0]) {
        item[chart.xAxis[0].name] = categories[i];
      }
      
      // Y-axis data
      if (chart.yAxis[0]) {
        item[chart.yAxis[0].name] = Math.floor(Math.random() * 100) + 20;
      }
      
      // Additional Y-axis for scatter plots
      if (chart.yAxis[1]) {
        item[chart.yAxis[1].name] = Math.floor(Math.random() * 80) + 10;
      }
      
      // Color grouping
      if (chart.color.length > 0) {
        item[chart.color[0].name] = colors[i % colors.length];
      }
      
      data.push(item);
    }
    
    return data;
  }, [chart]);

  useEffect(() => {
    if (chart.xAxis.length > 0 || chart.yAxis.length > 0) {
      setIsLoading(true);
      // Simulate data loading
      setTimeout(() => {
        setChartData(generateMockData());
        setIsLoading(false);
      }, 300);
    }
  }, [chart.type, chart.xAxis, chart.yAxis, generateMockData]);

  const chartType = CHART_TYPES.find(t => t.id === chart.type);
  const colors = ['#0891b2', '#0ea5e9', '#06b6d4', '#059669', '#0d9488'];

  if (!chart.xAxis.length && !chart.yAxis.length) {
    return (
      <Card className="h-96">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Ready to Create</h3>
            <p className="text-sm text-muted-foreground">
              Configure your fields to see a live preview of your chart
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!chartData.length) return null;

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    // Rendering chart with data
    
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={chart.xAxis[0]?.name} 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px' 
                }}
              />
              {chart.config?.showLegend && <Legend />}
              <Bar 
                dataKey={chart.yAxis[0]?.name} 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={chart.xAxis[0]?.name} 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px' 
                }}
              />
              {chart.config?.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey={chart.yAxis[0]?.name} 
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={chart.xAxis[0]?.name} 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px' 
                }}
              />
              {chart.config?.showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey={chart.yAxis[0]?.name} 
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // Transform data for pie chart with proper naming
        const pieData = chartData.map((item, index) => ({
          name: item[chart.xAxis[0]?.name] || `Segment ${index + 1}`,
          value: item[chart.yAxis[0]?.name] || 0
        }));
        
        console.log('🥧 Pie chart data:', pieData);
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'kpi':
        const kpiValue = chartData.reduce((sum, item) => sum + (item[chart.yAxis[0]?.name] || 0), 0);
        return (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {kpiValue.toLocaleString()}
              </div>
              <div className="text-lg text-muted-foreground">
                {chart.yAxis[0]?.name}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Total across {chartData.length} periods
              </div>
            </div>
          </div>
        );

      case 'gauge':
        const gaugeValue = chartData[chartData.length - 1]?.[chart.yAxis[0]?.name] || 0;
        const maxValue = 100;  // Could be configurable
        const percentage = (gaugeValue / maxValue) * 100;
        
        return (
          <div className="h-64 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-muted relative">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-primary"
                  style={{
                    clipPath: `conic-gradient(from 0deg, transparent ${100 - percentage}%, currentColor ${100 - percentage}%)`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{gaugeValue}</div>
                    <div className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-sm font-medium">{chart.yAxis[0]?.name}</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart type not supported yet
          </div>
        );
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${chartType?.color} rounded-lg`}>
              {React.createElement(chartType?.icon || BarChart3, { 
                className: "h-5 w-5 text-white" 
              })}
            </div>
            <div>
              <CardTitle className="text-base">{chart.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{chartType?.name}</p>
              <Badge variant="outline" className="text-xs mt-1">
                Type: {chart.type}
              </Badge>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {chartData.length} data points
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
        
        {/* Chart Configuration Options */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={chart.config?.showLegend} 
                  onCheckedChange={(checked) => {
                    // Will be implemented in chart update handler
                  }}
                />
                <span className="text-muted-foreground">Legend</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={chart.config?.showGrid} 
                  onCheckedChange={(checked) => {
                    // Will be implemented in chart update handler
                  }}
                />
                <span className="text-muted-foreground">Grid</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Fields: {chart.xAxis.length + chart.yAxis.length + chart.color.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function DashboardBuilder({ onNavigate, operationType = 'terminal' }: DashboardBuilderProps) {
  const { datasets, getDatasetsByOperation } = useDataContext();
  const { getChartData, hasRealData } = useDataService();
  const [currentStep, setCurrentStep] = useState<BuilderStep>('dataset');
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [selectedChartType, setSelectedChartType] = useState<ChartConfig['type']>('bar');
  const [currentChart, setCurrentChart] = useState<ChartConfig | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [charts, setCharts] = useState<ChartConfig[]>([]);

  // Load existing dashboard on mount
  useEffect(() => {
    try {
      const savedDashboard = localStorage.getItem('rto_dashboard');
      if (savedDashboard) {
        const dashboard = JSON.parse(savedDashboard);
        if (dashboard.charts && dashboard.operationType === operationType) {
          setCharts(dashboard.charts);
          console.log(`📊 Loaded ${dashboard.charts.length} existing charts for ${operationType}`);
        }
      }
    } catch (error) {
      console.error('Failed to load existing dashboard:', error);
    }
  }, [operationType]);

  // Get available datasets for the current operation
  const availableDatasets = getDatasetsByOperation(operationType);
  
  // Monitor dataset changes for the current operation type
  React.useEffect(() => {
    // Datasets updated for operation type
  }, [datasets, availableDatasets, operationType]);

  // Create fields from selected dataset
  const availableFields: ChartField[] = React.useMemo(() => {
    if (!selectedDataset) return [];
    
    const dataset = datasets.find(d => d.id === selectedDataset);
    if (!dataset) return [];

    return dataset.columns.map(column => ({
      id: `${dataset.id}_${column.name}`,
      name: column.name,
      type: column.type === 'number' ? 'measure' : 
            column.type === 'date' ? 'date' : 'dimension',
      datasetId: dataset.id,
      column
    }));
  }, [selectedDataset, datasets]);

  // Steps configuration
  const steps = [
    { id: 'dataset' as BuilderStep, name: 'Select Data', completed: !!selectedDataset },
    { id: 'chart-type' as BuilderStep, name: 'Choose Chart', completed: !!selectedChartType },
    { id: 'fields' as BuilderStep, name: 'Configure Fields', completed: !!currentChart && currentChart.xAxis.length > 0 && currentChart.yAxis.length > 0 },
    { id: 'preview' as BuilderStep, name: 'Preview & Save', completed: false },
  ];

  // Initialize chart when dataset and type are selected
  useEffect(() => {
    if (selectedDataset && selectedChartType) {
      console.log('🎯 Creating/updating chart with type:', selectedChartType);
      const newChart: ChartConfig = {
        id: currentChart?.id || Date.now().toString(),
        title: `New ${CHART_TYPES.find(t => t.id === selectedChartType)?.name || 'Chart'}`,
        type: selectedChartType,
        datasetId: selectedDataset,
        xAxis: currentChart?.xAxis || [],
        yAxis: currentChart?.yAxis || [],
        color: currentChart?.color || [],
        filters: currentChart?.filters || [],
        position: currentChart?.position || { x: 0, y: 0, w: 4, h: 3 },
        visible: currentChart?.visible || true,
        config: currentChart?.config || {
          showLegend: true,
          showGrid: true,
          aggregation: 'sum'
        }
      };
      
      console.log('📊 Chart created/updated:', newChart);
      setCurrentChart(newChart);
    }
  }, [selectedDataset, selectedChartType]); // Removed currentChart from dependencies

  const handleSaveChart = useCallback(() => {
    if (!currentChart) return;
    
    // Validation
    if (!currentChart.title.trim()) {
      toast.error('Please enter a chart title');
      return;
    }
    
    if (currentChart.xAxis.length === 0 && currentChart.type !== 'kpi') {
      toast.error('Please select at least one X-axis field');
      return;
    }
    
    if (currentChart.yAxis.length === 0) {
      toast.error('Please select at least one Y-axis field');
      return;
    }
    
    // Save chart with updated timestamp
    const savedChart = {
      ...currentChart,
      id: `chart_${Date.now()}`,
      createdAt: new Date(),
      position: {
        x: charts.length % 3,
        y: Math.floor(charts.length / 3),
        w: 4,
        h: 3
      }
    };
    
    setCharts(prev => {
      const newCharts = [...prev, savedChart];
      
      // Auto-save dashboard whenever charts change
      const dashboardData = {
        id: `dashboard_${Date.now()}`,
        name: `${operationType} Dashboard`,
        operationType: operationType,
        charts: newCharts,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      localStorage.setItem('rto_dashboard', JSON.stringify(dashboardData));
      console.log(`💾 Auto-saved dashboard with ${newCharts.length} charts`);
      
      return newCharts;
    });
    
    toast.success(`"${currentChart.title}" added to dashboard!`);
    
    // Reset for next chart
    setCurrentChart(null);
    setCurrentStep('chart-type');
  }, [currentChart, charts.length]);

  const handleUpdateChart = useCallback((updates: Partial<ChartConfig>) => {
    if (currentChart) {
      setCurrentChart(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentChart]);

  const handleDeleteChart = useCallback((chartId: string) => {
    setCharts(prev => {
      const newCharts = prev.filter(c => c.id !== chartId);
      
      // Auto-save after deletion
      const dashboardData = {
        id: `dashboard_${Date.now()}`,
        name: `${operationType} Dashboard`,
        operationType: operationType,
        charts: newCharts,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      localStorage.setItem('rto_dashboard', JSON.stringify(dashboardData));
      console.log(`💾 Auto-saved dashboard after deletion, ${newCharts.length} charts remaining`);
      
      return newCharts;
    });
    
    toast.info('Chart removed from dashboard');
  }, [operationType]);

  const handleDuplicateChart = useCallback((chart: ChartConfig) => {
    const duplicatedChart = {
      ...chart,
      id: `chart_${Date.now()}`,
      title: `${chart.title} (Copy)`,
      createdAt: new Date(),
      position: {
        x: charts.length % 3,
        y: Math.floor(charts.length / 3),
        w: 4,
        h: 3
      }
    };
    
    setCharts(prev => {
      const newCharts = [...prev, duplicatedChart];
      
      // Auto-save after duplication
      const dashboardData = {
        id: `dashboard_${Date.now()}`,
        name: `${operationType} Dashboard`,
        operationType: operationType,
        charts: newCharts,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      localStorage.setItem('rto_dashboard', JSON.stringify(dashboardData));
      console.log(`💾 Auto-saved dashboard after duplication, ${newCharts.length} charts total`);
      
      return newCharts;
    });
    
    toast.success('Chart duplicated successfully');
  }, [charts.length, operationType]);

  const handleSaveDashboard = useCallback(() => {
    if (charts.length === 0) {
      toast.error('Please create at least one chart before saving');
      return;
    }
    
    // In a real app, this would save to backend
    const dashboardData = {
      id: `dashboard_${Date.now()}`,
      name: `${operationType} Dashboard`,
      operationType: operationType,
      charts,
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    // Save to localStorage for demo
    localStorage.setItem('rto_dashboard', JSON.stringify(dashboardData));
    
    toast.success(`Dashboard saved with ${charts.length} charts`);
  }, [charts, operationType]);

  const handleNextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'dataset': return !!selectedDataset;
      case 'chart-type': return !!selectedChartType;
      case 'fields': return !!currentChart && currentChart.xAxis.length > 0 && currentChart.yAxis.length > 0;
      case 'preview': return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('home')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Control Center
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="text-xs">
                {charts.length} charts created
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveDashboard}
                disabled={charts.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Dashboard
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">Dashboard Builder</h1>
            <p className="text-muted-foreground">
              Create powerful visualizations for your {operationType} operations
            </p>
          </div>

          <StepProgress currentStep={currentStep} steps={steps} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Step Content */}
          {currentStep === 'dataset' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Database className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Select Your Dataset</h2>
                <p className="text-muted-foreground">
                  Choose the data source for your visualization
                </p>
              </div>

              {availableDatasets.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Datasets Available</h3>
                    <p className="text-muted-foreground mb-6">
                      Import your first dataset to start building dashboards
                    </p>
                    <Button onClick={() => setShowImportModal(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Dataset
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableDatasets.map((dataset) => (
                    <Card 
                      key={dataset.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedDataset === dataset.id ? 'ring-2 ring-primary shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedDataset(dataset.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{dataset.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {dataset.uploadDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {selectedDataset === dataset.id && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-semibold">{dataset.rowCount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Rows</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-semibold">{dataset.columnCount}</div>
                            <div className="text-xs text-muted-foreground">Columns</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {dataset.summary.dataQuality}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {dataset.summary.completeness}% complete
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add Dataset Card */}
                  <Card 
                    className="cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    onClick={() => setShowImportModal(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">Import New Dataset</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Add more data sources to create richer visualizations
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {currentStep === 'chart-type' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Choose Chart Type</h2>
                <p className="text-muted-foreground">
                  Select the best visualization for your data
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CHART_TYPES.map((chartType) => {
                  const Icon = chartType.icon;
                  const isSelected = selectedChartType === chartType.id;
                  
                  return (
                    <Card 
                      key={chartType.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:scale-102'
                      }`}
                      onClick={() => {
                        console.log('🎯 Chart type selected:', chartType.id, chartType.name);
                        setSelectedChartType(chartType.id as ChartConfig['type']);
                        toast.success(`${chartType.name} selected`);
                        // Auto-advance to next step after a short delay to show selection
                        setTimeout(() => {
                          if (selectedDataset) {
                            setCurrentStep('fields');
                          }
                        }, 500);
                      }}
                    >
                      <CardContent className="text-center py-8 relative">
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div className={`w-16 h-16 mx-auto mb-4 ${chartType.color} rounded-xl flex items-center justify-center transition-transform ${
                          isSelected ? 'scale-110' : ''
                        }`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{chartType.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {chartType.description}
                        </p>
                        
                        {/* Chart specific requirements */}
                        <div className="text-xs text-muted-foreground space-y-1">
                          {chartType.id === 'bar' && (
                            <>
                              <div>📊 Requires: Category + Value</div>
                              <div>✨ Best for: Comparisons</div>
                            </>
                          )}
                          {chartType.id === 'line' && (
                            <>
                              <div>📈 Requires: Time/Date + Value</div>
                              <div>✨ Best for: Trends</div>
                            </>
                          )}
                          {chartType.id === 'pie' && (
                            <>
                              <div>🥧 Requires: Category + Value</div>
                              <div>✨ Best for: Proportions</div>
                            </>
                          )}
                          {chartType.id === 'area' && (
                            <>
                              <div>📊 Requires: Time + Value</div>
                              <div>✨ Best for: Volume over time</div>
                            </>
                          )}
                          {chartType.id === 'kpi' && (
                            <>
                              <div>🎯 Requires: Single Value</div>
                              <div>✨ Best for: Key metrics</div>
                            </>
                          )}
                          {chartType.id === 'gauge' && (
                            <>
                              <div>⏱️ Requires: Single Value</div>
                              <div>✨ Best for: Progress tracking</div>
                            </>
                          )}
                        </div>
                        
                        {isSelected && (
                          <Badge variant="default" className="text-xs mt-3">
                            ✓ Selected
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Chart Type Help */}
              {selectedChartType && (
                <Card className="mt-6 bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${CHART_TYPES.find(t => t.id === selectedChartType)?.color} rounded-lg`}>
                        {React.createElement(CHART_TYPES.find(t => t.id === selectedChartType)?.icon || BarChart3, { 
                          className: "h-5 w-5 text-white" 
                        })}
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {CHART_TYPES.find(t => t.id === selectedChartType)?.name} Selected
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Ready to configure fields for your {CHART_TYPES.find(t => t.id === selectedChartType)?.name.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {currentStep === 'fields' && currentChart && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Configure Fields</h2>
                <p className="text-muted-foreground">
                  Map your data fields to chart elements
                </p>
              </div>

              <div className="mb-6">
                <Label htmlFor="chart-title">Chart Title</Label>
                <Input
                  id="chart-title"
                  value={currentChart.title}
                  onChange={(e) => setCurrentChart(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Enter chart title..."
                  className="mt-2"
                />
              </div>

              {/* Field Configuration Tips */}
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-blue-500 rounded">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">
                        Configuration Tips for {CHART_TYPES.find(t => t.id === currentChart.type)?.name}
                      </h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        {currentChart.type === 'bar' && (
                          <>
                            <div>• Use categories (like departments, regions) for X-axis</div>
                            <div>• Use numeric values (like sales, count) for Y-axis</div>
                            <div>• Add color grouping to compare multiple series</div>
                          </>
                        )}
                        {currentChart.type === 'line' && (
                          <>
                            <div>• Use dates or time periods for X-axis</div>
                            <div>• Use numeric values for Y-axis to show trends</div>
                            <div>• Color grouping shows multiple trend lines</div>
                          </>
                        )}
                        {currentChart.type === 'pie' && (
                          <>
                            <div>• Categories become pie slices</div>
                            <div>• Numeric values determine slice sizes</div>
                            <div>• Best with 3-7 categories for readability</div>
                          </>
                        )}
                        {currentChart.type === 'kpi' && (
                          <>
                            <div>• Select one key numeric metric to highlight</div>
                            <div>• Perfect for showing totals, averages, or targets</div>
                            <div>• No X-axis needed for KPI cards</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentChart.type !== 'kpi' && currentChart.type !== 'gauge' && (
                  <ModernFieldSelector
                    title="X-Axis"
                    description={
                      currentChart.type === 'line' || currentChart.type === 'area' 
                        ? "Time periods or sequential data" 
                        : "Categories or dimensions"
                    }
                    fields={currentChart.xAxis}
                    availableFields={availableFields}
                    onFieldAdd={(field) => {
                      handleUpdateChart({ xAxis: [...currentChart.xAxis, field] });
                      toast.success(`Added ${field.name} to X-axis`);
                    }}
                    onFieldRemove={(fieldId) => {
                      const field = currentChart.xAxis.find(f => f.id === fieldId);
                      handleUpdateChart({ xAxis: currentChart.xAxis.filter(f => f.id !== fieldId) });
                      if (field) toast.info(`Removed ${field.name} from X-axis`);
                    }}
                    acceptedTypes={['dimension', 'date']}
                    allowMultiple={false}
                    icon={Layers}
                  />
                )}

                <ModernFieldSelector
                  title={currentChart.type === 'kpi' || currentChart.type === 'gauge' ? 'Value' : 'Y-Axis'}
                  description={
                    currentChart.type === 'kpi' 
                      ? "Key metric to display prominently" 
                      : "Measures or numeric values"
                  }
                  fields={currentChart.yAxis}
                  availableFields={availableFields}
                  onFieldAdd={(field) => {
                    handleUpdateChart({ yAxis: [...currentChart.yAxis, field] });
                    toast.success(`Added ${field.name} to ${currentChart.type === 'kpi' ? 'value' : 'Y-axis'}`);
                  }}
                  onFieldRemove={(fieldId) => {
                    const field = currentChart.yAxis.find(f => f.id === fieldId);
                    handleUpdateChart({ yAxis: currentChart.yAxis.filter(f => f.id !== fieldId) });
                    if (field) toast.info(`Removed ${field.name}`);
                  }}
                  acceptedTypes={['measure', 'number']}
                  allowMultiple={false}
                  icon={TrendingUp}
                />

                {currentChart.type !== 'kpi' && currentChart.type !== 'gauge' && (
                  <ModernFieldSelector
                    title="Color By"
                    description="Group by color (optional)"
                    fields={currentChart.color}
                    availableFields={availableFields}
                    onFieldAdd={(field) => {
                      handleUpdateChart({ color: [...currentChart.color, field] });
                      toast.success(`Added ${field.name} for color grouping`);
                    }}
                    onFieldRemove={(fieldId) => {
                      const field = currentChart.color.find(f => f.id === fieldId);
                      handleUpdateChart({ color: currentChart.color.filter(f => f.id !== fieldId) });
                      if (field) toast.info(`Removed ${field.name} from color grouping`);
                    }}
                    acceptedTypes={['dimension']}
                    allowMultiple={false}
                    icon={Layout}
                  />
                )}

                {/* Chart Options */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Chart Options</CardTitle>
                        <p className="text-sm text-muted-foreground">Customize appearance</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Legend</Label>
                      <Switch 
                        checked={currentChart.config?.showLegend} 
                        onCheckedChange={(checked) => {
                          handleUpdateChart({ 
                            config: { ...currentChart.config, showLegend: checked }
                          });
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Grid</Label>
                      <Switch 
                        checked={currentChart.config?.showGrid} 
                        onCheckedChange={(checked) => {
                          handleUpdateChart({ 
                            config: { ...currentChart.config, showGrid: checked }
                          });
                        }}
                      />
                    </div>

                    {currentChart.yAxis.length > 0 && (
                      <div>
                        <Label className="text-sm">Aggregation</Label>
                        <Select 
                          value={currentChart.config?.aggregation || 'sum'} 
                          onValueChange={(value: 'sum' | 'avg' | 'count' | 'min' | 'max') => {
                            handleUpdateChart({ 
                              config: { ...currentChart.config, aggregation: value }
                            });
                          }}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sum">Sum</SelectItem>
                            <SelectItem value="avg">Average</SelectItem>
                            <SelectItem value="count">Count</SelectItem>
                            <SelectItem value="min">Minimum</SelectItem>
                            <SelectItem value="max">Maximum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Field Validation Messages */}
              <div className="mt-6">
                {currentChart.type !== 'kpi' && currentChart.type !== 'gauge' && currentChart.xAxis.length === 0 && (
                  <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <Circle className="h-4 w-4" />
                    <span className="text-sm">Please select an X-axis field to continue</span>
                  </div>
                )}
                
                {currentChart.yAxis.length === 0 && (
                  <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg mt-2">
                    <Circle className="h-4 w-4" />
                    <span className="text-sm">Please select a {currentChart.type === 'kpi' ? 'value' : 'Y-axis'} field to continue</span>
                  </div>
                )}

                {((currentChart.type !== 'kpi' && currentChart.type !== 'gauge' && currentChart.xAxis.length > 0) || 
                  ((currentChart.type === 'kpi' || currentChart.type === 'gauge') && currentChart.yAxis.length > 0)) && 
                  currentChart.yAxis.length > 0 && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg mt-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Chart configuration is complete! Ready to preview.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 'preview' && currentChart && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Preview & Save</h2>
                <p className="text-muted-foreground">
                  Review your chart before adding it to the dashboard
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <ChartPreview 
                  key={`${currentChart.id}-${currentChart.type}`}
                  chart={currentChart} 
                  dataFields={availableFields} 
                />
                
                <div className="mt-6 text-center">
                  <Button onClick={handleSaveChart} size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 'dataset'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-4">
              {currentStep === 'preview' ? (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentStep('chart-type');
                      toast.info('Create another chart');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Another Chart
                  </Button>
                  <Button 
                    onClick={() => {
                      onNavigate('home');
                      toast.success('Returned to Control Center');
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  className={canProceed() ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  {currentStep === 'dataset' && 'Choose Chart Type'}
                  {currentStep === 'chart-type' && 'Configure Fields'}
                  {currentStep === 'fields' && 'Preview Chart'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Created Charts Summary */}
          {charts.length > 0 && (
            <div className="mt-12 pt-6 border-t">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Dashboard Preview ({charts.length} charts)</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your created charts and finalize your dashboard
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSaveDashboard}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCharts([]);
                      toast.info('All charts cleared');
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {charts.map((chart, index) => {
                  const chartType = CHART_TYPES.find(t => t.id === chart.type);
                  return (
                    <Card key={chart.id} className="hover:shadow-md transition-shadow group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 ${chartType?.color} rounded-lg`}>
                              {React.createElement(chartType?.icon || BarChart3, { 
                                className: "h-4 w-4 text-white" 
                              })}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{chart.title}</p>
                              <p className="text-xs text-muted-foreground">{chartType?.name}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground mb-3">
                          <div className="flex items-center justify-between">
                            <span>Fields: {chart.xAxis.length + chart.yAxis.length + chart.color.length}</span>
                            <span>Dataset: {availableDatasets.find(d => d.id === chart.datasetId)?.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicateChart(chart)}
                            className="h-7 px-2 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              // Edit chart functionality
                              setCurrentChart(chart);
                              setSelectedChartType(chart.type);
                              setCurrentStep('fields');
                              toast.info(`Editing "${chart.title}"`);
                            }}
                            className="h-7 px-2 text-xs"
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteChart(chart.id)}
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {/* Add More Charts Card */}
                <Card 
                  className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                  onClick={() => {
                    setCurrentStep('chart-type');
                    toast.info('Create a new chart');
                  }}
                >
                  <CardContent className="p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Add Another Chart</p>
                      <p className="text-xs text-muted-foreground">
                        Keep building your dashboard
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dashboard Actions */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ready to deploy?</h4>
                    <p className="text-sm text-muted-foreground">
                      Your dashboard has {charts.length} charts and is ready to be saved
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Preview functionality
                        toast.info('Dashboard preview coming soon');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={handleSaveDashboard}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        operationType={operationType}
      />
    </div>
  );
}