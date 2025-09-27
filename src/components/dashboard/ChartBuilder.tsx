import React from 'react';
import { useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  X, 
  Plus,
  BarChart3,
  LineChart,
  PieChart,
  AreaChart
} from 'lucide-react';
import { ChartConfig, DataField } from '../DataDashboard';
import { ChartRenderer } from './ChartRenderer';

interface ChartBuilderProps {
  chart: ChartConfig;
  dataFields: DataField[];
  onUpdateChart: (updates: Partial<ChartConfig>) => void;
}

interface DropZoneProps {
  title: string;
  description: string;
  fields: DataField[];
  onAddField: (field: DataField) => void;
  onRemoveField: (fieldId: string) => void;
  acceptedTypes?: ('dimension' | 'measure')[];
}

function DropZone({ title, description, fields, onAddField, onRemoveField, acceptedTypes }: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'dataField',
    drop: (item: DataField) => {
      if (!fields.find(f => f.id === item.id)) {
        onAddField(item);
      }
    },
    canDrop: (item: DataField) => {
      return !acceptedTypes || acceptedTypes.includes(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 md:pb-3 p-3 md:p-4">
        <CardTitle className="text-green-300 text-xs md:text-sm">{title}</CardTitle>
        <p className="text-green-400/60 text-xs">{description}</p>
      </CardHeader>
      
      <CardContent className="p-3 md:p-4 pt-0">
        <div
          ref={drop}
          className={`min-h-[80px] md:min-h-[100px] p-2 md:p-3 border-2 border-dashed rounded-lg transition-colors touch-manipulation ${
            isOver && canDrop
              ? 'border-green-400 bg-green-500/10'
              : canDrop
              ? 'border-green-500/30 bg-gray-900/20'
              : 'border-gray-600/30 bg-gray-900/10'
          }`}
        >
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-3 md:py-4">
              <Plus className="h-6 w-6 md:h-8 md:w-8 text-green-400/40 mb-1 md:mb-2" />
              <p className="text-green-400/60 text-xs">
                {isOver && canDrop ? 'Drop field here' : 'Drag fields here'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 md:space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-green-500/20"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-green-300 text-xs md:text-sm truncate">{field.name}</p>
                    <Badge className={`text-xs ${
                      field.type === 'dimension' 
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}>
                      {field.type}
                    </Badge>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveField(field.id)}
                    className="text-red-400 hover:bg-red-500/20 p-1 h-6 w-6 ml-2 touch-manipulation"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartBuilder({ chart, dataFields, onUpdateChart }: ChartBuilderProps) {
  const handleTitleChange = (title: string) => {
    onUpdateChart({ title });
  };

  const handleAddToAxis = (axis: 'xAxis' | 'yAxis' | 'color', field: DataField) => {
    const currentFields = chart[axis] || [];
    onUpdateChart({
      [axis]: [...currentFields, field]
    });
  };

  const handleRemoveFromAxis = (axis: 'xAxis' | 'yAxis' | 'color', fieldId: string) => {
    const currentFields = chart[axis] || [];
    onUpdateChart({
      [axis]: currentFields.filter(f => f.id !== fieldId)
    });
  };

  const getChartIcon = () => {
    switch (chart.type) {
      case 'bar': return BarChart3;
      case 'line': return LineChart;
      case 'pie': return PieChart;
      case 'area': return AreaChart;
      default: return BarChart3;
    }
  };

  const Icon = getChartIcon();

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Chart Title */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <Label className="text-green-300 text-xs md:text-sm">Chart Title</Label>
              <Input
                value={chart.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-1 bg-black/50 border-green-500/30 text-green-300 placeholder-green-400/40 font-mono focus:border-green-400 focus:ring-green-400/20 text-sm"
                placeholder="Enter chart title..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {/* X-Axis */}
        {chart.type !== 'pie' && (
          <DropZone
            title="X-Axis"
            description="Categories or time dimensions"
            fields={chart.xAxis || []}
            onAddField={(field) => handleAddToAxis('xAxis', field)}
            onRemoveField={(fieldId) => handleRemoveFromAxis('xAxis', fieldId)}
            acceptedTypes={['dimension']}
          />
        )}

        {/* Y-Axis */}
        {chart.type !== 'pie' && (
          <DropZone
            title="Y-Axis"
            description="Values to measure"
            fields={chart.yAxis || []}
            onAddField={(field) => handleAddToAxis('yAxis', field)}
            onRemoveField={(fieldId) => handleRemoveFromAxis('yAxis', fieldId)}
            acceptedTypes={['measure']}
          />
        )}

        {/* Values (for Pie Chart) */}
        {chart.type === 'pie' && (
          <>
            <DropZone
              title="Labels"
              description="Category labels"
              fields={chart.xAxis || []}
              onAddField={(field) => handleAddToAxis('xAxis', field)}
              onRemoveField={(fieldId) => handleRemoveFromAxis('xAxis', fieldId)}
              acceptedTypes={['dimension']}
            />
            <DropZone
              title="Values"
              description="Values to show"
              fields={chart.yAxis || []}
              onAddField={(field) => handleAddToAxis('yAxis', field)}
              onRemoveField={(fieldId) => handleRemoveFromAxis('yAxis', fieldId)}
              acceptedTypes={['measure']}
            />
          </>
        )}

        {/* Color */}
        <DropZone
          title="Color"
          description="Group by color (optional)"
          fields={chart.color || []}
          onAddField={(field) => handleAddToAxis('color', field)}
          onRemoveField={(fieldId) => handleRemoveFromAxis('color', fieldId)}
          acceptedTypes={['dimension']}
        />
      </div>

      {/* Chart Preview */}
      <Card className="bg-gray-900/50 border-green-500/30">
        <CardHeader className="p-3 md:p-4 pb-2 md:pb-3">
          <CardTitle className="text-green-300 text-xs md:text-sm">Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 pt-0">
          <div className="h-48 md:h-64 border border-green-500/20 rounded bg-black/20">
            <ChartRenderer 
              chart={chart} 
              dataFields={dataFields} 
              className="p-2"
            />
          </div>
          
          {/* Show current configuration */}
          {(chart.xAxis?.length || chart.yAxis?.length) && (
            <div className="mt-3 text-center">
              <div className="text-green-300/60 text-xs space-y-1">
                {chart.xAxis && chart.xAxis.length > 0 && (
                  <div className="truncate">X: {chart.xAxis.map(f => f.name).join(', ')}</div>
                )}
                {chart.yAxis && chart.yAxis.length > 0 && (
                  <div className="truncate">Y: {chart.yAxis.map(f => f.name).join(', ')}</div>
                )}
                {chart.color && chart.color.length > 0 && (
                  <div className="truncate">Color: {chart.color.map(f => f.name).join(', ')}</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}