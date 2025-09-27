// API service to connect with Python FastAPI backend
const API_BASE_URL = 'http://localhost:8002';

export interface ChatMessage {
  message: string;
  operation_type?: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  insights: string[];
  suggestions: string[];
  data_analysis?: Record<string, any>;
}

export interface OperationData {
  operation_type: string;
  kpis: {
    efficiency: number;
    activeUnits: number;
    uptime: number;
    alerts: number;
    throughput: number;
    errorRate: number;
    avgProcessingTime: number;
    costSavings: number;
  };
  chart_data: {
    line_chart: Array<{ name: string; value: number; efficiency: number; }>;
    bar_chart: Array<{ category: string; value: number; }>;
    pie_chart: Array<{ name: string; value: number; color: string; }>;
  };
  datasets_count: number;
  last_updated: string;
}

export class ApiService {
  private static instance: ApiService;

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Chat with AI
  async sendChatMessage(message: ChatMessage): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  // Get operation data (KPIs and charts)
  async getOperationData(operationType: string): Promise<OperationData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/operation-data/${operationType}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Operation data error:', error);
      // Return default data on error
      return this.getDefaultOperationData(operationType);
    }
  }

  // Upload files
  async uploadFiles(files: File[], operationType: string): Promise<any> {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('operation_type', operationType);

      const response = await fetch(`${API_BASE_URL}/api/upload-data`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Get datasets
  async getDatasets(operationType?: string): Promise<any> {
    try {
      const url = operationType 
        ? `${API_BASE_URL}/api/datasets?operation_type=${operationType}`
        : `${API_BASE_URL}/api/datasets`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get datasets error:', error);
      return { datasets: [] };
    }
  }

  // Delete dataset
  async deleteDataset(datasetId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Delete failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete dataset error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Default operation data fallback
  private getDefaultOperationData(operationType: string): OperationData {
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

    const kpis = defaults[operationType as keyof typeof defaults] || defaults.terminal;

    return {
      operation_type: operationType,
      kpis,
      chart_data: {
        line_chart: [
          { name: "Jan", value: 400, efficiency: 85 },
          { name: "Feb", value: 300, efficiency: 87 },
          { name: "Mar", value: 500, efficiency: 89 },
          { name: "Apr", value: 450, efficiency: 91 },
          { name: "May", value: 600, efficiency: 88 },
          { name: "Jun", value: 550, efficiency: 92 }
        ],
        bar_chart: [
          { category: "Processing", value: 65 },
          { category: "Waiting", value: 20 },
          { category: "Maintenance", value: 10 },
          { category: "Idle", value: 5 }
        ],
        pie_chart: [
          { name: "Active", value: 75, color: "#22c55e" },
          { name: "Maintenance", value: 15, color: "#f59e0b" },
          { name: "Offline", value: 10, color: "#ef4444" }
        ]
      },
      datasets_count: 0,
      last_updated: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();