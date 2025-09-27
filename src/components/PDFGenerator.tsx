import React from 'react';
import { toast } from 'sonner';
import { 
  FileText, 
  Building2, 
  Truck, 
  Users, 
  Zap,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';
import { OperationType } from './LoginPage';

interface ReportData {
  title: string;
  operationType: OperationType;
  dateRange: string;
  notes: string;
  selectedItems: string[];
  kpiData: {
    efficiency: number;
    totalVolume: number;
    avgProcessingTime: number;
    utilization: number;
  };
}

export class PDFGenerator {
  private static getOperationConfig(operationType: OperationType) {
    const configs = {
      terminal: {
        name: 'Terminal Operations',
        color: '#0891b2',
        icon: '🏗️',
        metrics: ['Vessel Efficiency', 'Cargo Volume', 'Berth Utilization', 'Processing Time']
      },
      courier: {
        name: 'Courier Hub',
        color: '#059669', 
        icon: '🚚',
        metrics: ['Delivery Rate', 'Route Efficiency', 'Driver Performance', 'Customer Satisfaction']
      },
      workforce: {
        name: 'Workforce Management',
        color: '#7c3aed',
        icon: '👥', 
        metrics: ['Staff Utilization', 'Shift Coverage', 'Productivity', 'Training Completion']
      },
      energy: {
        name: 'Energy Management',
        color: '#ca8a04',
        icon: '⚡',
        metrics: ['Energy Efficiency', 'Cost Savings', 'Carbon Footprint', 'Equipment Performance']
      }
    };
    return configs[operationType] || configs.terminal;
  }

  private static generateMockData(operationType: OperationType) {
    const baseData = {
      efficiency: Math.floor(Math.random() * 20) + 80, // 80-100%
      totalVolume: Math.floor(Math.random() * 5000) + 15000, // 15k-20k
      avgProcessingTime: Math.floor(Math.random() * 30) + 45, // 45-75 mins
      utilization: Math.floor(Math.random() * 15) + 85 // 85-100%
    };

    // Operation-specific adjustments
    switch (operationType) {
      case 'courier':
        return {
          ...baseData,
          deliveryRate: Math.floor(Math.random() * 10) + 90, // 90-100%
          avgDeliveryTime: Math.floor(Math.random() * 20) + 120, // 120-140 mins
        };
      case 'workforce':
        return {
          ...baseData,
          staffUtilization: Math.floor(Math.random() * 15) + 80, // 80-95%
          trainingCompletion: Math.floor(Math.random() * 20) + 75, // 75-95%
        };
      case 'energy':
        return {
          ...baseData,
          energyEfficiency: Math.floor(Math.random() * 25) + 70, // 70-95%
          costSavings: Math.floor(Math.random() * 15000) + 25000, // $25k-40k
        };
      default:
        return baseData;
    }
  }

  private static createHTMLContent(reportData: ReportData): string {
    const config = this.getOperationConfig(reportData.operationType);
    const mockData = this.generateMockData(reportData.operationType);
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${reportData.title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #1e293b;
              background: white;
              padding: 40px;
            }
            
            .header {
              border-bottom: 3px solid ${config.color};
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .header h1 {
              color: ${config.color};
              font-size: 28px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            
            .header .subtitle {
              color: #64748b;
              font-size: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .operation-badge {
              background: ${config.color}15;
              color: ${config.color};
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
            }
            
            .meta-info {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid ${config.color};
            }
            
            .meta-info h3 {
              color: #1e293b;
              margin-bottom: 12px;
              font-size: 18px;
            }
            
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 16px;
            }
            
            .meta-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
            }
            
            .meta-label {
              color: #64748b;
              font-weight: 500;
            }
            
            .meta-value {
              color: #1e293b;
              font-weight: 600;
            }
            
            .kpi-section {
              margin-bottom: 30px;
            }
            
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .kpi-card {
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .kpi-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 12px;
            }
            
            .kpi-title {
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
            }
            
            .kpi-value {
              font-size: 24px;
              font-weight: 700;
              color: ${config.color};
            }
            
            .kpi-change {
              font-size: 12px;
              color: #059669;
              font-weight: 500;
            }
            
            .content-section {
              margin-bottom: 30px;
            }
            
            .content-section h3 {
              color: #1e293b;
              font-size: 20px;
              margin-bottom: 16px;
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 8px;
            }
            
            .selected-items {
              display: grid;
              gap: 12px;
            }
            
            .item {
              background: #f8fafc;
              padding: 16px;
              border-radius: 6px;
              border-left: 3px solid ${config.color};
            }
            
            .item-title {
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 4px;
            }
            
            .item-desc {
              color: #64748b;
              font-size: 14px;
            }
            
            .notes-section {
              background: #fefce8;
              border: 1px solid #fde047;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 30px;
            }
            
            .notes-section h3 {
              color: #92400e;
              margin-bottom: 12px;
              font-size: 16px;
            }
            
            .notes-content {
              color: #78716c;
              line-height: 1.7;
            }
            
            .footer {
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              margin-top: 40px;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            
            .footer .logo {
              font-weight: 700;
              color: ${config.color};
              margin-bottom: 8px;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .header {
                break-inside: avoid;
              }
              
              .kpi-card {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${reportData.title}</h1>
            <div class="subtitle">
              <span class="operation-badge">${config.icon} ${config.name}</span>
              <span>•</span>
              <span>Generated on ${currentDate} at ${currentTime}</span>
            </div>
          </div>
          
          <div class="meta-info">
            <h3>Report Information</h3>
            <div class="meta-grid">
              <div class="meta-item">
                <span class="meta-label">Date Range:</span>
                <span class="meta-value">${reportData.dateRange}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Operation Type:</span>
                <span class="meta-value">${config.name}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Report Items:</span>
                <span class="meta-value">${reportData.selectedItems.length} sections</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Generated By:</span>
                <span class="meta-value">Resilient Terminal Orchestrator</span>
              </div>
            </div>
          </div>
          
          <div class="kpi-section">
            <h3>Key Performance Indicators</h3>
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-header">
                  <span class="kpi-title">Overall Efficiency</span>
                </div>
                <div class="kpi-value">${mockData.efficiency}%</div>
                <div class="kpi-change">↗ +2.3% from last period</div>
              </div>
              
              <div class="kpi-card">
                <div class="kpi-header">
                  <span class="kpi-title">Total Volume</span>
                </div>
                <div class="kpi-value">${mockData.totalVolume.toLocaleString()}</div>
                <div class="kpi-change">↗ +5.7% from last period</div>
              </div>
              
              <div class="kpi-card">
                <div class="kpi-header">
                  <span class="kpi-title">Avg Processing Time</span>
                </div>
                <div class="kpi-value">${mockData.avgProcessingTime}min</div>
                <div class="kpi-change">↗ -12% improvement</div>
              </div>
              
              <div class="kpi-card">
                <div class="kpi-header">
                  <span class="kpi-title">Utilization Rate</span>
                </div>
                <div class="kpi-value">${mockData.utilization}%</div>
                <div class="kpi-change">↗ +1.2% from last period</div>
              </div>
            </div>
          </div>
          
          ${reportData.notes ? `
            <div class="notes-section">
              <h3>📝 Report Notes & Insights</h3>
              <div class="notes-content">${reportData.notes}</div>
            </div>
          ` : ''}
          
          <div class="content-section">
            <h3>Report Contents</h3>
            <div class="selected-items">
              ${reportData.selectedItems.map(item => `
                <div class="item">
                  <div class="item-title">${item}</div>
                  <div class="item-desc">Detailed analysis and insights for ${item.toLowerCase()}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="footer">
            <div class="logo">Resilient Terminal Orchestrator</div>
            <div>Honeywell Hackathon • Advanced Terminal Management System</div>
            <div>Report generated automatically with real-time operational data</div>
          </div>
        </body>
      </html>
    `;
  }

  public static async generatePDF(reportData: ReportData): Promise<void> {
    try {
      const htmlContent = this.createHTMLContent(reportData);
      
      // Create a new window with the PDF content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          
          // Close the window after printing (optional)
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 500);
      };

      // Create downloadable blob version
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF generated successfully! Check your downloads folder for the HTML version.');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  }

  public static async downloadCSV(reportData: ReportData): Promise<void> {
    try {
      const config = this.getOperationConfig(reportData.operationType);
      const mockData = this.generateMockData(reportData.operationType);
      
      const csvData = [
        ['Report Title', reportData.title],
        ['Operation Type', config.name],
        ['Date Range', reportData.dateRange],
        ['Generated On', new Date().toLocaleDateString()],
        [''],
        ['Key Performance Indicators'],
        ['Metric', 'Value', 'Unit'],
        ['Overall Efficiency', mockData.efficiency, '%'],
        ['Total Volume', mockData.totalVolume, 'units'],
        ['Avg Processing Time', mockData.avgProcessingTime, 'minutes'],
        ['Utilization Rate', mockData.utilization, '%'],
        [''],
        ['Selected Report Items'],
        ...reportData.selectedItems.map(item => [item, 'Included', ''])
      ];

      const csvContent = csvData.map(row => 
        row.map(field => `"${field}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('CSV data exported successfully!');
      
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error('Failed to export CSV. Please try again.');
    }
  }

  public static async emailReport(reportData: ReportData, emailAddress: string): Promise<void> {
    try {
      const config = this.getOperationConfig(reportData.operationType);
      const subject = encodeURIComponent(`${reportData.title} - ${config.name}`);
      const body = encodeURIComponent(`
Hi,

Please find attached the ${config.name} report: "${reportData.title}"

Report Details:
- Date Range: ${reportData.dateRange}
- Items Included: ${reportData.selectedItems.length} sections
- Generated: ${new Date().toLocaleDateString()}

${reportData.notes ? `Notes: ${reportData.notes}` : ''}

Best regards,
Resilient Terminal Orchestrator System
      `);

      const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      window.open(mailtoLink);
      
      toast.success('Email client opened with report details!');
      
    } catch (error) {
      console.error('Email failed:', error);
      toast.error('Failed to open email client. Please try again.');
    }
  }
}