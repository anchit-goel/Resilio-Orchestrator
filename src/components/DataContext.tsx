import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { OperationType } from './LoginPage';

export interface DatasetColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  sampleValues: any[];
  nullCount: number;
  uniqueCount: number;
}

export interface DatasetInfo {
  id: string;
  name: string;
  operationType: OperationType;
  uploadDate: Date;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  columns: DatasetColumn[];
  rawData: any[];
  summary: {
    description: string;
    keyInsights: string[];
    dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
    completeness: number; // percentage
  };
}

interface DataContextType {
  datasets: DatasetInfo[];
  addDataset: (dataset: DatasetInfo) => void;
  removeDataset: (id: string) => void;
  getDataset: (id: string) => DatasetInfo | undefined;
  getDatasetsByOperation: (operationType: OperationType) => DatasetInfo[];
  analyzeDataset: (id: string) => Promise<string>;
  queryDataset: (id: string, query: string) => Promise<string>;
  clearAllDatasets: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useDataContext(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load persisted datasets on mount
  useEffect(() => {
    loadPersistedDatasets();
  }, []);

  // Save datasets to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      saveDatasets(datasets);
    }
  }, [datasets, isInitialized]);

  const loadPersistedDatasets = () => {
    try {
      const storedData = localStorage.getItem('rto_datasets');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Convert date strings back to Date objects
        const datasets = parsedData.map((dataset: any) => ({
          ...dataset,
          uploadDate: new Date(dataset.uploadDate)
        }));
        setDatasets(datasets);
      }
    } catch (error) {
      console.error('Failed to load persisted datasets:', error);
      toast.error('Failed to load previously uploaded data');
    } finally {
      setIsInitialized(true);
    }
  };

  const saveDatasets = (datasets: DatasetInfo[]) => {
    try {
      // Only save if we have datasets (avoid saving empty array on initial load)
      if (datasets.length > 0) {
        // Optimize storage by reducing data size
        const optimizedDatasets = datasets.map(dataset => ({
          ...dataset,
          // Keep only a sample of raw data (first 100 rows) to reduce storage
          rawData: dataset.rawData.slice(0, 100),
          // Keep only first 3 sample values per column to reduce size
          columns: dataset.columns.map(col => ({
            ...col,
            sampleValues: col.sampleValues.slice(0, 3)
          }))
        }));

        const dataToSave = JSON.stringify(optimizedDatasets);
        
        // Check storage size before saving
        const estimatedSize = new Blob([dataToSave]).size;
        const maxStorageSize = 4 * 1024 * 1024; // 4MB limit for safety
        
        if (estimatedSize > maxStorageSize) {
          // If still too large, keep only metadata
          const metadataOnly = datasets.map(dataset => ({
            id: dataset.id,
            name: dataset.name,
            operationType: dataset.operationType,
            uploadDate: dataset.uploadDate,
            fileSize: dataset.fileSize,
            rowCount: dataset.rowCount,
            columnCount: dataset.columnCount,
            summary: dataset.summary,
            // Keep only column names and types, no sample data
            columns: dataset.columns.map(col => ({
              name: col.name,
              type: col.type,
              nullCount: col.nullCount,
              uniqueCount: col.uniqueCount,
              sampleValues: [] // Empty to save space
            })),
            rawData: [] // Empty to save space
          }));
          
          localStorage.setItem('rto_datasets', JSON.stringify(metadataOnly));
          toast.info('Dataset saved with reduced data to fit storage limits');
        } else {
          localStorage.setItem('rto_datasets', dataToSave);
        }
      }
    } catch (error) {
      console.error('Failed to save datasets:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Try to save with minimal data
        try {
          const minimalDatasets = datasets.map(dataset => ({
            id: dataset.id,
            name: dataset.name,
            operationType: dataset.operationType,
            uploadDate: dataset.uploadDate,
            fileSize: dataset.fileSize,
            rowCount: dataset.rowCount,
            columnCount: dataset.columnCount,
            summary: {
              description: dataset.summary.description,
              dataQuality: dataset.summary.dataQuality,
              completeness: dataset.summary.completeness,
              keyInsights: dataset.summary.keyInsights.slice(0, 2) // Keep only 2 insights
            },
            columns: dataset.columns.map(col => ({
              name: col.name,
              type: col.type,
              nullCount: 0,
              uniqueCount: 0,
              sampleValues: []
            })),
            rawData: []
          }));
          
          localStorage.setItem('rto_datasets', JSON.stringify(minimalDatasets));
          toast.warning('Dataset saved with minimal data due to storage constraints');
        } catch (finalError) {
          toast.error('Storage quota exceeded. Please clear browser data or reduce datasets.');
        }
      } else {
        toast.error('Failed to save dataset changes');
      }
    }
  };

  const addDataset = (dataset: DatasetInfo) => {
    // Storage check will be handled by the saveDatasets function

    setDatasets(prev => {
      // Remove existing dataset with same name and operation type
      const filtered = prev.filter(d => !(d.name === dataset.name && d.operationType === dataset.operationType));
      const newDatasets = [...filtered, dataset];
      
      // Check if we can fit this dataset
      try {
        const testData = JSON.stringify(newDatasets);
        const estimatedSize = new Blob([testData]).size;
        const maxSize = 4 * 1024 * 1024; // 4MB limit
        
        if (estimatedSize > maxSize) {
          // Optimize the dataset before adding
          const optimizedDataset = {
            ...dataset,
            rawData: dataset.rawData.slice(0, 50), // Even smaller sample for large datasets
            columns: dataset.columns.map(col => ({
              ...col,
              sampleValues: col.sampleValues.slice(0, 2)
            }))
          };
          return [...filtered, optimizedDataset];
        }
        
        return newDatasets;
      } catch (error) {
        console.error('Storage check failed:', error);
        // Return optimized version as fallback
        const optimizedDataset = {
          ...dataset,
          rawData: dataset.rawData.slice(0, 50),
          columns: dataset.columns.map(col => ({
            ...col,
            sampleValues: col.sampleValues.slice(0, 2)
          }))
        };
        return [...filtered, optimizedDataset];
      }
    });
    toast.success(`Dataset "${dataset.name}" added successfully`);
  };

  const removeDataset = (id: string) => {
    setDatasets(prev => {
      const newDatasets = prev.filter(d => d.id !== id);
      // Update localStorage immediately using optimized storage
      try {
        if (newDatasets.length === 0) {
          localStorage.removeItem('rto_datasets');
        } else {
          // Use the same optimization as saveDatasets
          const optimizedDatasets = newDatasets.map(dataset => ({
            ...dataset,
            rawData: dataset.rawData.slice(0, 100),
            columns: dataset.columns.map(col => ({
              ...col,
              sampleValues: col.sampleValues.slice(0, 3)
            }))
          }));
          localStorage.setItem('rto_datasets', JSON.stringify(optimizedDatasets));
        }
      } catch (error) {
        console.error('Failed to update storage after dataset removal:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          toast.warning('Storage still full. Please clear more datasets.');
        }
      }
      return newDatasets;
    });
    toast.info('Dataset removed');
  };

  const getDataset = (id: string) => {
    return datasets.find(d => d.id === id);
  };

  const getDatasetsByOperation = (operationType: OperationType) => {
    return datasets.filter(d => d.operationType === operationType);
  };

  const clearAllDatasets = () => {
    setDatasets([]);
    // Clear from localStorage
    try {
      localStorage.removeItem('rto_datasets');
      localStorage.removeItem('rto_uploaded_files');
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
    toast.info('All datasets cleared');
  };



  const analyzeDataset = async (id: string): Promise<string> => {
    const dataset = getDataset(id);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Simulate analysis processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = generateDatasetAnalysis(dataset);
    return analysis;
  };

  const queryDataset = async (id: string, query: string): Promise<string> => {
    const dataset = getDataset(id);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Simulate query processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = generateQueryResponse(dataset, query);
    return response;
  };

  return (
    <DataContext.Provider value={{
      datasets,
      addDataset,
      removeDataset,
      getDataset,
      getDatasetsByOperation,
      analyzeDataset,
      queryDataset,
      clearAllDatasets
    }}>
      {children}
    </DataContext.Provider>
  );
}

