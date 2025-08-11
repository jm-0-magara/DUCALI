import React, { useState } from 'react';
import { Download, FileText, BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';

interface ReportConfig {
  type: 'users' | 'orders' | 'revenue' | 'artisans';
  dateRange: '7d' | '30d' | '90d' | '1y';
  format: 'csv' | 'pdf' | 'excel';
}

export function AdminReports() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'users',
    dateRange: '30d',
    format: 'csv'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'users',
      name: 'User Analytics',
      description: 'User registration, growth, and activity data',
      icon: TrendingUp
    },
    {
      id: 'orders',
      name: 'Order Reports',
      description: 'Order status, revenue, and fulfillment metrics',
      icon: BarChart3
    },
    {
      id: 'revenue',
      name: 'Revenue Analysis',
      description: 'Financial performance and revenue trends',
      icon: TrendingUp
    },
    {
      id: 'artisans',
      name: 'Artisan Performance',
      description: 'Artisan verification and performance metrics',
      icon: FileText
    }
  ];

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: FileText },
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: FileText }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real app, this would call the backend to generate the report
    console.log('Generating report:', reportConfig);
    
    setIsGenerating(false);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${reportConfig.type}_report_${reportConfig.dateRange}.${reportConfig.format}`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-slate-400 mt-2">Generate comprehensive reports and export data</p>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Type Selection */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Report Type</h3>
          <div className="space-y-3">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setReportConfig(prev => ({ ...prev, type: type.id as any }))}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    reportConfig.type === type.id
                      ? 'border-[#B08D57] bg-[#B08D57]/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-[#B08D57]" />
                    <div className="text-left">
                      <div className="text-white font-medium">{type.name}</div>
                      <div className="text-slate-400 text-sm">{type.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range & Export Options */}
        <div className="space-y-6">
          {/* Date Range */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Date Range</h3>
            <div className="grid grid-cols-2 gap-3">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setReportConfig(prev => ({ ...prev, dateRange: range.value as any }))}
                  className={`p-3 rounded-lg border transition-all ${
                    reportConfig.dateRange === range.value
                      ? 'border-[#B08D57] bg-[#B08D57]/10 text-white'
                      : 'border-slate-700 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Export Format</h3>
            <div className="grid grid-cols-3 gap-3">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setReportConfig(prev => ({ ...prev, format: format.value as any }))}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center space-y-2 ${
                      reportConfig.format === format.value
                        ? 'border-[#B08D57] bg-[#B08D57]/10 text-white'
                        : 'border-slate-700 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{format.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Button */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Generate Report</h3>
            <p className="text-slate-400 text-sm mt-1">
              {reportTypes.find(t => t.id === reportConfig.type)?.name} - {dateRanges.find(r => r.value === reportConfig.dateRange)?.label} - {exportFormats.find(f => f.value === reportConfig.format)?.label}
            </p>
          </div>
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="bg-[#B08D57] hover:bg-[#B08D57]/90 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'User Analytics Report', date: '2024-01-15', size: '2.3 MB', type: 'CSV' },
            { name: 'Revenue Analysis Q4', date: '2024-01-10', size: '1.8 MB', type: 'PDF' },
            { name: 'Order Performance Report', date: '2024-01-05', size: '3.1 MB', type: 'Excel' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-white font-medium">{report.name}</div>
                  <div className="text-slate-400 text-sm">{report.date} • {report.size}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                  {report.type}
                </span>
                <button className="text-[#B08D57] hover:text-[#B08D57]/80">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Monthly Summary', description: 'Key metrics and trends', frequency: 'Monthly' },
            { name: 'Weekly Performance', description: 'Weekly performance overview', frequency: 'Weekly' },
            { name: 'Quarterly Review', description: 'Comprehensive quarterly analysis', frequency: 'Quarterly' },
            { name: 'Annual Report', description: 'Complete annual performance', frequency: 'Annually' },
            { name: 'Custom Report', description: 'Build your own report', frequency: 'On-demand' }
          ].map((template, index) => (
            <div key={index} className="p-4 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
              <h4 className="text-white font-medium mb-2">{template.name}</h4>
              <p className="text-slate-400 text-sm mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                  {template.frequency}
                </span>
                <button className="text-[#B08D57] hover:text-[#B08D57]/80 text-sm">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
