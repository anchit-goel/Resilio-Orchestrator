import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChatbotInterface } from './ChatbotInterface';
import { useActivityMonitor } from './ActivityMonitor';
import { useDataContext } from './DataContext';
import { 
  MessageCircle, 
  Bot,
  Sparkles
} from 'lucide-react';

interface FloatingChatbotProps {
  onWorkflowChange?: (operation: string) => void;
  currentOperation?: string;
}

export function FloatingChatbot({ onWorkflowChange, currentOperation }: FloatingChatbotProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const { activities } = useActivityMonitor();
  const { datasets } = useDataContext();
  
  // Show notification badge for recent AI activity or new datasets
  const recentActivity = activities.length > 0 && 
    (Date.now() - activities[0].timestamp.getTime()) < 300000; // Within last 5 minutes
    
  const hasNewDatasets = datasets.length > 0;
  const showNotification = recentActivity || hasNewDatasets;

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40">
        {/* Floating Action Button Container */}
        <div className="relative group">
          {/* Pulsing ring - moved behind button and made pointer-events-none */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping pointer-events-none -z-10"></div>
          
          {/* Main Button */}
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-red-600 hover:from-primary/90 hover:to-red-600/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 relative z-10 cursor-pointer"
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>
          
          {/* Activity indicator */}
          {showNotification && (
            <div className="absolute -top-1 -right-1 z-20 pointer-events-none">
              <Badge className={`h-5 w-5 p-0 rounded-full text-xs flex items-center justify-center ${
                hasNewDatasets ? 'bg-blue-500 text-blue-50 animate-bounce' : 'bg-yellow-500 text-yellow-50 animate-pulse'
              }`}>
                <Sparkles className="h-3 w-3" />
              </Badge>
            </div>
          )}
        </div>
        
        {/* Helper tooltip - positioned to not interfere with button */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 mb-2 mr-2 pointer-events-none">
            <div className="bg-card border border-border rounded-lg p-2 shadow-lg max-w-48 transform transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-xs text-foreground">AI Assistant</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {hasNewDatasets 
                  ? `${datasets.length} datasets ready for analysis` 
                  : `Monitoring your activities • ${activities.length} insights ready`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chatbot Interface */}
      <ChatbotInterface 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onWorkflowChange={onWorkflowChange}
        currentOperation={currentOperation}
      />
    </>
  );
}