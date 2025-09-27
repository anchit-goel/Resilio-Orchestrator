import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { 
  Hash, 
  Type, 
  Calendar,
  GripVertical
} from 'lucide-react';
import { DataField } from '../DataDashboard';

interface DataFieldsPanelProps {
  dataFields: DataField[];
}

interface DraggableFieldProps {
  field: DataField;
}

function DraggableField({ field }: DraggableFieldProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'dataField',
    item: field,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getFieldIcon = (dataType: string) => {
    switch (dataType) {
      case 'number': return <Hash className="h-4 w-4" />;
      case 'string': return <Type className="h-4 w-4" />;
      case 'date': return <Calendar className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const getFieldColor = (type: string) => {
    return type === 'dimension' 
      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      : 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-800/50 border border-green-500/20 rounded-lg cursor-move hover:bg-gray-800/70 transition-colors touch-manipulation ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <GripVertical className="h-3 w-3 md:h-4 md:w-4 text-green-400/60 flex-shrink-0" />
      <div className="text-green-400 flex-shrink-0">
        {getFieldIcon(field.dataType)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-green-300 text-xs md:text-sm truncate">{field.name}</p>
        <div className="flex items-center gap-1 md:gap-2 mt-1">
          <Badge className={`text-xs ${getFieldColor(field.type)}`}>
            {field.type}
          </Badge>
          <span className="text-green-400/60 text-xs capitalize hidden md:inline">{field.dataType}</span>
        </div>
      </div>
    </div>
  );
}

export function DataFieldsPanel({ dataFields }: DataFieldsPanelProps) {
  const dimensions = dataFields.filter(field => field.type === 'dimension');
  const measures = dataFields.filter(field => field.type === 'measure');

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 md:p-4 border-b border-green-500/20">
        <h2 className="text-green-300 mb-1 text-sm md:text-base">Data Fields</h2>
        <p className="text-green-400/60 text-xs md:text-sm">Drag fields to create visualizations</p>
      </div>

      <ScrollArea className="flex-1 p-2 md:p-4">
        <div className="space-y-4 md:space-y-6">
          {/* Dimensions */}
          <div>
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <Type className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
              <h3 className="text-blue-300 text-xs md:text-sm">Dimensions</h3>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                {dimensions.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1 md:gap-2">
              {dimensions.map((field) => (
                <DraggableField key={field.id} field={field} />
              ))}
            </div>
          </div>

          {/* Measures */}
          <div>
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <Hash className="h-3 w-3 md:h-4 md:w-4 text-green-400" />
              <h3 className="text-green-300 text-xs md:text-sm">Measures</h3>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                {measures.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1 md:gap-2">
              {measures.map((field) => (
                <DraggableField key={field.id} field={field} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Instructions - Hidden on mobile to save space */}
      <div className="hidden md:block p-2 md:p-4 border-t border-green-500/20 bg-gray-900/30">
        <div className="text-green-400/60 text-xs space-y-1">
          <p>💡 Drag dimensions to group data</p>
          <p>📊 Drag measures to show values</p>
          <p>🎨 Drop on chart areas to visualize</p>
        </div>
      </div>
    </div>
  );
}