import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useActivityMonitor } from './ActivityMonitor';
import { useDataContext } from './DataContext';
import { apiService } from '../services/ApiService';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Brain,
  BarChart3,
  Lightbulb,
  Clock,
  ArrowRightLeft,
  Database,
  FileText,
  TrendingUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  insights?: string[];
  suggestions?: string[];
  isWorkflowSwitch?: boolean;
  datasetAnalysis?: boolean;
  isLoading?: boolean;
}

interface ChatbotInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkflowChange?: (operation: string) => void;
  currentOperation?: string;
}

export function ChatbotInterface({ isOpen, onClose, onWorkflowChange, currentOperation }: ChatbotInterfaceProps) {
  const { activities, getAISummary } = useActivityMonitor();
  const { datasets, analyzeDataset, queryDataset, getDatasetsByOperation } = useDataContext();
  
  const currentDatasets = currentOperation ? getDatasetsByOperation(currentOperation as any) : [];
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: `Hello! I'm your ${currentOperation ? currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1) : 'Terminal'} AI Assistant. I've been monitoring your activities and can provide insights, predictions, and recommendations. I can also help you switch between different operational workflows. How can I help you today?`,
      timestamp: new Date(),
      insights: [
        'Your dashboard usage has increased by 23% this week',
        'Simulation accuracy improved by 15% with recent updates',
        'I can switch workflows when you ask (e.g., "switch to courier")'
      ],
      suggestions: [
        'Try the new What-If Analysis for capacity planning',
        'Ask me to switch workflows: "change to workforce management"',
        'Check the Reports page for weekly performance summary'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDatasetQuery = (userMessage: string): ChatMessage => {
    if (currentDatasets.length === 0) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        message: `I don't see any datasets uploaded for ${currentOperation} operations yet. Upload your operational data and I'll provide detailed insights and analysis.`,
        timestamp: new Date(),
        insights: [
          'No datasets currently available for analysis',
          'Upload CSV or JSON files through the Import Data feature',
          'I can analyze any operational data relevant to your workflow'
        ],
        suggestions: [
          'Go to Settings > Import Data to upload datasets',
          'Try uploading historical performance data',
          'Ask me again after uploading your data files'
        ]
      };
    }

    // For now, return a promise-based response that will be handled by async processing
    return {
      id: Date.now().toString(),
      type: 'bot',
      message: `I'm analyzing your ${currentDatasets.length} dataset(s) for ${currentOperation} operations. Let me provide detailed insights...`,
      timestamp: new Date(),
      datasetAnalysis: true,
      isLoading: true,
      insights: [
        `Found ${currentDatasets.length} dataset(s) with ${currentDatasets.reduce((sum, d) => sum + d.rowCount, 0).toLocaleString()} total records`,
        'Performing statistical analysis and pattern detection',
        'Generating operation-specific recommendations'
      ],
      suggestions: [
        'Ask specific questions about trends or patterns',
        'Request correlations between different metrics',
        'Inquire about performance optimization opportunities'
      ]
    };
  };

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const aiSummary = getAISummary();
    const recentActivity = activities[0];

    // Check for workflow switching commands
    const workflowKeywords = {
      'terminal': ['terminal', 'terminals', 'terminal operations', 'terminal management'],
      'courier': ['courier', 'delivery', 'courier hub', 'delivery management', 'logistics'],
      'workforce': ['workforce', 'staff', 'employees', 'workforce management', 'scheduling', 'hr'],
      'energy': ['energy', 'power', 'energy management', 'utilities', 'consumption']
    };

    // Check for dataset analysis requests first
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('analyz') || lowerMessage.includes('dataset') || lowerMessage.includes('data') || 
        lowerMessage.includes('insight') || lowerMessage.includes('trend') || lowerMessage.includes('pattern')) {
      return handleDatasetQuery(userMessage);
    }

    // Check if user wants to switch workflow
    for (const [operation, keywords] of Object.entries(workflowKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(`switch to ${keyword}`) || 
            lowerMessage.includes(`change to ${keyword}`) ||
            lowerMessage.includes(`go to ${keyword}`) ||
            lowerMessage.includes(`open ${keyword}`) ||
            lowerMessage.includes(`show me ${keyword}`) ||
            (lowerMessage.includes('switch') && lowerMessage.includes(keyword)) ||
            (lowerMessage.includes('change') && lowerMessage.includes(keyword))) {
          
          if (onWorkflowChange && operation !== currentOperation) {
            // Trigger workflow change
            setTimeout(() => {
              onWorkflowChange(operation);
            }, 1500);

            return {
              id: Date.now().toString(),
              type: 'bot',
              message: `Switching to ${operation.charAt(0).toUpperCase() + operation.slice(1)} Operations workflow now. I'll take you to the ${operation} management interface.`,
              timestamp: new Date(),
              isWorkflowSwitch: true,
              insights: [
                `Detected request to switch to ${operation} operations`,
                `Current workflow: ${currentOperation || 'terminal'} → New workflow: ${operation}`,
                'Maintaining your session and preferences across workflows'
              ],
              suggestions: [
                `Explore ${operation}-specific features and dashboards`,
                'Ask me about optimization opportunities in this new workflow',
                'Use the operation switcher in the header to change workflows manually'
              ]
            };
          } else if (operation === currentOperation) {
            return {
              id: Date.now().toString(),
              type: 'bot',
              message: `You're already in the ${operation.charAt(0).toUpperCase() + operation.slice(1)} Operations workflow. How can I help you optimize your current operations?`,
              timestamp: new Date(),
              insights: [
                `Currently active in ${operation} operations mode`,
                'All features and dashboards are operation-specific',
                'AI insights are contextual to your current workflow'
              ],
              suggestions: [
                `Check the ${operation} dashboard for real-time metrics`,
                'Ask me about predictions specific to this operation type',
                'Try "switch to [operation]" to change to a different workflow'
              ]
            };
          }
        }
      }
    }

    // Generate contextual responses based on user input and recent activity
    let response = '';
    let insights: string[] = [];
    let suggestions: string[] = [];

    if (userMessage.toLowerCase().includes('status') || userMessage.toLowerCase().includes('report')) {
      response = `Based on my continuous monitoring of your ${currentOperation || 'terminal'} operations, here's your current status: I've processed ${aiSummary.totalActivities} activities across ${aiSummary.pagesAnalyzed.length} pages, generated ${aiSummary.predictionsGenerated} predictions, and provided ${aiSummary.insightsProvided} insights.`;
      insights = [
        `Most active page: ${aiSummary.pagesAnalyzed[0] || 'Control Center'}`,
        `Latest activity: ${recentActivity?.action || 'Dashboard interaction'}`,
        'All systems operating within normal parameters'
      ];
      suggestions = [
        'Review AI Activity Report in Settings for detailed analysis',
        'Consider running a new simulation with current data',
        `Switch to other workflows: "change to courier" or "switch to energy"`
      ];
    } else if (userMessage.toLowerCase().includes('predict') || userMessage.toLowerCase().includes('forecast')) {
      response = `Based on current patterns and historical data, I can provide several predictions for your ${currentOperation || 'terminal'} operations.`;
      insights = [
        'Peak efficiency expected between 10AM-2PM today',
        'Gate 7 may experience 15% higher traffic than usual',
        'Weather conditions favorable for 98% operational capacity'
      ];
      suggestions = [
        'Allocate additional staff to Gate 7 during peak hours',
        'Consider pre-positioning equipment for quick turnaround',
        'Monitor real-time metrics for any deviations'
      ];
    } else if (userMessage.toLowerCase().includes('optimize') || userMessage.toLowerCase().includes('improve')) {
      response = `I've identified several optimization opportunities based on your recent ${currentOperation || 'terminal'} activities and system analysis.`;
      insights = [
        'Dock rotation efficiency can be improved by 12%',
        'Resource allocation showing suboptimal patterns at Terminal B',
        'Communication delays detected between Operations and Logistics'
      ];
      suggestions = [
        'Implement automated dock assignment algorithm',
        'Review staff scheduling for Terminal B operations',
        'Set up real-time communication dashboard'
      ];
    } else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('what')) {
      response = `I'm here to assist with your ${currentOperation || 'terminal'} operations! I continuously monitor all your activities and can help with predictions, optimizations, and workflow management.`;
      insights = [
        'I analyze every page interaction and system usage',
        'I generate predictions based on historical and real-time data',
        'I can switch between different operational workflows on command'
      ];
      suggestions = [
        `Ask me about current ${currentOperation || 'terminal'} status and predictions`,
        'Say "switch to [operation]" to change workflows (e.g., "switch to courier")',
        'Request optimization recommendations for any operation'
      ];
    } else {
      response = `I understand you're asking about "${userMessage}". Let me analyze this in the context of your current ${currentOperation || 'terminal'} operations and recent activities.`;
      insights = [
        `Analyzed your question in context of ${recentActivity?.page || 'current operations'}`,
        'Cross-referenced with historical performance data',
        'Identified relevant operational patterns'
      ];
      suggestions = [
        'Try asking more specific questions about predictions or optimizations',
        'Use commands like "switch to workforce" to change operational views',
        'Check the What-If Analysis tool for scenario planning'
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      message: response,
      timestamp: new Date(),
      insights,
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputValue,
      timestamp: new Date()
    };

    const messageText = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to AI backend
      const response = await apiService.sendChatMessage({
        message: messageText,
        operation_type: currentOperation,
        context: {
          recent_activities: activities.slice(0, 5),
          datasets_count: currentDatasets.length
        }
      });

      // Check for workflow switching commands
      const lowerMessage = messageText.toLowerCase();
      const workflowKeywords = {
        'terminal': ['terminal', 'terminals', 'terminal operations', 'terminal management'],
        'courier': ['courier', 'delivery', 'courier hub', 'delivery management', 'logistics'],
        'workforce': ['workforce', 'staff', 'employees', 'workforce management', 'scheduling', 'hr'],
        'energy': ['energy', 'power', 'energy management', 'utilities', 'consumption']
      };

      let isWorkflowSwitch = false;
      for (const [operation, keywords] of Object.entries(workflowKeywords)) {
        for (const keyword of keywords) {
          if (lowerMessage.includes(`switch to ${keyword}`) || 
              lowerMessage.includes(`change to ${keyword}`) ||
              lowerMessage.includes(`go to ${keyword}`) ||
              (lowerMessage.includes('switch') && lowerMessage.includes(keyword))) {
            
            if (onWorkflowChange && operation !== currentOperation) {
              isWorkflowSwitch = true;
              setTimeout(() => {
                onWorkflowChange(operation);
              }, 1500);
              break;
            }
          }
        }
        if (isWorkflowSwitch) break;
      }

      const botResponse: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        message: response.response,
        timestamp: new Date(),
        insights: response.insights,
        suggestions: response.suggestions,
        isWorkflowSwitch,
        datasetAnalysis: response.data_analysis ? true : false
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to local response generation
      setTimeout(() => {
        const fallbackResponse = generateBotResponse(messageText);
        setMessages(prev => [...prev, fallbackResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-2 sm:p-4"
      onClick={(e) => {
        // Close if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className="w-full max-w-md h-[600px] max-h-[90vh] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">{currentOperation ? `${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} AI Assistant` : 'Terminal AI Assistant'}</CardTitle>
                <p className="text-xs text-muted-foreground">Continuously monitoring • Workflow switching enabled</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 p-4 overflow-hidden">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] min-w-0 ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === 'bot' ? (
                        <div className="flex items-center space-x-1">
                          <Bot className="h-4 w-4 text-primary" />
                          {message.isWorkflowSwitch && <ArrowRightLeft className="h-3 w-3 text-green-500" />}
                        </div>
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className={`rounded-lg p-3 word-wrap break-words ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : message.isWorkflowSwitch 
                          ? 'bg-green-50 border border-green-200'
                          : message.datasetAnalysis
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-muted'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.datasetAnalysis && (
                          <Database className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        )}
                        {message.isLoading && (
                          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mt-0.5 flex-shrink-0"></div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm break-words">{message.message}</p>
                          {message.isLoading && (
                            <div className="mt-2 flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-xs text-blue-600">Analyzing data...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {message.insights && message.insights.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Lightbulb className="h-3 w-3 text-yellow-500 shrink-0" />
                          <span className="text-xs text-muted-foreground">AI Insights</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {message.insights.map((insight, index) => (
                            <Badge key={`${message.id}-insight-${index}`} variant="secondary" className="text-xs break-words max-w-full whitespace-normal">
                              {insight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Brain className="h-3 w-3 text-blue-500 shrink-0" />
                          <span className="text-xs text-muted-foreground">Suggestions</span>
                        </div>
                        <div className="space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <div key={`${message.id}-suggestion-${index}`} className="text-xs text-muted-foreground bg-accent/10 rounded p-2 break-words">
                              • {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${currentOperation || 'terminal'} operations or say "switch to [operation]"...`}
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0 hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Monitoring {currentOperation || 'terminal'} operations • Try: "switch to courier" or "change to workforce"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}