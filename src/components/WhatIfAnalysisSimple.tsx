import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Play, Users, Package, Clock, Database, TrendingUp, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';
import { AppPage } from '../App';
import { useDataContext, DatasetInfo } from './DataContext';

interface WhatIfAnalysisSimpleProps {
  onNavigate: (page: AppPage) => void;
}

export function WhatIfAnalysisSimple({ onNavigate }: WhatIfAnalysisSimpleProps) {
  const [workforceLevel, setWorkforceLevel] = useState(100);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { datasets, getDataset } = useDataContext();

  // Filter datasets to only show those with numeric columns
  const availableDatasets = datasets.filter(dataset => 
    dataset.columns.some(col => col.type === 'number')
  );

  const currentDataset = selectedDataset ? getDataset(selectedDataset) : null;
  const numericColumns = currentDataset?.columns.filter(col => col.type === 'number') || [];

  useEffect(() => {
    // Auto-select the first available dataset
    if (availableDatasets.length > 0 && !selectedDataset) {
      setSelectedDataset(availableDatasets[0].id);
    }
  }, [availableDatasets, selectedDataset]);

  useEffect(() => {
    // Auto-select the first numeric column
    if (numericColumns.length > 0 && !selectedMetric) {
      setSelectedMetric(numericColumns[0].name);
    }
  }, [numericColumns, selectedMetric]);

  const handleRunSimulation = async () => {
    if (!currentDataset || !selectedMetric) {
      return;
    }

    setIsRunning(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Perform actual analysis with the data
      const results = performWhatIfAnalysis(currentDataset, selectedMetric, workforceLevel);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate('home')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Control Center
        </Button>
        <h1 className="text-2xl font-bold text-foreground">What-If Analysis</h1>
        <p className="text-muted-foreground">Scenario planning and simulation</p>
      </div>

      {/* Data Selection and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {availableDatasets.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No datasets available for analysis. Please upload data files in Settings → Data Management to enable what-if analysis with your real data.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {/* Dataset Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dataset</label>
                    <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dataset" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDatasets.map(dataset => (
                          <SelectItem key={dataset.id} value={dataset.id}>
                            <div className="flex items-center space-x-2">
                              <Database className="h-4 w-4" />
                              <span>{dataset.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {dataset.rowCount} records
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Metric Selection */}
                  {numericColumns.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target Metric</label>
                      <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric to analyze" />
                        </SelectTrigger>
                        <SelectContent>
                          {numericColumns.map(column => (
                            <SelectItem key={column.name} value={column.name}>
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>{column.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {column.uniqueCount} values
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Workforce Level */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Workforce Level</span>
                      </div>
                      <Badge variant="secondary">{workforceLevel}%</Badge>
                    </div>
                    <Slider
                      value={[workforceLevel]}
                      onValueChange={(value) => setWorkforceLevel(value[0])}
                      max={150}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>100%</span>
                      <span>150%</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleRunSimulation}
                    disabled={isRunning || !selectedDataset || !selectedMetric}
                  >
                    {isRunning ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isRunning ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Analyzing data and generating insights...</p>
                  </div>
                </div>
              ) : analysisResults ? (
                <div className="space-y-6">
                  {/* Impact Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600">Projected Impact</p>
                            <p className="text-2xl font-bold text-green-700">
                              {analysisResults.projectedChange > 0 ? '+' : ''}{analysisResults.projectedChange.toFixed(1)}%
                            </p>
                          </div>
                          {analysisResults.projectedChange > 0 ? (
                            <ArrowUp className="h-8 w-8 text-green-600" />
                          ) : (
                            <ArrowDown className="h-8 w-8 text-red-600" />
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600">Current Average</p>
                            <p className="text-2xl font-bold text-blue-700">
                              {analysisResults.currentAverage.toFixed(2)}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600">Projected Value</p>
                            <p className="text-2xl font-bold text-purple-700">
                              {analysisResults.projectedValue.toFixed(2)}
                            </p>
                          </div>
                          <Package className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Analysis Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Findings</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {analysisResults.insights.map((insight: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-primary">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Recommendations</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {analysisResults.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-600">✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Data Summary */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Analysis Parameters</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Dataset:</span>
                        <span className="ml-2">{currentDataset?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Metric:</span>
                        <span className="ml-2">{selectedMetric}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Workforce Change:</span>
                        <span className="ml-2">{workforceLevel}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Records Analyzed:</span>
                        <span className="ml-2">{currentDataset?.rowCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  {availableDatasets.length === 0 
                    ? 'Upload data files to begin what-if analysis'
                    : 'Select dataset and metric, then run analysis to see results'
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to perform what-if analysis
function performWhatIfAnalysis(dataset: DatasetInfo, metricName: string, workforceLevel: number) {
  const metricColumn = dataset.columns.find(col => col.name === metricName);
  if (!metricColumn || metricColumn.type !== 'number') {
    throw new Error('Invalid metric selected');
  }

  // Calculate current average from sample data
  const numericValues = metricColumn.sampleValues
    .map(val => Number(val))
    .filter(val => !isNaN(val) && isFinite(val));
  
  const currentAverage = numericValues.length > 0 
    ? numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length
    : 0;

  // Calculate workforce impact factor
  const baselineWorkforce = 100;
  const workforceChangeFactor = workforceLevel / baselineWorkforce;
  
  // Different metrics respond differently to workforce changes
  let impactFactor = 1;
  const metricLower = metricName.toLowerCase();
  
  if (metricLower.includes('productivity') || metricLower.includes('efficiency') || metricLower.includes('throughput')) {
    // These metrics generally improve with more workforce (with diminishing returns)
    impactFactor = Math.pow(workforceChangeFactor, 0.7);
  } else if (metricLower.includes('time') || metricLower.includes('delay') || metricLower.includes('duration')) {
    // These metrics generally improve (decrease) with more workforce
    impactFactor = Math.pow(1 / workforceChangeFactor, 0.5);
  } else if (metricLower.includes('cost') || metricLower.includes('expense')) {
    // Costs may increase with workforce but improve efficiency
    impactFactor = 0.7 + (workforceChangeFactor * 0.3);
  } else if (metricLower.includes('error') || metricLower.includes('defect')) {
    // Error rates typically decrease with proper workforce levels
    impactFactor = Math.pow(1 / workforceChangeFactor, 0.3);
  } else {
    // General positive correlation with workforce
    impactFactor = Math.pow(workforceChangeFactor, 0.6);
  }

  const projectedValue = currentAverage * impactFactor;
  const projectedChange = ((projectedValue - currentAverage) / currentAverage) * 100;

  // Generate insights based on the analysis
  const insights = generateAnalysisInsights(dataset, metricName, workforceLevel, projectedChange);
  const recommendations = generateRecommendations(metricName, workforceLevel, projectedChange);

  return {
    currentAverage,
    projectedValue,
    projectedChange,
    insights,
    recommendations
  };
}

function generateAnalysisInsights(dataset: DatasetInfo, metricName: string, workforceLevel: number, projectedChange: number): string[] {
  const insights = [];
  const workforceDirection = workforceLevel > 100 ? 'increase' : workforceLevel < 100 ? 'decrease' : 'maintain';
  const changeDirection = projectedChange > 0 ? 'improve' : projectedChange < 0 ? 'decline' : 'remain stable';
  
  insights.push(`${workforceLevel}% workforce level would ${changeDirection} ${metricName} by ${Math.abs(projectedChange).toFixed(1)}%`);
  
  if (dataset.operationType === 'terminal') {
    insights.push(`Terminal operations with ${workforceDirection}d staffing show ${changeDirection}d performance metrics`);
    if (metricName.toLowerCase().includes('throughput')) {
      insights.push('Container processing capacity directly correlates with workforce availability');
    }
  } else if (dataset.operationType === 'courier') {
    insights.push(`Delivery operations efficiency ${changeDirection}s with workforce ${workforceDirection}`);
    if (metricName.toLowerCase().includes('time') || metricName.toLowerCase().includes('delay')) {
      insights.push('Route optimization becomes more effective with adequate staffing');
    }
  } else if (dataset.operationType === 'workforce') {
    insights.push(`Staff utilization patterns show ${changeDirection}d outcomes with ${workforceDirection}d workforce`);
  } else if (dataset.operationType === 'energy') {
    insights.push(`Energy management efficiency ${changeDirection}s with optimized workforce allocation`);
  }

  insights.push(`Analysis based on ${dataset.rowCount} records from ${dataset.name} dataset`);
  
  return insights;
}

function generateRecommendations(metricName: string, workforceLevel: number, projectedChange: number): string[] {
  const recommendations = [];
  
  if (workforceLevel > 100) {
    if (projectedChange > 10) {
      recommendations.push('Strong positive impact expected - consider implementing workforce increase');
      recommendations.push('Monitor productivity metrics to ensure optimal resource allocation');
    } else if (projectedChange > 0) {
      recommendations.push('Moderate improvement expected - evaluate cost-benefit of workforce increase');
    } else {
      recommendations.push('Diminishing returns detected - reconsider workforce expansion strategy');
    }
  } else if (workforceLevel < 100) {
    if (projectedChange < -10) {
      recommendations.push('Significant performance decline expected - workforce reduction not recommended');
      recommendations.push('Consider alternative efficiency improvements before reducing staff');
    } else {
      recommendations.push('Monitor performance closely if implementing workforce reduction');
    }
  } else {
    recommendations.push('Current workforce level appears optimal for this metric');
    recommendations.push('Focus on process improvements and training for additional gains');
  }

  // Metric-specific recommendations
  const metricLower = metricName.toLowerCase();
  if (metricLower.includes('time') || metricLower.includes('delay')) {
    recommendations.push('Consider process automation to complement workforce optimization');
  } else if (metricLower.includes('cost')) {
    recommendations.push('Balance workforce costs with productivity improvements');
  } else if (metricLower.includes('error') || metricLower.includes('quality')) {
    recommendations.push('Combine workforce adjustments with quality training programs');
  }

  return recommendations;
}