import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface ActivityLog {
  id: string;
  timestamp: Date;
  action: string;
  page: string;
  details: string;
  aiProcessing?: {
    analyzed: string[];
    predictions: string[];
    insights: string[];
    dataProcessed: string;
  };
}

interface ActivityContextType {
  activities: ActivityLog[];
  logActivity: (action: string, page: string, details: string, aiProcessing?: ActivityLog['aiProcessing']) => void;
  getAISummary: () => {
    totalActivities: number;
    pagesAnalyzed: string[];
    predictionsGenerated: number;
    insightsProvided: number;
    dataProcessed: string[];
  };
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityMonitorProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<ActivityLog[]>([
    // Mock initial data to show AI activity
    {
      id: '1',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      action: 'Page Navigation',
      page: 'Control Center',
      details: 'User accessed Control Center dashboard',
      aiProcessing: {
        analyzed: ['Terminal status', 'Performance metrics', 'User personas'],
        predictions: ['Terminal A efficiency will increase by 12%', 'Peak usage expected at 2PM'],
        insights: ['Dock 3 shows highest throughput', 'Weather impact minimal today'],
        dataProcessed: 'Real-time terminal metrics, historical performance data'
      }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      action: 'Dashboard Interaction',
      page: 'Dashboard Builder',
      details: 'User created new analytics widget',
      aiProcessing: {
        analyzed: ['Widget configuration', 'Data source selection', 'Visualization preferences'],
        predictions: ['Widget will be most useful for morning shifts', 'Data refresh rate optimal at 5 minutes'],
        insights: ['Similar widgets show 89% user engagement', 'Recommended chart type: Line graph'],
        dataProcessed: 'User preferences, widget performance analytics'
      }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      action: 'Simulation Run',
      page: 'Simulator',
      details: 'User initiated day-in-the-life simulation',
      aiProcessing: {
        analyzed: ['Current terminal state', 'Weather conditions', 'Resource allocation'],
        predictions: ['Simulation shows 94% operational efficiency', 'Bottleneck at Gate 7 around 11AM'],
        insights: ['Recommend increasing staff by 15% during peak hours', 'Dock rotation strategy effective'],
        dataProcessed: 'Historical operations data, current resource status, weather API'
      }
    }
  ]);

  const logActivity = useCallback((action: string, page: string, details: string, aiProcessing?: ActivityLog['aiProcessing']) => {
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      page,
      details,
      aiProcessing: aiProcessing || {
        analyzed: [`${page} interaction patterns`, 'User behavior data'],
        predictions: [`Action completion probability: ${Math.floor(Math.random() * 20 + 80)}%`],
        insights: [`User ${action.toLowerCase()} efficiency improved`, 'Pattern matches successful workflows'],
        dataProcessed: 'User interaction metrics, page analytics'
      }
    };

    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  }, []);

  const getAISummary = useCallback(() => {
    const pagesAnalyzed = [...new Set(activities.map(a => a.page))];
    const predictionsGenerated = activities.reduce((count, activity) => 
      count + (activity.aiProcessing?.predictions.length || 0), 0
    );
    const insightsProvided = activities.reduce((count, activity) => 
      count + (activity.aiProcessing?.insights.length || 0), 0
    );
    const dataProcessed = [...new Set(activities.flatMap(a => a.aiProcessing?.dataProcessed || []))];

    return {
      totalActivities: activities.length,
      pagesAnalyzed,
      predictionsGenerated,
      insightsProvided,
      dataProcessed
    };
  }, [activities]);

  return (
    <ActivityContext.Provider value={{ activities, logActivity, getAISummary }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivityMonitor() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityMonitor must be used within an ActivityMonitorProvider');
  }
  return context;
}