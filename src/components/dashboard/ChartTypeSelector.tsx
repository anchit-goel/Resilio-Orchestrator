import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart,
  Plus
} from 'lucide-react';
import { ChartConfig } from '../DataDashboard';

interface ChartTypeSelectorProps {
  onCreateChart: (chartConfig: Omit<ChartConfig, 'id'>) => void;
  selectedChart: ChartConfig | null;
}

const chartTypes = [
  {
    type: 'bar' as const,
    name: 'Bar Chart',
    icon: BarChart3,
    description: 'Compare categories'
  },
  {
    type: 'line' as const,
    name: 'Line Chart',
    icon: LineChart,
    description: 'Show trends over time'
  },
  {
    type: 'pie' as const,
    name: 'Pie Chart',
    icon: PieChart,
    description: 'Show proportions'
  },
  {
    type: 'area' as const,
    name: 'Area Chart',
    icon: AreaChart,
    description: 'Show cumulative values'
  }
];

export function ChartTypeSelector({ onCreateChart, selectedChart }: ChartTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');

  const handleCreateChart = () => {
    const chartNames = {
      bar: 'Bar Chart',
      line: 'Line Chart',
      pie: 'Pie Chart',
      area: 'Area Chart'
    };

    onCreateChart({
      type: selectedType,
      title: `New ${chartNames[selectedType]}`,
      xAxis: [],
      yAxis: [],
      color: []
    });
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-green-300 text-sm md:text-base">Chart Types</h3>
          <p className="text-green-400/60 text-xs md:text-sm">Select a chart type to get started</p>
        </div>
        
        <Button
          onClick={handleCreateChart}
          className="bg-green-600 hover:bg-green-500 text-black w-full md:w-auto"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Chart
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          const isSelected = selectedType === chart.type;
          
          return (
            <Card
              key={chart.type}
              className={`cursor-pointer transition-all border-2 touch-manipulation ${
                isSelected 
                  ? 'bg-green-500/20 border-green-400' 
                  : 'bg-gray-900/50 border-green-500/30 hover:border-green-400/60'
              }`}
              onClick={() => setSelectedType(chart.type)}
            >
              <CardContent className="p-2 md:p-4 text-center">
                <Icon className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 ${
                  isSelected ? 'text-green-300' : 'text-green-400'
                }`} />
                <h4 className={`text-xs md:text-sm mb-1 ${
                  isSelected ? 'text-green-300' : 'text-green-400'
                }`}>
                  {chart.name}
                </h4>
                <p className="text-green-400/60 text-xs hidden md:block">{chart.description}</p>
                {isSelected && (
                  <Badge className="bg-green-500/30 text-green-300 border-green-400/50 mt-1 md:mt-2 text-xs">
                    Selected
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedChart && (
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-green-300 text-xs md:text-sm mb-1">Active Chart</h4>
                <p className="text-green-400 text-xs md:text-sm truncate">{selectedChart.title}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 capitalize text-xs">
                {selectedChart.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}