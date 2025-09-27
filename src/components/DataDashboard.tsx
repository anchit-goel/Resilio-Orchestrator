import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DataFieldsPanel } from './dashboard/DataFieldsPanel';
import { VisualizationCanvas } from './dashboard/VisualizationCanvas';
import { ChartTypeSelector } from './dashboard/ChartTypeSelector';
import { ChartRenderer } from './dashboard/ChartRenderer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Database,
  RefreshCcw,
  Download,
  Share2
} from 'lucide-react';

export interface DataField {
  id: string;
  name: string;
  type: 'dimension' | 'measure';
  dataType: 'string' | 'number' | 'date';
}

export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'gauge' | 'kpi';
  xAxis?: DataField[];
  yAxis?: DataField[];
  color?: DataField[];
  title: string;
}

// Detect if we're on mobile for touch backend
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function DataDashboard() {
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  
  // Sample data fields - in a real app, these would come from your data sources
  const dataFields: DataField[] = [
    { id: '1', name: 'Server Name', type: 'dimension', dataType: 'string' },
    { id: '2', name: 'CPU Usage', type: 'measure', dataType: 'number' },
    { id: '3', name: 'Memory Usage', type: 'measure', dataType: 'number' },
    { id: '4', name: 'Network I/O', type: 'measure', dataType: 'number' },
    { id: '5', name: 'Timestamp', type: 'dimension', dataType: 'date' },
    { id: '6', name: 'Status', type: 'dimension', dataType: 'string' },
    { id: '7', name: 'Response Time', type: 'measure', dataType: 'number' },
    { id: '8', name: 'Connection Count', type: 'measure', dataType: 'number' },
    { id: '9', name: 'Error Rate', type: 'measure', dataType: 'number' },
  ];

  const addChart = (chartConfig: Omit<ChartConfig, 'id'>) => {
    const newChart = {
      ...chartConfig,
      id: `chart-${Date.now()}`
    };
    setCharts([...charts, newChart]);
    setSelectedChart(newChart.id);
  };

  const updateChart = (chartId: string, updates: Partial<ChartConfig>) => {
    setCharts(charts.map(chart => 
      chart.id === chartId ? { ...chart, ...updates } : chart
    ));
  };

  const removeChart = (chartId: string) => {
    setCharts(charts.filter(chart => chart.id !== chartId));
    if (selectedChart === chartId) {
      setSelectedChart(null);
    }
  };

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="min-h-screen bg-black text-green-400 font-mono">
        {/* Header */}
        <header className="bg-gray-900/50 border-b border-green-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-green-400" />
              <div>
                <h1 className="text-green-400">Data Dashboard</h1>
                <p className="text-green-300/60 text-sm">Drag & Drop Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-green-400 hover:bg-green-500/20 p-2"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-green-400 hover:bg-green-500/20 p-2"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-green-400 hover:bg-green-500/20 p-2"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col h-[calc(100vh-140px)]">
          <div className="flex-1 flex flex-col">
            {/* Status Bar */}
            <div className="bg-gray-900/50 border-b border-green-500/30 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm font-medium">Dashboard Builder</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                  {charts.length} Charts
                </Badge>
                <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                  Live Mode
                </Badge>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row flex-1 h-full">
              {/* Data Fields Panel - Hidden on mobile, collapsible on tablet */}
              <div className="hidden md:block w-full md:w-72 xl:w-80 border-r border-green-500/30 bg-gray-900/30">
                <DataFieldsPanel dataFields={dataFields} />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Chart Type Selector */}
                <div className="border-b border-green-500/20 p-2 md:p-4">
                  <ChartTypeSelector 
                    onCreateChart={addChart}
                    selectedChart={selectedChart ? charts.find(c => c.id === selectedChart) : null}
                  />
                </div>

                {/* Mobile Data Fields - Show on mobile only */}
                <div className="md:hidden border-b border-green-500/20 max-h-48 overflow-hidden">
                  <DataFieldsPanel dataFields={dataFields} />
                </div>

                {/* Split View: Canvas and Preview */}
                <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                  {/* Visualization Canvas - Always visible */}
                  <div className="flex-1 p-2 md:p-4 min-h-0 border-r-0 lg:border-r border-green-500/20">
                    <VisualizationCanvas
                      charts={charts}
                      selectedChart={selectedChart}
                      onSelectChart={setSelectedChart}
                      onUpdateChart={updateChart}
                      onRemoveChart={removeChart}
                      dataFields={dataFields}
                    />
                  </div>

                  {/* Live Preview Panel - Show when charts exist */}
                  {charts.length > 0 && (
                    <div className="w-full lg:w-96 xl:w-1/3 p-2 md:p-4 bg-gray-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-green-300 text-sm font-medium flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Live Preview
                        </h3>
                        <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                          {charts.length} Active
                        </Badge>
                      </div>
                      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {charts.map((chart) => (
                          <Card 
                            key={chart.id} 
                            className={`bg-gray-900/50 border-green-500/30 cursor-pointer transition-all ${
                              selectedChart === chart.id ? 'ring-1 ring-green-400 border-green-400' : ''
                            }`}
                            onClick={() => setSelectedChart(chart.id)}
                          >
                            <CardHeader className="pb-2 p-3">
                              <CardTitle className="text-green-300 text-xs truncate">{chart.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="h-32 p-3">
                              {chart.xAxis?.length || chart.yAxis?.length ? (
                                <ChartRenderer 
                                  chart={chart} 
                                  dataFields={dataFields} 
                                  className="h-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-green-400/60">
                                  <div className="text-center">
                                    {chart.type === 'bar' && <BarChart3 className="h-6 w-6 mx-auto mb-1" />}
                                    {chart.type === 'line' && <LineChart className="h-6 w-6 mx-auto mb-1" />}
                                    {chart.type === 'pie' && <PieChart className="h-6 w-6 mx-auto mb-1" />}
                                    <p className="text-xs capitalize">{chart.type} Chart</p>
                                    <p className="text-xs text-green-400/40">Configure axes</p>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}