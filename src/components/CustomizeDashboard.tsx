import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useDataContext } from './DataContext';
import { useDataService } from './DataService';
import { OperationType } from './LoginPage';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Save,
  RotateCcw,
  Eye,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  Gauge,
  Zap,
  FileText,
  Download,
  Users,
  Play,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Settings,
  Lightbulb,
  Search,
  Filter,
  Layout,
  MessageSquare,
  BarChart2,
  PieChart as PieChartIcon,
  Map,
  Calendar,
  Maximize,
  Minimize,
  Home,
  X,
  Trash2,
  Edit3,
  Star,
  StarOff,
  History,
  Plus,
  FolderOpen,
  Sparkles,
  Layers,
  Palette,
  Monitor,
  Smartphone,
  ArrowUpRight,
  ChevronRight,
  MousePointer,
  ExternalLink,
  Database,
  Upload
} from 'lucide-react';
import { AppPage } from '../App';
import { BarChart, LineChart, PieChart as RechartsPieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Line, Cell, Pie, AreaChart, Area } from 'recharts';

interface CustomizeDashboardProps {
  onNavigate: (page: AppPage) => void;
}

interface DashboardFeature {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'charts' | 'simulator' | 'reports';
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  previewComponent?: React.ReactNode;
  isNew?: boolean;
  isPremium?: boolean;
}

interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

