import React from 'react';
import { useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart,
  X,
  Settings,
  Eye,
  Plus
} from 'lucide-react';
import { ChartConfig, DataField } from '../DataDashboard';
import { ChartBuilder } from './ChartBuilder';
import { ChartRenderer } from './ChartRenderer';

interface VisualizationCanvasProps {
  charts: ChartConfig[];
  selectedChart: string | null;
  onSelectChart: (chartId: string | null) => void;
  onUpdateChart: (chartId: string, updates: Partial<ChartConfig>) => void;
  onRemoveChart: (chartId: string) => void;
  dataFields: DataField[];
}

export function VisualizationCanvas({
  charts,
  selectedChart,
  onSelectChart,
  onUpdateChart,
  onRemoveChart,
  dataFields
}: VisualizationCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'dataField',
    drop: (item: DataField) => {
      console.log('Dropped field:', item);
      // Handle field drop logic here
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return BarChart3;
      case 'line': return LineChart;
      case 'pie': return PieChart;
      case 'area': return AreaChart;
      default: return BarChart3;
    }
  };

  const selectedChartConfig = selectedChart ? charts.find(c => c.id === selectedChart) : null;

  if (charts.length === 0) {
    return (
      <div
        ref={drop}
        className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
          isOver 
            ? 'border-green-400 bg-green-500/10' 
            : 'border-green-500/30 bg-gray-900/20'
        }`}
      >
        <Plus className="h-16 w-16 text-green-400/40 mb-4" />
        <h3 className="text-green-300 mb-2">Create Your First Visualization</h3>
        <p className="text-green-400/60 text-sm text-center max-w-md">
          Select a chart type above and click "Create Chart" to get started, 
          or drag data fields here to begin building
        </p>
        {isOver && (
          <div className="mt-4 text-green-400 text-sm">
            Drop field to create visualization
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {selectedChartConfig ? (
        <div className="flex-1 flex flex-col">
          {/* Chart Builder Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSelectChart(null)}
                className="text-green-400 hover:bg-green-500/20 text-xs md:text-sm px-2 md:px-3"
              >
                ← Back
              </Button>
              <div className="min-w-0 flex-1">
                <h3 className="text-green-300 text-sm md:text-base truncate">{selectedChartConfig.title}</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 capitalize text-xs">
                  {selectedChartConfig.type} Chart
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-green-400 hover:bg-green-500/20 p-2 touch-manipulation"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-green-400 hover:bg-green-500/20 p-2 touch-manipulation"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveChart(selectedChartConfig.id)}
                className="text-red-400 hover:bg-red-500/20 p-2 touch-manipulation"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chart Builder */}
          <ChartBuilder
            chart={selectedChartConfig}
            dataFields={dataFields}
            onUpdateChart={(updates) => onUpdateChart(selectedChartConfig.id, updates)}
          />
        </div>
      ) : (
        <div className="flex-1">
          <div className="mb-3 md:mb-4">
            <h3 className="text-green-300 mb-1 text-sm md:text-base">Your Visualizations</h3>
            <p className="text-green-400/60 text-xs md:text-sm">Click on a chart to edit it</p>
          </div>

          <ScrollArea className="h-[calc(100%-80px)] md:h-[calc(100%-60px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {charts.map((chart) => {
                const Icon = getChartIcon(chart.type);
                
                return (
                  <Card
                    key={chart.id}
                    className="bg-gray-900/50 border-green-500/30 cursor-pointer hover:border-green-400/60 transition-colors touch-manipulation"
                    onClick={() => onSelectChart(chart.id)}
                  >
                    <CardHeader className="pb-2 p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-green-300 text-xs md:text-sm truncate flex-1 mr-2">{chart.title}</CardTitle>
                        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs capitalize">
                            {chart.type}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveChart(chart.id);
                            }}
                            className="text-red-400 hover:bg-red-500/20 p-1 h-6 w-6 touch-manipulation"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="h-32 md:h-48 p-3 md:p-4">
                      {chart.xAxis?.length || chart.yAxis?.length ? (
                        <ChartRenderer 
                          chart={chart} 
                          dataFields={dataFields} 
                          className="h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Icon className="h-8 w-8 md:h-16 md:w-16 mx-auto mb-2 md:mb-3 text-green-400/40" />
                            <p className="text-green-400/60 text-xs md:text-sm">Click to configure</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}