import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { PDFGenerator } from './PDFGenerator';
import { OperationType } from './LoginPage';
import { 
  ArrowLeft,
  FileText,
  Download,
  Mail,
  Share2,
  BarChart3,
  PieChart,
  Users,
  Calendar,
  Database,
  Loader2
} from 'lucide-react';
import { AppPage } from '../App';

interface ReportsPageProps {
  onNavigate: (page: AppPage) => void;
  operationType?: OperationType;
}

interface ReportItem {
  id: string;
  type: 'chart' | 'kpi' | 'table';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
}

export function ReportsPage({ onNavigate, operationType = 'terminal' }: ReportsPageProps) {
  const [reportTitle, setReportTitle] = useState(`${operationType.charAt(0).toUpperCase() + operationType.slice(1)} Operations Report`);
  const [reportNotes, setReportNotes] = useState('Generated from simulation data for operational insights and recommendations.');
  const [emailAddress, setEmailAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const getOperationReportItems = (operation: OperationType): ReportItem[] => {
    const baseItems = [
      { id: '1', type: 'kpi' as const, title: 'Efficiency Metrics', description: 'Key performance indicators', icon: BarChart3, selected: true },
      { id: '2', type: 'chart' as const, title: 'Volume Trends', description: 'Line chart showing volume over time', icon: BarChart3, selected: true },
      { id: '3', type: 'table' as const, title: 'Performance Analysis', description: 'Detailed breakdown of performance metrics', icon: FileText, selected: true }
    ];

    const operationSpecific: Record<OperationType, ReportItem[]> = {
      terminal: [
        { id: '4', type: 'chart', title: 'Berth Utilization', description: 'Bar chart of dock usage', icon: BarChart3, selected: false },
        { id: '5', type: 'chart', title: 'Vessel Processing Times', description: 'Processing efficiency by vessel type', icon: PieChart, selected: false },
        { id: '6', type: 'table', title: 'Cargo Handling Stats', description: 'Detailed cargo movement analysis', icon: FileText, selected: false }
      ],
      courier: [
        { id: '4', type: 'chart', title: 'Delivery Routes', description: 'Route optimization analysis', icon: BarChart3, selected: false },
        { id: '5', type: 'chart', title: 'Driver Performance', description: 'Individual driver metrics', icon: Users, selected: false },
        { id: '6', type: 'table', title: 'Customer Satisfaction', description: 'Delivery feedback and ratings', icon: FileText, selected: false }
      ],
      workforce: [
        { id: '4', type: 'chart', title: 'Staff Utilization', description: 'Employee productivity metrics', icon: Users, selected: false },
        { id: '5', type: 'chart', title: 'Shift Coverage', description: 'Staffing levels by time period', icon: BarChart3, selected: false },
        { id: '6', type: 'table', title: 'Training Progress', description: 'Employee development tracking', icon: FileText, selected: false }
      ],
      energy: [
        { id: '4', type: 'chart', title: 'Energy Consumption', description: 'Usage patterns by equipment', icon: BarChart3, selected: false },
        { id: '5', type: 'chart', title: 'Cost Analysis', description: 'Energy costs and savings', icon: PieChart, selected: false },
        { id: '6', type: 'table', title: 'Equipment Efficiency', description: 'Individual equipment performance', icon: FileText, selected: false }
      ]
    };

    return [...baseItems, ...operationSpecific[operation]];
  };

  const [reportItems, setReportItems] = useState<ReportItem[]>(getOperationReportItems(operationType));

  const toggleItemSelection = (id: string) => {
    setReportItems(items => 
      items.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedCount = reportItems.filter(item => item.selected).length;

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    const reportData = {
      title: reportTitle,
      operationType,
      dateRange: 'Dec 18 - Dec 20, 2024',
      notes: reportNotes,
      selectedItems: reportItems.filter(item => item.selected).map(item => item.title),
      kpiData: {
        efficiency: 87,
        totalVolume: 18750,
        avgProcessingTime: 52,
        utilization: 94
      }
    };

    try {
      await PDFGenerator.generatePDF(reportData);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    
    const reportData = {
      title: reportTitle,
      operationType,
      dateRange: 'Dec 18 - Dec 20, 2024',
      notes: reportNotes,
      selectedItems: reportItems.filter(item => item.selected).map(item => item.title),
      kpiData: {
        efficiency: 87,
        totalVolume: 18750,
        avgProcessingTime: 52,
        utilization: 94
      }
    };

    try {
      await PDFGenerator.downloadCSV(reportData);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailReport = async () => {
    if (!emailAddress.trim()) {
      return;
    }

    const reportData = {
      title: reportTitle,
      operationType,
      dateRange: 'Dec 18 - Dec 20, 2024',
      notes: reportNotes,
      selectedItems: reportItems.filter(item => item.selected).map(item => item.title),
      kpiData: {
        efficiency: 87,
        totalVolume: 18750,
        avgProcessingTime: 52,
        utilization: 94
      }
    };

    await PDFGenerator.emailReport(reportData, emailAddress);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('home')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-slate-800">Reports & Export</h1>
            <p className="text-muted-foreground text-sm">Generate and share insights</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6 pb-20">
        {/* Dashboard Preview */}
        <section>
          <h2 className="text-slate-700 mb-4">Current Dashboard Preview</h2>
          
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-blue-600">Volume Trends</p>
                  </div>
                </div>
                <div className="h-24 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-6 w-6 text-teal-500 mx-auto mb-1" />
                    <p className="text-xs text-teal-600">Efficiency: 87%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
                <Badge variant="secondary">{selectedCount} items selected</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Report Items Selection */}
        <section>
          <h2 className="text-slate-700 mb-4">Select Content to Include</h2>
          
          <div className="space-y-3">
            {reportItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all duration-200 border ${
                    item.selected ? 'border-blue-500 bg-blue-50' : 'border-border hover:border-gray-300'
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={item.selected}
                        onChange={() => toggleItemSelection(item.id)}
                        className="pointer-events-none"
                      />
                      <div className={`p-2 rounded-lg ${
                        item.selected ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          item.selected ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-700">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.selected ? 'border-blue-200 text-blue-700' : ''
                        }`}
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Report Configuration */}
        <section>
          <h2 className="text-slate-700 mb-4">Report Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Report Title</label>
              <Input
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter report title..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Notes & Summary</label>
              <Textarea
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Add notes, insights, or summary..."
                className="min-h-20"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Email for Report Sharing (Optional)</label>
              <Input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Enter email address..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Date Range</label>
                <div className="flex items-center space-x-2 p-2 border border-border rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-slate-600">Dec 18 - Dec 20, 2024</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Format</label>
                <div className="flex items-center space-x-2 p-2 border border-border rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-slate-600">PDF Report</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Export Actions */}
        <section className="pb-4">
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
              size="lg"
              onClick={handleGeneratePDF}
              disabled={isGenerating || selectedCount === 0}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generating PDF...' : 'Generate PDF Report'}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCSV}
                disabled={isExporting || selectedCount === 0}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEmailReport}
                disabled={!emailAddress.trim() || selectedCount === 0}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Report
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">Report Preview</span>
            </div>
            <p className="text-xs text-blue-600">
              {reportTitle} • {selectedCount} sections • Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}