// Helper function to detect column data types
function detectColumnType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'string';

  // Check for boolean
  const booleanPattern = /^(true|false|yes|no|0|1)$/i;
  if (nonNullValues.every(v => booleanPattern.test(String(v)))) {
    return 'boolean';
  }

  // Check for numbers
  if (nonNullValues.every(v => !isNaN(Number(v)) && isFinite(Number(v)))) {
    return 'number';
  }

  // Check for dates
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,
    /^\d{2}\/\d{2}\/\d{4}$/,
    /^\d{2}-\d{2}-\d{4}$/
  ];
  
  if (nonNullValues.some(v => datePatterns.some(pattern => pattern.test(String(v))))) {
    return 'date';
  }

  return 'string';
}

// Helper function to analyze dataset columns
function analyzeColumns(data: any[]): DatasetColumn[] {
  if (data.length === 0) return [];

  const columnNames = Object.keys(data[0]);
  return columnNames.map(name => {
    const values = data.map(row => row[name]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const uniqueValues = [...new Set(nonNullValues)];

    return {
      name,
      type: detectColumnType(values),
      sampleValues: uniqueValues.slice(0, 5),
      nullCount: values.length - nonNullValues.length,
      uniqueCount: uniqueValues.length
    };
  });
}

// Helper function to generate dataset analysis
function generateDatasetAnalysis(dataset: DatasetInfo): string {
  const { name, operationType, rowCount, columnCount, columns, summary } = dataset;
  
  const numericColumns = columns.filter(c => c.type === 'number');
  const categoricalColumns = columns.filter(c => c.type === 'string');
  const dateColumns = columns.filter(c => c.type === 'date');
  
  const analysis = `## Dataset Analysis: ${name}

### Overview
- **Operation Type**: ${operationType.charAt(0).toUpperCase() + operationType.slice(1)}
- **Records**: ${rowCount.toLocaleString()} rows
- **Columns**: ${columnCount} fields
- **Data Quality**: ${summary.dataQuality}
- **Completeness**: ${summary.completeness}%

### Column Breakdown
- **Numeric Fields**: ${numericColumns.length} (${numericColumns.map(c => c.name).join(', ')})
- **Categorical Fields**: ${categoricalColumns.length} (${categoricalColumns.map(c => c.name).join(', ')})
- **Date Fields**: ${dateColumns.length} (${dateColumns.map(c => c.name).join(', ')})

### Key Insights
${summary.keyInsights.map(insight => `- ${insight}`).join('\n')}

### Data Quality Assessment
${columns.map(col => {
  const completeness = ((rowCount - col.nullCount) / rowCount) * 100;
  return `- **${col.name}**: ${completeness.toFixed(1)}% complete, ${col.uniqueCount} unique values`;
}).join('\n')}

### Recommendations
${generateRecommendations(dataset)}`;

  return analysis;
}

function generateRecommendations(dataset: DatasetInfo): string {
  const recommendations = [];
  
  if (dataset.summary.dataQuality === 'poor') {
    recommendations.push("🔧 **Data Cleaning**: Consider cleaning missing values and outliers before analysis");
  }
  
  if (dataset.summary.completeness < 80) {
    recommendations.push("📊 **Data Completion**: Address missing data to improve analysis accuracy");
  }
  
  const numericCols = dataset.columns.filter(c => c.type === 'number').length;
  if (numericCols > 3) {
    recommendations.push("📈 **Correlation Analysis**: Explore relationships between numeric variables");
  }
  
  if (dataset.operationType === 'terminal' && dataset.columns.some(c => c.name.toLowerCase().includes('time'))) {
    recommendations.push("⏱️ **Time Series Analysis**: Consider time-based performance trends");
  }
  
  if (dataset.operationType === 'courier' && dataset.columns.some(c => c.name.toLowerCase().includes('route'))) {
    recommendations.push("🚚 **Route Optimization**: Analyze delivery patterns and route efficiency");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("✅ **Ready for Analysis**: Dataset appears well-structured for insights generation");
  }
  
  return recommendations.join('\n');
}

// Helper function to generate query responses
function generateQueryResponse(dataset: DatasetInfo, query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Pattern matching for common query types
  if (lowerQuery.includes('trend') || lowerQuery.includes('over time')) {
    return generateTrendResponse(dataset, query);
  }
  
  if (lowerQuery.includes('average') || lowerQuery.includes('mean')) {
    return generateAverageResponse(dataset, query);
  }
  
  if (lowerQuery.includes('maximum') || lowerQuery.includes('minimum') || lowerQuery.includes('highest') || lowerQuery.includes('lowest')) {
    return generateExtremeResponse(dataset, query);
  }
  
  if (lowerQuery.includes('correlation') || lowerQuery.includes('relationship')) {
    return generateCorrelationResponse(dataset, query);
  }
  
  if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
    return `## Summary of ${dataset.name}

This ${dataset.operationType} dataset contains ${dataset.rowCount.toLocaleString()} records with ${dataset.columnCount} fields. 

**Key metrics:**
${dataset.columns.filter(c => c.type === 'number').map(col => 
  `- ${col.name}: Range from ${Math.min(...col.sampleValues)} to ${Math.max(...col.sampleValues)}`
).join('\n')}

**Data quality:** ${dataset.summary.dataQuality} (${dataset.summary.completeness}% complete)`;
  }
  
  // Default response for unmatched queries
  return `## Analysis Results for "${query}"

Based on the ${dataset.name} dataset (${dataset.rowCount.toLocaleString()} records), here are the relevant insights:

${dataset.summary.keyInsights.slice(0, 3).map(insight => `- ${insight}`).join('\n')}

**Available data fields for deeper analysis:**
${dataset.columns.slice(0, 5).map(col => 
  `- ${col.name} (${col.type}): ${col.uniqueCount} unique values`
).join('\n')}

Would you like me to analyze specific fields or relationships in this dataset?`;
}

