import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useActivityMonitor } from './ActivityMonitor';
import { 
  ArrowLeft,
  Brain,
  BarChart3,
  Lightbulb,
  Clock,
  Database,
  TrendingUp,
  Eye,
  Zap,
  Activity,
  Download
} from 'lucide-react';

interface AIActivityReportProps {
  onBack: () => void;
}

export function AIActivityReport({ onBack }: AIActivityReportProps) {
  const { activities, getAISummary } = useActivityMonitor();
  const aiSummary = getAISummary();

  const [selectedTab, setSelectedTab] = useState('overview');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const allPredictions = activities.flatMap((a, activityIndex) => 
    (a.aiProcessing?.predictions || []).map((p, predictionIndex) => ({
      prediction: p,
      timestamp: a.timestamp,
      page: a.page,
      activityId: a.id,
      uniqueId: `${a.id}-prediction-${predictionIndex}`
    }))
  );

  const allInsights = activities.flatMap((a, activityIndex) => 
    (a.aiProcessing?.insights || []).map((i, insightIndex) => ({
      insight: i,
      timestamp: a.timestamp,
      page: a.page,
      activityId: a.id,
      uniqueId: `${a.id}-insight-${insightIndex}`
    }))
  );

  const allAnalyzed = activities.flatMap((a, activityIndex) => 
    (a.aiProcessing?.analyzed || []).map((analyzed, analyzedIndex) => ({
      item: analyzed,
      timestamp: a.timestamp,
      page: a.page,
      activityId: a.id,
      uniqueId: `${a.id}-analyzed-${analyzedIndex}`
    }))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-foreground">AI Activity Report</h1>
              <p className="text-muted-foreground text-sm">Detailed analysis of AI monitoring and processing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6 pb-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{aiSummary.totalActivities}</p>
                  <p className="text-xs text-muted-foreground">Activities Monitored</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{aiSummary.pagesAnalyzed.length}</p>
                  <p className="text-xs text-muted-foreground">Pages Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{aiSummary.predictionsGenerated}</p>
                  <p className="text-xs text-muted-foreground">Predictions Made</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{aiSummary.insightsProvided}</p>
                  <p className="text-xs text-muted-foreground">Insights Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pages Analyzed Overview */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Pages Analyzed</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {aiSummary.pagesAnalyzed.map((page, index) => (
                <Badge key={`page-analyzed-${page}-${index}`} variant="secondary" className="text-xs">
                  {page}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <div className="border-b border-border">
                <TabsList className="grid w-full grid-cols-4 bg-transparent">
                  <TabsTrigger value="overview" className="text-xs cursor-pointer hover:bg-muted/60 transition-colors">Overview</TabsTrigger>
                  <TabsTrigger value="predictions" className="text-xs cursor-pointer hover:bg-muted/60 transition-colors">Predictions</TabsTrigger>
                  <TabsTrigger value="insights" className="text-xs cursor-pointer hover:bg-muted/60 transition-colors">Insights</TabsTrigger>
                  <TabsTrigger value="analyzed" className="text-xs cursor-pointer hover:bg-muted/60 transition-colors">Analyzed</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-4 mt-0">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">Recent Activity Timeline</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {activities.slice(0, 10).map((activity) => (
                        <div key={`activity-overview-${activity.id}-${activity.timestamp.getTime()}`} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="outline" className="text-xs">{activity.page}</Badge>
                              <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                            </div>
                            <p className="text-sm text-foreground">{activity.action}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                            {activity.aiProcessing && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                <Badge className="text-xs bg-green-100 text-green-700">
                                  {activity.aiProcessing.analyzed.length} analyzed
                                </Badge>
                                <Badge className="text-xs bg-blue-100 text-blue-700">
                                  {activity.aiProcessing.predictions.length} predictions
                                </Badge>
                                <Badge className="text-xs bg-yellow-100 text-yellow-700">
                                  {activity.aiProcessing.insights.length} insights
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="p-4 mt-0">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">AI Predictions Generated</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {allPredictions.map((item) => (
                        <div key={item.uniqueId} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <Badge variant="outline" className="text-xs">{item.page}</Badge>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(item.timestamp)}</span>
                          </div>
                          <p className="text-sm text-foreground">{item.prediction}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="p-4 mt-0">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">AI Insights Provided</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {allInsights.map((item) => (
                        <div key={item.uniqueId} className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                            <Badge variant="outline" className="text-xs">{item.page}</Badge>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(item.timestamp)}</span>
                          </div>
                          <p className="text-sm text-foreground">{item.insight}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="analyzed" className="p-4 mt-0">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">Data Analyzed by AI</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {allAnalyzed.map((item) => (
                        <div key={item.uniqueId} className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <Badge variant="outline" className="text-xs">{item.page}</Badge>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(item.timestamp)}</span>
                          </div>
                          <p className="text-sm text-foreground">{item.item}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">Export AI Report</h3>
                <p className="text-xs text-muted-foreground">Download detailed AI activity and insights report</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="hover:bg-accent transition-colors cursor-pointer"
                onClick={() => {
                  // Handle export functionality
                  console.log('Exporting AI report...');
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}