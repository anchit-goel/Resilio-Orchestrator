// Updated DataService hook that uses the API backend
import { useState, useEffect, useCallback } from 'react';
import { apiService, OperationData } from '../services/ApiService';
import { OperationType } from '../components/LoginPage';

interface KPIData {
  efficiency: number;
  activeUnits: number;
  uptime: number;
  alerts: number;
  throughput: number;
  errorRate: number;
  avgProcessingTime: number;
  costSavings: number;
}

export function useDataService() {
  const [operationData, setOperationData] = useState<Record<string, OperationData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Record<string, number>>({});

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchOperationData = useCallback(async (operationType: OperationType) => {
    const now = Date.now();
    const lastFetchTime = lastFetch[operationType] || 0;
    
    // Return cached data if still fresh
    if (operationData[operationType] && (now - lastFetchTime) < CACHE_DURATION) {
      return operationData[operationType];
    }

    setIsLoading(true);
    try {
      const data = await apiService.getOperationData(operationType);
      
      setOperationData(prev => ({
        ...prev,
        [operationType]: data
      }));
      
      setLastFetch(prev => ({
        ...prev,
        [operationType]: now
      }));
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${operationType} data:`, error);
      // Return default data on error
      const defaultData = getDefaultOperationData(operationType);
      setOperationData(prev => ({
        ...prev,
        [operationType]: defaultData
      }));
      return defaultData;
    } finally {
      setIsLoading(false);
    }
  }, [operationData, lastFetch]);

  const getKPIValues = useCallback((operationType: OperationType): KPIData => {
    const data = operationData[operationType];
    if (data) {
      return data.kpis;
    }
    
    // Trigger fetch if no data available
    fetchOperationData(operationType);
    
    // Return default values while fetching
    return getDefaultKPIs(operationType);
  }, [operationData, fetchOperationData]);

  const getChartData = useCallback((operationType: OperationType, chartType: 'line' | 'bar' | 'pie' | 'area' = 'line') => {
    const data = operationData[operationType];
    if (data) {
      switch (chartType) {
        case 'line':
          return data.chart_data.line_chart;
        case 'bar':
          return data.chart_data.bar_chart;
        case 'pie':
          return data.chart_data.pie_chart;
        default:
          return data.chart_data.line_chart;
      }
    }
    
    // Trigger fetch if no data available
    fetchOperationData(operationType);
    
    // Return default chart data while fetching
    return getDefaultChartData(operationType, chartType);
  }, [operationData, fetchOperationData]);

  const hasRealData = useCallback((operationType: OperationType): boolean => {
    const data = operationData[operationType];
    return data ? data.datasets_count > 0 : false;
  }, [operationData]);

  const refreshData = useCallback(async (operationType: OperationType) => {
    // Clear cache and force refresh
    setLastFetch(prev => ({
      ...prev,
      [operationType]: 0
    }));
    
    return await fetchOperationData(operationType);
  }, [fetchOperationData]);

  // Auto-refresh data every 30 seconds for active operation
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data for operations that have been fetched
      Object.keys(operationData).forEach((operationType) => {
        fetchOperationData(operationType as OperationType);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [operationData, fetchOperationData]);

  return {
    getKPIValues,
    getChartData,
    hasRealData,
    refreshData,
    isLoading,
    fetchOperationData
  };
}

// Default KPI values for different operation types
function getDefaultKPIs(operationType: OperationType): KPIData {
  const defaults = {
    terminal: {
      efficiency: 87.5,
      activeUnits: 24,
      uptime: 96.2,
      alerts: 3,
      throughput: 1250,
      errorRate: 2.1,
      avgProcessingTime: 4.3,
      costSavings: 125000
    },
    courier: {
      efficiency: 91.2,
      activeUnits: 18,
      uptime: 94.8,
      alerts: 2,
      throughput: 890,
      errorRate: 1.8,
      avgProcessingTime: 3.7,
      costSavings: 89000
    },
    workforce: {
      efficiency: 89.1,
      activeUnits: 156,
      uptime: 97.5,
      alerts: 5,
      throughput: 2100,
      errorRate: 1.2,
      avgProcessingTime: 2.8,
      costSavings: 234000
    },
    energy: {
      efficiency: 92.8,
      activeUnits: 12,
      uptime: 98.9,
      alerts: 1,
      throughput: 3450,
      errorRate: 0.8,
      avgProcessingTime: 1.9,
      costSavings: 456000
    }
  };

  return defaults[operationType] || defaults.terminal;
}

// Default chart data
function getDefaultChartData(operationType: OperationType, chartType: 'line' | 'bar' | 'pie' | 'area') {
  const multiplier = {
    terminal: 1,
    courier: 0.7,
    workforce: 1.4,
    energy: 2.1
  }[operationType] || 1;

  switch (chartType) {
    case 'line':
      return [
        { name: "Jan", value: Math.round(400 * multiplier), efficiency: 85 },
        { name: "Feb", value: Math.round(300 * multiplier), efficiency: 87 },
        { name: "Mar", value: Math.round(500 * multiplier), efficiency: 89 },
        { name: "Apr", value: Math.round(450 * multiplier), efficiency: 91 },
        { name: "May", value: Math.round(600 * multiplier), efficiency: 88 },
        { name: "Jun", value: Math.round(550 * multiplier), efficiency: 92 }
      ];
    case 'bar':
      return [
        { category: "Processing", value: 65 },
        { category: "Waiting", value: 20 },
        { category: "Maintenance", value: 10 },
        { category: "Idle", value: 5 }
      ];
    case 'pie':
      return [
        { name: "Active", value: 75, color: "#22c55e" },
        { name: "Maintenance", value: 15, color: "#f59e0b" },
        { name: "Offline", value: 10, color: "#ef4444" }
      ];
    default:
      return [];
  }
}

function getDefaultOperationData(operationType: OperationType): OperationData {
  return {
    operation_type: operationType,
    kpis: getDefaultKPIs(operationType),
    chart_data: {
      line_chart: getDefaultChartData(operationType, 'line') as any,
      bar_chart: getDefaultChartData(operationType, 'bar') as any,
      pie_chart: getDefaultChartData(operationType, 'pie') as any
    },
    datasets_count: 0,
    last_updated: new Date().toISOString()
  };
}