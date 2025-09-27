import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartConfig, DataField } from '../DataDashboard';
import { useDataService } from '../DataService';

interface ChartRendererProps {
  chart: ChartConfig;
  dataFields: DataField[];
  className?: string;
}

// Sample data generator based on configured fields
const generateSampleData = (chart: ChartConfig): any[] => {
  const sampleData = [];
  const categories = ['Production', 'Development', 'Database', 'API Gateway', 'Load Balancer'];
  
  for (let i = 0; i < 5; i++) {
    const dataPoint: any = {};
    
    // Add X-axis data (dimensions)
    if (chart.xAxis && chart.xAxis.length > 0) {
      chart.xAxis.forEach(field => {
        if (field.dataType === 'string') {
          dataPoint[field.name] = categories[i] || `Server ${i + 1}`;
        } else if (field.dataType === 'date') {
          const date = new Date();
          date.setDate(date.getDate() - (4 - i));
          dataPoint[field.name] = date.toLocaleDateString();
        }
      });
    }
    
    // Add Y-axis data (measures)
    if (chart.yAxis && chart.yAxis.length > 0) {
      chart.yAxis.forEach(field => {
        if (field.name.toLowerCase().includes('cpu')) {
          dataPoint[field.name] = Math.floor(Math.random() * 80) + 10;
        } else if (field.name.toLowerCase().includes('memory')) {
          dataPoint[field.name] = Math.floor(Math.random() * 70) + 20;
        } else if (field.name.toLowerCase().includes('network')) {
          dataPoint[field.name] = Math.floor(Math.random() * 100) + 50;
        } else if (field.name.toLowerCase().includes('response')) {
          dataPoint[field.name] = Math.floor(Math.random() * 200) + 50;
        } else if (field.name.toLowerCase().includes('connection')) {
          dataPoint[field.name] = Math.floor(Math.random() * 500) + 100;
        } else if (field.name.toLowerCase().includes('error')) {
          dataPoint[field.name] = Math.floor(Math.random() * 5) + 1;
        } else {
          dataPoint[field.name] = Math.floor(Math.random() * 100) + 10;
        }
      });
    }
    
    // Add color grouping data
    if (chart.color && chart.color.length > 0) {
      chart.color.forEach(field => {
        if (field.name.toLowerCase().includes('status')) {
          dataPoint[field.name] = i % 2 === 0 ? 'Connected' : 'Disconnected';
        } else {
          dataPoint[field.name] = `Group ${String.fromCharCode(65 + (i % 3))}`;
        }
      });
    }
    
    sampleData.push(dataPoint);
  }
  
  return sampleData;
};

const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ChartRenderer({ chart, dataFields, className = "" }: ChartRendererProps) {
  const { getChartData, hasRealData } = useDataService();
  
  // Try to get real data first, fallback to sample data
  const getRealOrSampleData = () => {
    // For now, we'll default to 'terminal' operation type
    // In a real app, this would be passed as a prop
    const operationType = 'terminal';
    
    if (hasRealData(operationType)) {
      return getChartData(operationType, chart.type);
    }
    
    return generateSampleData(chart);
  };
  
  const data = getRealOrSampleData();
  
  if (!chart.xAxis?.length && !chart.yAxis?.length) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="text-green-400/60 text-sm mb-2">Configure Chart</div>
          <p className="text-green-300/40 text-xs">
            Add fields to X and Y axes to see your data
          </p>
        </div>
      </div>
    );
  }

  const xAxisKey = chart.xAxis?.[0]?.name;
  const yAxisKey = chart.yAxis?.[0]?.name;

  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#10b981" 
                fontSize={12}
                tick={{ fill: '#10b981' }}
              />
              <YAxis 
                stroke="#10b981" 
                fontSize={12}
                tick={{ fill: '#10b981' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981', 
                  borderRadius: '4px',
                  color: '#10b981'
                }}
              />
              {chart.yAxis?.map((field, index) => (
                <Bar 
                  key={field.id} 
                  dataKey={field.name} 
                  fill={colors[index % colors.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#10b981" 
                fontSize={12}
                tick={{ fill: '#10b981' }}
              />
              <YAxis 
                stroke="#10b981" 
                fontSize={12}
                tick={{ fill: '#10b981' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981', 
                  borderRadius: '4px',
                  color: '#10b981'
                }}
              />
              {chart.yAxis?.map((field, index) => (
                <Line 
                  key={field.id} 
                  type="monotone" 
                  dataKey={field.name} 
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#10b981" 
                fontSize={12}
                tick={{ fill: '#10b981' }}
              />
              <YAxis 
                stroke="#10b981" 
                fontSize={12}
                tick={{ fill: '#10b981' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981', 
                  borderRadius: '4px',
                  color: '#10b981'
                }}
              />
              {chart.yAxis?.map((field, index) => (
                <Area 
                  key={field.id} 
                  type="monotone" 
                  dataKey={field.name} 
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // For pie charts, we need to transform the data
        const pieData = chart.yAxis?.length ? data.map((item, index) => ({
          name: item[xAxisKey] || `Item ${index + 1}`,
          value: item[chart.yAxis![0].name] || 0
        })) : [];

        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(80, 120)}
                fill="#10b981"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelStyle={{ fontSize: '12px', fill: '#10b981' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #10b981', 
                  borderRadius: '4px',
                  color: '#10b981'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'kpi':
        // For KPI cards, show a simple metric display
        const kpiValue = chart.yAxis?.[0] ? 
          generateSampleData(chart).reduce((sum, item) => sum + (item[chart.yAxis![0].name] || 0), 0) : 0;
        
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-300 mb-2">
                {kpiValue.toLocaleString()}
              </div>
              <div className="text-green-400 text-lg">
                {chart.yAxis?.[0]?.name || 'KPI Value'}
              </div>
              <div className="text-green-400/60 text-sm mt-2">
                Total Value
              </div>
            </div>
          </div>
        );

      case 'gauge':
        // For gauge charts, show a progress indicator
        const gaugeData = generateSampleData(chart);
        const gaugeValue = gaugeData[gaugeData.length - 1]?.[chart.yAxis?.[0]?.name] || 0;
        const maxValue = 100; // Could be configurable
        const percentage = Math.min((gaugeValue / maxValue) * 100, 100);
        
        return (
          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-green-800/30 relative">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-green-400"
                  style={{
                    background: `conic-gradient(from 0deg, #10b981 ${percentage}%, transparent ${percentage}%)`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">{gaugeValue}</div>
                    <div className="text-xs text-green-400/60">{percentage.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-sm font-medium text-green-400">
                  {chart.yAxis?.[0]?.name || 'Progress'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-green-400/60 text-sm">Unsupported Chart Type</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {renderChart()}
    </div>
  );
}