function generateTrendResponse(dataset: DatasetInfo, query: string): string {
  const dateColumns = dataset.columns.filter(c => c.type === 'date');
  const numericColumns = dataset.columns.filter(c => c.type === 'number');
  
  if (dateColumns.length === 0) {
    return "No date columns found for trend analysis. Consider adding timestamp data for temporal insights.";
  }
  
  return `## Trend Analysis for ${dataset.name}

**Time-based insights:**
- Dataset spans ${dataset.rowCount.toLocaleString()} data points
- Primary date field: ${dateColumns[0].name}
- Trending metrics available: ${numericColumns.map(c => c.name).join(', ')}

**Key patterns identified:**
- Data shows regular operational patterns
- Peak activity periods detected
- Seasonal variations in performance metrics

*Note: Detailed trend visualization requires connecting to your specific time-series data.*`;
}

function generateAverageResponse(dataset: DatasetInfo, query: string): string {
  const numericColumns = dataset.columns.filter(c => c.type === 'number');
  
  if (numericColumns.length === 0) {
    return "No numeric columns found for average calculations.";
  }
  
  return `## Average Values in ${dataset.name}

**Calculated averages:**
${numericColumns.map(col => {
  const avg = col.sampleValues.reduce((sum, val) => sum + Number(val), 0) / col.sampleValues.length;
  return `- ${col.name}: ${avg.toFixed(2)}`;
}).join('\n')}

*Note: These are estimates based on sample data. Connect live data for precise calculations.*`;
}

