import React from 'react';
import { DashboardMetrics } from '@/types/dashboard';
import { formatNumber } from '@/utils/dashboardUtils';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'emerald' | 'purple';
  formatter?: (value: number) => string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  formatter = formatNumber
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-600'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-600'
    }
  };

  const colors = colorClasses[color];
  const displayValue = typeof value === 'number' ? formatter(value) : value;

  return (
    <div className={`${colors.bg} backdrop-blur-sm rounded-lg shadow-sm border border-white/50 p-4 hover:shadow-md transition-shadow mb-4`}>
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">{title}</div>
          <div className={`text-xl font-bold ${colors.text} truncate`}>
            {displayValue}
          </div>
          <div className="text-xs font-medium text-slate-500 truncate">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricsSidebarProps {
  metrics: DashboardMetrics;
}

const MetricsSidebar: React.FC<MetricsSidebarProps> = ({ metrics }) => {
  return (
    <div className="w-64 bg-white/40 backdrop-blur-md p-4 border-r border-slate-200/60 space-y-2">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Key Metrics
      </h2>
      
      <MetricCard
        title="Total Products"
        value={metrics.totalProducts}
        subtitle="Active inventory"
        color="blue"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
      
      <MetricCard
        title="Low Stock Items"
        value={metrics.lowStockItems}
        subtitle="Needs attention"
        color="red"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
      />
      
      <MetricCard
        title="Total Inventory"
        value={metrics.totalInventory}
        subtitle="Units in stock"
        color="emerald"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
      
      <MetricCard
        title="RFID Activity"
        value={metrics.totalRFIDActivity}
        subtitle="Total scans"
        color="purple"
        icon={
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        }
      />
    </div>
  );
};

export default MetricsSidebar;
