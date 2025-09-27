import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  Building2, 
  Truck, 
  Users, 
  Zap,
  ChevronDown
} from 'lucide-react';
import { OperationType } from './LoginPage';

interface OperationSwitcherProps {
  currentOperation: OperationType;
  onOperationChange: (operation: OperationType) => void;
}

export function OperationSwitcher({ currentOperation, onOperationChange }: OperationSwitcherProps) {
  const operations = [
    {
      id: 'terminal' as OperationType,
      name: 'Terminal Operations',
      icon: Building2,
      color: 'bg-blue-500',
      description: 'Terminal management and logistics'
    },
    {
      id: 'courier' as OperationType,
      name: 'Courier Hub',
      icon: Truck,
      color: 'bg-green-500',
      description: 'Delivery and courier services'
    },
    {
      id: 'workforce' as OperationType,
      name: 'Workforce Management',
      icon: Users,
      color: 'bg-purple-500',
      description: 'Staff scheduling and management'
    },
    {
      id: 'energy' as OperationType,
      name: 'Energy Management',
      icon: Zap,
      color: 'bg-yellow-500',
      description: 'Power and energy optimization'
    }
  ];

  const currentOp = operations.find(op => op.id === currentOperation);

  return (
    <div className="bg-card border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentOp && (
              <>
                <div className={`w-8 h-8 ${currentOp.color} rounded-lg flex items-center justify-center`}>
                  <currentOp.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-medium text-sm">{currentOp.name}</h2>
                  <p className="text-xs text-muted-foreground">{currentOp.description}</p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              Active View
            </Badge>
            
            <Select value={currentOperation} onValueChange={onOperationChange}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Switch Operation" />
                <ChevronDown className="h-3 w-3 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                {operations.map((operation) => {
                  const Icon = operation.icon;
                  return (
                    <SelectItem key={operation.id} value={operation.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 ${operation.color} rounded flex items-center justify-center`}>
                          <Icon className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="text-sm">{operation.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}