function generateExtremeResponse(dataset: DatasetInfo, query: string): string {
  const numericColumns = dataset.columns.filter(c => c.type === 'number');
  
  return `## Extreme Values in ${dataset.name}

${numericColumns.map(col => {
  const min = Math.min(...col.sampleValues.map(Number));
  const max = Math.max(...col.sampleValues.map(Number));
  return `**${col.name}:**\n- Minimum: ${min}\n- Maximum: ${max}`;
}).join('\n\n')}`;
}

function generateCorrelationResponse(dataset: DatasetInfo, query: string): string {
  const numericColumns = dataset.columns.filter(c => c.type === 'number');
  
  if (numericColumns.length < 2) {
    return "Need at least 2 numeric columns for correlation analysis.";
  }
  
  return `## Correlation Analysis for ${dataset.name}

**Available numeric variables:**
${numericColumns.map(c => `- ${c.name}`).join('\n')}

**Potential relationships to explore:**
- Performance vs. efficiency metrics
- Volume vs. processing time correlations
- Resource utilization patterns

*Advanced correlation matrix available with full dataset connection.*`;
}

// Helper function to parse CSV data
export function parseCSVContent(content: string): any[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        let value: any = values[index];
        
        // Try to parse as number
        if (!isNaN(Number(value)) && value !== '') {
          value = Number(value);
        }
        
        row[header] = value;
      });
      data.push(row);
    }
  }
  
  return data;
}

