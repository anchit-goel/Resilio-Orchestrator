import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Building2, 
  Truck, 
  Users, 
  Zap, 
  ArrowRight,
  Shield,
  CheckCircle
} from 'lucide-react';

export type OperationType = 'terminal' | 'courier' | 'workforce' | 'energy';

interface Operation {
  id: OperationType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  color: string;
}

interface LoginPageProps {
  onOperationSelect: (operation: OperationType) => void;
}

export function LoginPage({ onOperationSelect }: LoginPageProps) {
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null);

  const operations: Operation[] = [
    {
      id: 'terminal',
      title: 'Terminal Operations',
      description: 'Comprehensive terminal management and orchestration',
      icon: Building2,
      features: ['Control Center', 'Dashboard Builder', 'Day-in-Life Simulator', 'What-If Analysis', 'Reports'],
      color: 'from-cyan-500 to-teal-600'
    },
    {
      id: 'courier',
      title: 'Courier Hub',
      description: 'Courier services and delivery management',
      icon: Truck,
      features: ['Delivery Tracking', 'Route Optimization', 'Courier Management', 'Performance Analytics'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'workforce',
      title: 'Workforce Management',
      description: 'Employee scheduling and workforce optimization',
      icon: Users,
      features: ['Staff Scheduling', 'Performance Tracking', 'Resource Allocation', 'Team Analytics'],
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'energy',
      title: 'Energy Management',
      description: 'Energy consumption and efficiency monitoring',
      icon: Zap,
      features: ['Energy Monitoring', 'Consumption Analytics', 'Efficiency Reports', 'Cost Optimization'],
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const handleContinue = () => {
    if (selectedOperation) {
      onOperationSelect(selectedOperation);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
                Resilient Terminal Orchestrator
              </h1>
              <p className="text-muted-foreground text-sm">Enterprise Terminal Management Platform</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your operation type to access the relevant management tools and dashboards
          </p>
        </div>

        {/* Operation Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {operations.map((operation) => {
            const Icon = operation.icon;
            const isSelected = selectedOperation === operation.id;
            
            return (
              <Card 
                key={operation.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected 
                    ? 'border-primary shadow-lg scale-[1.02]' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedOperation(operation.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${operation.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{operation.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{operation.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {operation.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedOperation}
            size="lg"
            className="w-full max-w-md bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 text-white shadow-lg"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          {selectedOperation && (
            <p className="text-sm text-muted-foreground mt-2">
              Starting {operations.find(op => op.id === selectedOperation)?.title}...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>© 2024 Resilient Terminal Orchestrator • Enterprise Management Platform</p>
        </div>
      </div>
    </div>
  );
}