interface SavedDashboard {
  id: string;
  name: string;
  description?: string;
  features: DashboardFeature[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

interface SavedChartPreviewProps {
  chart: any;
  currentOperation: OperationType;
}

// Component to render live saved charts
function SavedChartPreview({ chart, currentOperation }: SavedChartPreviewProps) {
  const { getChartData, hasRealData } = useDataService();
  const colors = ['#0891b2', '#0ea5e9', '#06b6d4', '#059669', '#0d9488'];
  
  // Generate data based on chart configuration and operation
  const generateChartData = () => {
    if (!chart.xAxis?.length && !chart.yAxis?.length) return [];
    
    // Get real data if available, otherwise generate mock data
    if (hasRealData(currentOperation)) {
      const baseData = getChartData(currentOperation, chart.type);
      return baseData.slice(0, 8); // Limit for preview
    } else {
      // Generate mock data based on chart configuration
      const data = [];
      const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      
      for (let i = 0; i < categories.length; i++) {
        const item: any = {};
        
        // X-axis data
        if (chart.xAxis?.[0]) {
          item[chart.xAxis[0].name] = categories[i];
        }
        
        // Y-axis data
        if (chart.yAxis?.[0]) {
          item[chart.yAxis[0].name] = Math.floor(Math.random() * 100) + 20;
        }
        
        // Additional Y-axis
        if (chart.yAxis?.[1]) {
          item[chart.yAxis[1].name] = Math.floor(Math.random() * 80) + 10;
        }
        
        data.push(item);
      }
      
      return data;
    }
  };
  
  const chartData = generateChartData();
  
  const renderLiveChart = () => {
    if (!chartData.length) {
      return (
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No data available</p>
          </div>
        </div>
      );
    }
    
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };
    
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={chart.xAxis?.[0]?.name || 'name'} 
                tick={{ fontSize: 11 }}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey={chart.yAxis?.[0]?.name || 'value'} 
                fill={colors[0]}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={chart.xAxis?.[0]?.name || 'name'} 
                tick={{ fontSize: 11 }}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={chart.yAxis?.[0]?.name || 'value'} 
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        const pieData = chartData.map((item, index) => ({
          name: item[chart.xAxis?.[0]?.name || 'name'] || `Category ${index + 1}`,
          value: item[chart.yAxis?.[0]?.name || 'value'] || 0,
          color: colors[index % colors.length]
        }));
        
        return (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey={chart.xAxis?.[0]?.name || 'name'} 
                tick={{ fontSize: 11 }}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={chart.yAxis?.[0]?.name || 'value'} 
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'kpi':
        const kpiValue = chartData.reduce((sum, item) => sum + (item[chart.yAxis?.[0]?.name || 'value'] || 0), 0);
        return (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {kpiValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {chart.yAxis?.[0]?.name || 'Total Value'}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Across {chartData.length} periods
              </div>
            </div>
          </div>
        );
        
      case 'gauge':
        const gaugeValue = chartData[chartData.length - 1]?.[chart.yAxis?.[0]?.name || 'value'] || 0;
        const maxValue = Math.max(...chartData.map(d => d[chart.yAxis?.[0]?.name || 'value'] || 0)) * 1.2;
        const percentage = (gaugeValue / maxValue) * 100;
        
        return (
          <div className="h-48 flex items-center justify-center">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={colors[0]}
                  strokeWidth="8"
                  strokeDasharray={`${percentage * 3.14} 314`}
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{gaugeValue}</div>
                  <div className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chart type: {chart.type}</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>{chart.title || 'Untitled Chart'}</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {chart.type}
            </Badge>
            {hasRealData(currentOperation) && (
              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                Live
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {renderLiveChart()}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {chartData.length} data point{chartData.length !== 1 ? 's' : ''}
            </span>
            <span>
              {hasRealData(currentOperation) ? 'Real data' : 'Sample data'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CustomizeDashboard({ onNavigate }: CustomizeDashboardProps) {
  // Store the current operation in localStorage when we visit this page
  useEffect(() => {
    // Get the current operation from the app's localStorage if available
    const currentOp = localStorage.getItem('selectedOperation') || getCurrentOperation();
    localStorage.setItem('rto_current_operation', currentOp);
  }, []);
  const [hasChanges, setHasChanges] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [savedFeatures, setSavedFeatures] = useState<DashboardFeature[]>([]);
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboard[]>([]);
  const [showSavedDashboards, setShowSavedDashboards] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'features' | 'insights'>('features');
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Data context for insights generation
  const { datasets, getDatasetsByOperation } = useDataContext();
  const { getKPIValues, getChartData, hasRealData } = useDataService();

  // Get current operation type from localStorage or default
  const getCurrentOperation = (): OperationType => {
    // First try to get from app's selected operation
    const appSelectedOperation = localStorage.getItem('selectedOperation');
    if (appSelectedOperation) {
      return appSelectedOperation as OperationType;
    }
    
    // Fall back to stored current operation or default
    const savedOperation = localStorage.getItem('rto_current_operation');
    return (savedOperation as OperationType) || 'terminal';
  };

  const currentOperation = getCurrentOperation();

  // Get saved dashboard charts
  const getSavedCharts = () => {
    try {
      const savedDashboard = localStorage.getItem('rto_dashboard');
      if (savedDashboard) {
        const dashboard = JSON.parse(savedDashboard);
        console.log('📊 Loaded saved dashboard:', dashboard);
        console.log('🎯 Available charts:', dashboard.charts?.length || 0);
        return dashboard.charts || [];
      }
    } catch (error) {
      console.error('Failed to load saved charts:', error);
    }
    return [];
  };

  const [savedCharts, setSavedCharts] = useState(getSavedCharts());

  const categories: FeatureCategory[] = [
    {
      id: 'ai',
      name: 'AI & Intelligence',
      description: 'Smart insights and predictive analytics',
      features: ['ai-assistant', 'predictive-insights', 'whatif-analysis'],
      icon: Brain,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'charts',
      name: 'Analytics & Charts',
      description: 'Visual data representations',
      features: ['line-charts', 'bar-charts', 'pie-charts', 'kpi-cards', 'heatmap'],
      icon: BarChart3,
      color: 'text-primary',
      gradient: 'from-primary to-cyan-600'
    },
    {
      id: 'simulator',
      name: 'Simulation Tools',
      description: 'Monitoring and simulation capabilities',
      features: ['timeline-view', 'event-log'],
      icon: Play,
      color: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'reports',
      name: 'Reports & Export',
      description: 'Documentation and benchmarking',
      features: ['pdf-export', 'benchmarking'],
      icon: FileText,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const defaultFeatures: DashboardFeature[] = [
    // AI & Intelligence
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      description: 'Interactive chatbot for insights and guidance',
      category: 'ai',
      icon: MessageSquare,
      enabled: true,
      isNew: true,
      previewComponent: (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-purple-900">AI Assistant</span>
          </div>
          <p className="text-sm text-purple-700">Chat interface visible</p>
        </div>
      )
    },
    {
      id: 'predictive-insights',
      name: 'Predictive Insights',
      description: 'AI-powered forecasting and recommendations',
      category: 'ai',
      icon: Brain,
      enabled: true,
      isPremium: true,
      previewComponent: (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-blue-900">AI Insights</span>
          </div>
          <p className="text-sm text-blue-700">Predictive cards shown</p>
        </div>
      )
    },
    {
      id: 'whatif-analysis',
      name: 'What-If Analysis',
      description: 'Scenario planning and analysis tools',
      category: 'ai',
      icon: Lightbulb,
      enabled: false,
      previewComponent: (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-amber-900">What-If Analysis</span>
          </div>
          <p className="text-sm text-amber-700">Analysis tools available</p>
        </div>
      )
    },

    // Charts
    {
      id: 'line-charts',
      name: 'Line Charts',
      description: 'Time-series data visualization',
      category: 'charts',
      icon: Activity,
      enabled: true,
      previewComponent: (() => {
        const lineData = getChartData(currentOperation, 'line').slice(0, 6);
        const maxValue = Math.max(...lineData.map(d => d.value));
        return (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-green-900">Line Charts</span>
              {hasRealData(currentOperation) && (
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs ml-auto">Live</Badge>
              )}
            </div>
            {/* Mini Line Chart Preview */}
            <div className="h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-2 relative overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 100 40">
                <polyline
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="2"
                  points={lineData.map((point, idx) => 
                    `${(idx / (lineData.length - 1)) * 90 + 5},${35 - (point.value / maxValue) * 25}`
                  ).join(' ')}
                />
                {lineData.map((point, idx) => (
                  <circle
                    key={idx}
                    cx={(idx / (lineData.length - 1)) * 90 + 5}
                    cy={35 - (point.value / maxValue) * 25}
                    r="2"
                    fill="rgb(34, 197, 94)"
                  />
                ))}
              </svg>
            </div>
            <p className="text-xs text-green-700 mt-2">
              {hasRealData(currentOperation) ? `${lineData.length} live data points` : 'Sample trend data'}
            </p>
          </div>
        );
      })()
    },
    {
      id: 'bar-charts',
      name: 'Bar Charts',
      description: 'Comparative data visualization',
      category: 'charts',
      icon: BarChart3,
      enabled: true,
      previewComponent: (() => {
        const barData = getChartData(currentOperation, 'bar').slice(0, 5);
        const maxValue = Math.max(...barData.map(d => d.operations));
        return (
          <div className="bg-gradient-to-br from-primary/10 to-cyan-50 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-primary">Bar Charts</span>
              {hasRealData(currentOperation) && (
                <Badge className="bg-primary/10 text-primary border-primary/30 text-xs ml-auto">Live</Badge>
              )}
            </div>
            <div className="h-14 bg-gradient-to-r from-primary/10 to-cyan-100 rounded-lg flex items-end justify-center space-x-1 p-2">
              {barData.map((bar, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-t from-primary to-cyan-500 rounded-t flex-1 max-w-4 relative" 
                  style={{ height: `${Math.max(8, (bar.operations / maxValue) * 36)}px` }}
                  title={`${bar.name}: ${bar.operations}`}
                >
                </div>
              ))}
            </div>
            <p className="text-xs text-primary/70 mt-2">
              {hasRealData(currentOperation) ? `${barData.length} categories from live data` : 'Sample categories'}
            </p>
          </div>
        );
      })()
    },
    {
      id: 'pie-charts',
      name: 'Pie Charts',
      description: 'Distribution and proportion charts',
      category: 'charts',
      icon: PieChart,
      enabled: false,
      previewComponent: (() => {
        const pieData = getChartData(currentOperation, 'pie').slice(0, 4);
        const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
        const colors = ['#f97316', '#ea580c', '#dc2626', '#b91c1c'];
        return (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <PieChart className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-orange-900">Pie Charts</span>
              {hasRealData(currentOperation) && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs ml-auto">Live</Badge>
              )}
            </div>
            <div className="flex justify-center mb-2">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  {pieData.map((segment, idx) => {
                    const angle = (segment.value / totalValue) * 360;
                    const prevAngles = pieData.slice(0, idx).reduce((sum, s) => sum + (s.value / totalValue) * 360, 0);
                    return (
                      <circle
                        key={idx}
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="transparent"
                        stroke={colors[idx % colors.length]}
                        strokeWidth="4"
                        strokeDasharray={`${angle * 0.44} 100`}
                        strokeDashoffset={`-${prevAngles * 0.44}`}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-orange-700 font-medium text-xs">
                  {pieData.length}
                </div>
              </div>
            </div>
            <p className="text-xs text-orange-700 text-center">
              {hasRealData(currentOperation) ? `${pieData.length} data segments` : 'Sample distribution'}
            </p>
          </div>
        );
      })()
    },
    {
      id: 'kpi-cards',
      name: 'KPI Cards',
      description: 'Key performance indicator displays',
      category: 'charts',
      icon: Target,
      enabled: true,
      previewComponent: (() => {
        const kpiValues = getKPIValues(currentOperation);
        return (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-indigo-900">KPI Cards</span>
              {hasRealData(currentOperation) && (
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs ml-auto">Live</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg h-10 p-2 flex flex-col items-center justify-center text-indigo-700">
                <div className="text-sm font-bold">{kpiValues.efficiency}%</div>
                <div className="text-xs opacity-70">Efficiency</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg h-10 p-2 flex flex-col items-center justify-center text-indigo-700">
                <div className="text-sm font-bold">{kpiValues.activeUnits}</div>
                <div className="text-xs opacity-70">Units</div>
              </div>
            </div>
            <p className="text-xs text-indigo-600 mt-2 text-center">
              {hasRealData(currentOperation) ? 'Real-time metrics' : 'Sample KPIs'}
            </p>
          </div>
        );
      })()
    },
    {
      id: 'heatmap',
      name: 'Heatmap',
      description: 'Activity density visualization',
      category: 'charts',
      icon: Map,
      enabled: false,
      previewComponent: (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Map className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-red-900">Heatmap</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
              <div key={i} className={`h-3 w-3 rounded-sm ${
                Math.random() > 0.7 ? 'bg-red-400' :
                Math.random() > 0.4 ? 'bg-red-200' : 'bg-red-100'
              }`}></div>
            ))}
          </div>
        </div>
      )
    },

    // Simulator
    {
      id: 'timeline-view',
      name: 'Timeline View',
      description: 'Chronological event visualization',
      category: 'simulator',
      icon: Clock,
      enabled: true,
      previewComponent: (
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-4 border border-cyan-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-cyan-900">Timeline View</span>
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-r from-cyan-200 to-teal-200 h-2 w-full rounded-full"></div>
            <div className="bg-gradient-to-r from-cyan-200 to-teal-200 h-2 w-3/4 rounded-full"></div>
            <div className="bg-gradient-to-r from-cyan-200 to-teal-200 h-2 w-1/2 rounded-full"></div>
          </div>
        </div>
      )
    },
    {
      id: 'event-log',
      name: 'Event Log',
      description: 'Detailed activity tracking',
      category: 'simulator',
      icon: FileText,
      enabled: true,
      previewComponent: (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-teal-900">Event Log</span>
          </div>
          <div className="space-y-1">
            <div className="bg-gradient-to-r from-teal-200 to-emerald-200 h-1.5 w-full rounded-full"></div>
            <div className="bg-gradient-to-r from-teal-200 to-emerald-200 h-1.5 w-5/6 rounded-full"></div>
            <div className="bg-gradient-to-r from-teal-200 to-emerald-200 h-1.5 w-2/3 rounded-full"></div>
            <div className="bg-gradient-to-r from-teal-200 to-emerald-200 h-1.5 w-4/5 rounded-full"></div>
          </div>
        </div>
      )
    },

    // Reports
    {
      id: 'pdf-export',
      name: 'PDF Export',
      description: 'Generate downloadable reports',
      category: 'reports',
      icon: Download,
      enabled: true,
      previewComponent: (
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center">
              <Download className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-slate-900">PDF Export</span>
          </div>
          <p className="text-sm text-slate-700">Export button available</p>
        </div>
      )
    },
    {
      id: 'benchmarking',
      name: 'Benchmarking',
      description: 'Performance comparison tools',
      category: 'reports',
      icon: TrendingUp,
      enabled: false,
      isPremium: true,
      previewComponent: (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-yellow-900">Benchmarking</span>
          </div>
          <p className="text-sm text-yellow-700">Comparison charts shown</p>
        </div>
      )
    }
  ];

  const [features, setFeatures] = useState<DashboardFeature[]>(defaultFeatures);

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
    setHasChanges(true);
  };

  const handleApplySelection = () => {
    setHasChanges(false);
    setSavedFeatures(features);
    setIsFullscreenPreview(true);
    localStorage.setItem('dashboardFeatures', JSON.stringify(features));
    
    // Store the selected features with operation context
    const dashboardConfig = {
      features: features.filter(f => f.enabled),
      operation: currentOperation,
      timestamp: new Date().toISOString(),
      charts: savedCharts
    };
    localStorage.setItem('customDashboardConfig', JSON.stringify(dashboardConfig));
    
    console.log('Dashboard preferences applied:', features.filter(f => f.enabled));
    toast.success(`Dashboard configured with ${features.filter(f => f.enabled).length} features`);
  };

  const handleResetToDefault = () => {
    setFeatures(defaultFeatures);
    setHasChanges(true);
  };

  const handleExitFullscreen = () => {
    setIsFullscreenPreview(false);
  };

  const enabledFeatures = features.filter(f => f.enabled);
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Load saved features and charts on component mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboardFeatures');
    if (saved) {
      try {
        const parsedFeatures = JSON.parse(saved);
        setFeatures(parsedFeatures);
        setSavedFeatures(parsedFeatures);
      } catch (error) {
        console.error('Error loading saved features:', error);
      }
    }
    
    // Refresh saved charts
    setSavedCharts(getSavedCharts());
  }, []);

  // Listen for localStorage changes to update saved charts
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rto_dashboard') {
        console.log('📊 Dashboard data changed, refreshing charts...');
        setSavedCharts(getSavedCharts());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Generate insights based on selected features and available data
  const generateInsights = () => {
    setGeneratingInsights(true);
    // Simulate analysis time
    setTimeout(() => {
      setGeneratingInsights(false);
    }, 2000);
  };

  // Get insights data for enabled features
  const getFeatureInsights = () => {
    const operationDatasets = getDatasetsByOperation(currentOperation);
    const kpiValues = getKPIValues(currentOperation);
    const hasData = hasRealData(currentOperation);
    
    const insights = [];
    
    // AI & Intelligence Insights
    if (enabledFeatures.some(f => f.category === 'ai')) {
      const aiFeatures = enabledFeatures.filter(f => f.category === 'ai');
      insights.push({
        category: 'AI & Intelligence',
        title: hasData ? 'AI Features Connected to Live Data' : 'AI Features Ready for Data',
        description: hasData 
          ? `AI features are connected to ${operationDatasets.length} dataset(s) with ${operationDatasets.reduce((sum, d) => sum + d.rowCount, 0).toLocaleString()} records.`
          : 'AI features are configured and ready to connect with your uploaded data.',
        metrics: [
          { label: 'Data Sources', value: operationDatasets.length, trend: operationDatasets.length > 0 ? 'up' : 'stable' },
          { label: 'AI Features Active', value: aiFeatures.length, trend: 'up' },
          { label: 'Data Quality', value: hasData ? `${Math.round(operationDatasets.reduce((sum, d) => sum + d.summary.completeness, 0) / operationDatasets.length)}%` : 'N/A', trend: hasData ? 'up' : 'stable' }
        ],
        recommendations: hasData ? [
          aiFeatures.some(f => f.id === 'predictive-insights') ? 'Predictive insights are analyzing your data patterns' : 'Enable predictive insights for forecasting',
          aiFeatures.some(f => f.id === 'whatif-analysis') ? 'What-if analysis ready with your datasets' : 'Add what-if analysis for scenario planning',
          'AI assistant can provide insights from your specific data'
        ] : [
          'Upload operational data in Settings to enable AI predictions',
          'Connect datasets to unlock advanced analytics',
          'AI features will automatically adapt to your data structure'
        ]
      });
    }

    // Charts & Analytics Insights  
    if (enabledFeatures.some(f => f.category === 'charts')) {
      const chartFeatures = enabledFeatures.filter(f => f.category === 'charts');
      const totalRecords = operationDatasets.reduce((sum, d) => sum + d.rowCount, 0);
      const availableColumns = operationDatasets.reduce((sum, d) => sum + d.columnCount, 0);
      
      insights.push({
        category: 'Analytics & Visualization',
        title: hasData ? 'Charts Connected to Your Data' : 'Chart Features Configured',
        description: hasData 
          ? `${chartFeatures.length} chart type(s) will display data from ${availableColumns} columns across your datasets.`
          : `${chartFeatures.length} chart type(s) are ready to visualize your data once uploaded.`,
        metrics: [
          { label: 'Chart Types', value: chartFeatures.length, trend: 'up' },
          { label: 'Data Points', value: hasData ? totalRecords.toLocaleString() : 0, trend: hasData ? 'up' : 'stable' },
          { label: 'Saved Charts', value: savedCharts.length, trend: savedCharts.length > 0 ? 'up' : 'stable' }
        ],
        recommendations: hasData ? [
          savedCharts.length > 0 ? `${savedCharts.length} saved chart(s) available in dashboard` : 'Create charts in Dashboard Builder to save configurations',
          chartFeatures.some(f => f.id === 'line-charts') ? 'Line charts will show trends from your time-series data' : 'Add line charts for trend analysis',
          chartFeatures.some(f => f.id === 'kpi-cards') ? 'KPI cards display live metrics from your data' : 'Enable KPI cards for key performance indicators'
        ] : [
          'Charts will automatically adapt to your data structure',
          'Upload CSV files to see real visualizations',
          'Dashboard Builder will help create custom chart configurations'
        ]
      });
    }

    // Simulation Insights
    if (enabledFeatures.some(f => f.category === 'simulator')) {
      const simulatorFeatures = enabledFeatures.filter(f => f.category === 'simulator');
      const eventData = hasData ? operationDatasets.reduce((sum, d) => sum + d.rowCount, 0) : 0;
      
      insights.push({
        category: 'Simulation & Monitoring',
        title: hasData ? 'Monitoring Tools Connected' : 'Monitoring Tools Ready',
        description: hasData 
          ? `${simulatorFeatures.length} monitoring tool(s) will track ${eventData.toLocaleString()} events from your data.`
          : `${simulatorFeatures.length} monitoring tool(s) ready to track operational events.`,
        metrics: [
          { label: 'Monitoring Tools', value: simulatorFeatures.length, trend: 'up' },
          { label: 'Event Data', value: hasData ? `${eventData.toLocaleString()} events` : 'No data', trend: hasData ? 'up' : 'stable' },
          { label: 'Uptime', value: `${kpiValues.uptime}%`, trend: 'up' }
        ],
        recommendations: hasData ? [
          simulatorFeatures.some(f => f.id === 'timeline-view') ? 'Timeline view will show chronological events from your data' : 'Enable timeline view for event sequences',
          simulatorFeatures.some(f => f.id === 'event-log') ? 'Event log connected to your operational data' : 'Add event log for detailed tracking',
          'Real-time monitoring active with your data feeds'
        ] : [
          'Upload operational logs to enable event tracking',
          'Time-stamped data will populate timeline views',
          'Event monitoring will activate with data connection'
        ]
      });
    }

    // Reports & Export Insights
    if (enabledFeatures.some(f => f.category === 'reports')) {
      const reportFeatures = enabledFeatures.filter(f => f.category === 'reports');
      
      insights.push({
        category: 'Reports & Documentation',
        title: hasData ? 'Reports Ready with Your Data' : 'Report Features Configured',
        description: hasData 
          ? `${reportFeatures.length} report feature(s) can export insights from ${operationDatasets.length} connected dataset(s).`
          : `${reportFeatures.length} report feature(s) ready to generate insights once data is connected.`,
        metrics: [
          { label: 'Report Features', value: reportFeatures.length, trend: 'up' },
          { label: 'Data Sources', value: operationDatasets.length, trend: operationDatasets.length > 0 ? 'up' : 'stable' },
          { label: 'Cost Savings', value: `${kpiValues.costSavings.toLocaleString()}`, trend: 'up' }
        ],
        recommendations: hasData ? [
          reportFeatures.some(f => f.id === 'pdf-export') ? 'PDF reports will include charts and KPIs from your data' : 'Enable PDF export for comprehensive reports',
          reportFeatures.some(f => f.id === 'benchmarking') ? 'Benchmarking analysis available with your operational data' : 'Add benchmarking for performance comparison',
          'Custom reports can be generated from your specific datasets'
        ] : [
          'Upload performance data to enable benchmarking',
          'Reports will automatically include your KPIs and charts',
          'Export functionality will activate with data connection'
        ]
      });
    }

    return insights;
  };

  // Get data utilization insights
  const getDataUtilizationInsights = () => {
    const totalDatasets = datasets.length;
    const totalRecords = datasets.reduce((sum, d) => sum + d.rowCount, 0);
    const operationTypes = [...new Set(datasets.map(d => d.operationType))];
    
    return {
      overview: {
        datasets: totalDatasets,
        records: totalRecords,
        operations: operationTypes.length,
        quality: datasets.length > 0 ? 
          Math.round(datasets.reduce((sum, d) => sum + d.summary.completeness, 0) / datasets.length) : 0
      },
      byOperation: operationTypes.map(op => ({
        operation: op,
        datasets: datasets.filter(d => d.operationType === op).length,
        records: datasets.filter(d => d.operationType === op).reduce((sum, d) => sum + d.rowCount, 0),
        quality: datasets.filter(d => d.operationType === op).length > 0 ?
          Math.round(datasets.filter(d => d.operationType === op).reduce((sum, d) => sum + d.summary.completeness, 0) / datasets.filter(d => d.operationType === op).length) : 0
      }))
    };
  };

  if (isFullscreenPreview) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Fullscreen Header */}
        <div className="border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleExitFullscreen}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Dashboard Preview</h1>
              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20 text-primary">
                {enabledFeatures.length} features active
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExitFullscreen}>
                <Minimize className="h-4 w-4 mr-2" />
                Exit Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
              {enabledFeatures.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <Monitor className="h-20 w-20 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">No Features Selected</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Go back and enable some features to see your custom dashboard in action
                  </p>
                  <Button onClick={handleExitFullscreen} size="lg">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Customization
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Data-Driven Components Section */}
                  {hasRealData(currentOperation) && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Database className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Live Data Components</h3>
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Connected to {getDatasetsByOperation(currentOperation).length} dataset(s)
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {enabledFeatures.filter(f => f.category === 'charts' || f.category === 'ai').map(feature => (
                          <Card key={feature.id} className="overflow-hidden border border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-0">
                              <div className="relative">
                                {feature.previewComponent}
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-primary/10 text-primary text-xs">Live</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saved Charts Section */}
                  {savedCharts.length > 0 && enabledFeatures.some(f => f.category === 'charts') && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Saved Dashboard Charts</h3>
                        <Badge variant="outline">
                          {savedCharts.length} chart{savedCharts.length !== 1 ? 's' : ''}
                        </Badge>
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Live Data
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedCharts.slice(0, 4).map((chart: any, index: number) => (
                          <SavedChartPreview 
                            key={chart.id || index} 
                            chart={chart} 
                            currentOperation={currentOperation}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Selected Features */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Layout className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">All Selected Features</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {enabledFeatures.map(feature => (
                        <Card key={feature.id} className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-0">
                            {feature.previewComponent}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5">
      {/* Enhanced Header */}
      <div className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-40">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="flex items-center gap-2">
                  <Palette className="h-6 w-6 text-primary" />
                  Customize Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Design your perfect terminal management experience
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasRealData(currentOperation) ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Database className="w-3 h-3 mr-1" />
                  Live Data Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Upload className="w-3 h-3 mr-1" />
                  Sample Data
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => onNavigate('settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Data Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleExitFullscreen}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleApplySelection}
                disabled={!hasChanges}
                className="bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white shadow-lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Apply & Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Panel - Feature Selection or Insights */}
        <div className="w-1/2 border-r border-border bg-card/50 backdrop-blur-sm">
          <div className="p-6">
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'features' | 'insights')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="features">Features Selection</TabsTrigger>
                <TabsTrigger value="insights">My Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4">
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search features..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border/50"
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className={selectedCategory === 'all' ? 'bg-primary text-white' : ''}
                    >
                      All Features
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id ? `bg-gradient-to-r ${category.gradient} text-white` : ''}
                      >
                        <category.icon className="h-3 w-3 mr-1" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="space-y-6">
                    {categories.map(category => {
                      const categoryFeatures = filteredFeatures.filter(f => f.category === category.id);
                      if (categoryFeatures.length === 0) return null;

                      return (
                        <div key={category.id} className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                              <category.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{category.name}</h3>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                            <Badge variant="secondary" className="ml-auto">
                              {categoryFeatures.filter(f => f.enabled).length}/{categoryFeatures.length}
                            </Badge>
                          </div>

                          <div className="space-y-3 ml-2">
                            {categoryFeatures.map(feature => {
                              const Icon = feature.icon;
                              return (
                                <Card 
                                  key={feature.id} 
                                  className={`transition-all duration-200 hover:shadow-md border ${
                                    feature.enabled 
                                      ? `border-primary/30 bg-gradient-to-r from-primary/5 to-transparent shadow-sm` 
                                      : 'border-border hover:border-border/70'
                                  }`}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div 
                                        className="flex items-center space-x-3 flex-1 cursor-pointer"
                                        onClick={() => toggleFeature(feature.id)}
                                      >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                          feature.enabled 
                                            ? `bg-gradient-to-br ${category.gradient}` 
                                            : 'bg-muted'
                                        }`}>
                                          <Icon className={`h-4 w-4 transition-colors duration-200 ${feature.enabled ? 'text-white' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center space-x-2">
                                            <h4 className="font-medium truncate">{feature.name}</h4>
                                            {feature.isNew && (
                                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                                                New
                                              </Badge>
                                            )}
                                            {feature.isPremium && (
                                              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                                                Premium
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-muted-foreground truncate">{feature.description}</p>
                                        </div>
                                      </div>
                                      <Switch
                                        checked={feature.enabled}
                                        onCheckedChange={(checked) => {
                                          // Use the checked parameter directly to prevent double toggling
                                          setFeatures(prev => prev.map(f => 
                                            f.id === feature.id 
                                              ? { ...f, enabled: checked }
                                              : f
                                          ));
                                          setHasChanges(true);
                                        }}
                                        className="ml-3 flex-shrink-0 interactive-element"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4">
                {/* Insights Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Smart Insights
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered analysis of your dashboard configuration
                      </p>
                    </div>
                    <Button 
                      onClick={generateInsights}
                      disabled={generatingInsights || enabledFeatures.length === 0}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-cyan-600"
                    >
                      {generatingInsights ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Integration Status */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Integration Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Data Connection Status */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${hasRealData(currentOperation) ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            <div>
                              <p className="font-medium">Data Connection</p>
                              <p className="text-sm text-muted-foreground">
                                {hasRealData(currentOperation) 
                                  ? `${getDatasetsByOperation(currentOperation).length} dataset(s) connected`
                                  : 'No data connected - using samples'
                                }
                              </p>
                            </div>
                          </div>
                          {!hasRealData(currentOperation) && (
                            <Button variant="outline" size="sm" onClick={() => onNavigate('settings')}>
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          )}
                        </div>

                        {/* Saved Charts Status */}
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${savedCharts.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <div>
                              <p className="font-medium">Saved Charts</p>
                              <p className="text-sm text-muted-foreground">
                                {savedCharts.length > 0 
                                  ? `${savedCharts.length} chart configuration(s) available`
                                  : 'No saved charts - create in Dashboard Builder'
                                }
                              </p>
                            </div>
                          </div>
                          {savedCharts.length === 0 && (
                            <Button variant="outline" size="sm" onClick={() => onNavigate('dashboard')}>
                              <Plus className="h-3 w-3 mr-1" />
                              Create
                            </Button>
                          )}
                        </div>

                        {/* Feature Coverage */}
                        <div className="p-3 rounded-lg border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <p className="font-medium">Feature Coverage</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Enabled Features:</span>
                              <span className="font-medium ml-1">{enabledFeatures.length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">With Live Data:</span>
                              <span className="font-medium ml-1">
                                {hasRealData(currentOperation) ? enabledFeatures.filter(f => f.category === 'charts' || f.category === 'ai').length : 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Overview */}
                  {datasets.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Data Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Datasets</span>
                              <span className="font-medium">{getDataUtilizationInsights().overview.datasets}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Records</span>
                              <span className="font-medium">{getDataUtilizationInsights().overview.records.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Operations</span>
                              <span className="font-medium">{getDataUtilizationInsights().overview.operations}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Quality</span>
                              <span className="font-medium">{getDataUtilizationInsights().overview.quality}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <ScrollArea className="h-[calc(100vh-400px)]">
                  {enabledFeatures.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                      <Brain className="h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="font-medium mb-2">No Features Selected</h3>
                      <p className="text-sm text-muted-foreground">
                        Select features in the Features tab to generate insights
                      </p>
                    </div>
                  ) : datasets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                      <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="font-medium mb-2">No Data Available</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload data files in Settings → Data Management to enable insights
                      </p>
                      <Button variant="outline" onClick={() => onNavigate("settings")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Go to Settings
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getFeatureInsights().map((insight, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-base">{insight.title}</CardTitle>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {insight.category}
                                </Badge>
                              </div>
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                              {insight.metrics.map((metric, idx) => (
                                <div key={idx} className="text-center">
                                  <div className="flex items-center justify-center mb-1">
                                    <span className="font-semibold text-lg">{metric.value}</span>
                                    {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500 ml-1" />}
                                    {metric.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 ml-1 rotate-180" />}
                                  </div>
                                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                                </div>
                              ))}
                            </div>
                            
                            <Separator />
                            
                            {/* Recommendations */}
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-500" />
                                Recommendations
                              </h4>
                              <ul className="space-y-1">
                                {insight.recommendations.map((rec, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                    <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Data Utilization Chart */}
                      {datasets.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Data Utilization by Operation
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {getDataUtilizationInsights().byOperation.map((op, index) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize">{op.operation}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {op.records.toLocaleString()} records
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={op.quality} className="flex-1" />
                                    <span className="text-sm text-muted-foreground w-12">{op.quality}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-1/2 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Live Preview
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {enabledFeatures.length} features selected • Changes apply instantly
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleApplySelection}
                    className="border-primary/20 hover:bg-primary/5"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Full Preview Available
                  </Button>
                </div>
              </div>
              
              <Card className="bg-card/80 border border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Dashboard Preview
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {enabledFeatures.length} components
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click "Apply & Preview" to see your dashboard in full-screen with interactive charts
                  </p>
                  <Button 
                    onClick={handleApplySelection}
                    className="w-full bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white"
                    disabled={enabledFeatures.length === 0}
                  >
                    <MousePointer className="h-4 w-4 mr-2" />
                    Apply & Preview Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>

            <ScrollArea className="h-[calc(100vh-400px)]">
              {enabledFeatures.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <Layout className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-2">No Features Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable features from the left panel to see the preview
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {enabledFeatures.map(feature => (
                    <Card key={feature.id} className="overflow-hidden border border-border/50 hover:border-primary/30 transition-colors duration-200">
                      <CardContent className="p-0">
                        {feature.previewComponent}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}