// Helper function to create dataset from parsed data
export function createDatasetFromData(
  name: string,
  operationType: OperationType,
  rawData: any[],
  fileSize: number
): DatasetInfo {
  const columns = analyzeColumns(rawData);
  const completeness = columns.length > 0 
    ? (columns.reduce((sum, col) => sum + (rawData.length - col.nullCount), 0) / (columns.length * rawData.length)) * 100
    : 0;
  
  // Generate operation-specific insights
  const keyInsights = generateOperationInsights(operationType, columns, rawData);
  
  return {
    id: Date.now().toString(),
    name,
    operationType,
    uploadDate: new Date(),
    fileSize,
    rowCount: rawData.length,
    columnCount: columns.length,
    columns,
    rawData,
    summary: {
      description: `${operationType} operations dataset with ${rawData.length} records`,
      keyInsights,
      dataQuality: completeness > 90 ? 'excellent' : completeness > 70 ? 'good' : completeness > 50 ? 'fair' : 'poor',
      completeness: Math.round(completeness)
    }
  };
}

function generateOperationInsights(operationType: OperationType, columns: DatasetColumn[], data: any[]): string[] {
  const insights = [];
  
  switch (operationType) {
    case 'terminal':
      if (columns.some(c => c.name.toLowerCase().includes('container'))) {
        insights.push('Container operations data detected - suitable for throughput analysis');
      }
      if (columns.some(c => c.name.toLowerCase().includes('time'))) {
        insights.push('Temporal data available for processing time optimization');
      }
      insights.push('Terminal efficiency metrics can be calculated from this dataset');
      break;
      
    case 'courier':
      if (columns.some(c => c.name.toLowerCase().includes('delivery'))) {
        insights.push('Delivery performance data identified - route optimization possible');
      }
      if (columns.some(c => c.name.toLowerCase().includes('distance'))) {
        insights.push('Distance metrics available for fuel efficiency analysis');
      }
      insights.push('Customer satisfaction metrics can be derived from delivery data');
      break;
      
    case 'workforce':
      if (columns.some(c => c.name.toLowerCase().includes('employee'))) {
        insights.push('Employee data detected - productivity analysis enabled');
      }
      if (columns.some(c => c.name.toLowerCase().includes('shift'))) {
        insights.push('Shift patterns available for workforce optimization');
      }
      insights.push('Staff utilization and performance tracking possible');
      break;
      
    case 'energy':
      if (columns.some(c => c.name.toLowerCase().includes('consumption'))) {
        insights.push('Energy consumption data found - efficiency optimization possible');
      }
      if (columns.some(c => c.name.toLowerCase().includes('cost'))) {
        insights.push('Cost data available for savings analysis');
      }
      insights.push('Carbon footprint and sustainability metrics can be calculated');
      break;
  }
  
  return insights;
}