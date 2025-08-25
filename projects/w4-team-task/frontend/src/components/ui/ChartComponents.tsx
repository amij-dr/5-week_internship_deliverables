import React from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  useSideLayout?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  description, 
  children, 
  className = '',
  useSideLayout = false
}) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 h-full flex flex-col ${className}`}>
    <div className="p-3 pb-2 flex-shrink-0">
      <h3 className="text-sm font-semibold text-slate-900 truncate">{title}</h3>
    </div>
    <div className={`flex-1 min-h-0 p-3 pt-0 ${useSideLayout ? 'flex gap-3' : ''}`}>
      {children}
    </div>
  </div>
);

interface StatCardProps {
  value: string | number;
  label: string;
  subtitle?: string;
  color: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'emerald';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  subtitle, 
  color, 
  icon 
}) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900 text-blue-600 bg-blue-500',
    green: 'from-green-50 to-green-100 border-green-200 text-green-900 text-green-600 bg-green-500',
    red: 'from-red-50 to-red-100 border-red-200 text-red-900 text-red-600 bg-red-500',
    amber: 'from-amber-50 to-amber-100 border-amber-200 text-amber-900 text-amber-600 bg-amber-500',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900 text-purple-600 bg-purple-500',
    emerald: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900 text-emerald-600 bg-emerald-500',
  };

  const classes = colorClasses[color].split(' ');
     return (
    <div className={`p-3 bg-gradient-to-br ${classes[0]} ${classes[1]} rounded-lg border ${classes[2]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-medium ${classes[3]} truncate`}>{label}</div>
          <div className={`text-lg font-bold ${classes[4]} truncate`}>{value}</div>
        </div>
        {icon && (
          <div className={`w-8 h-8 ${classes[5]} rounded-lg flex items-center justify-center ml-2 flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

interface LegendItemProps {
  color: string;
  label: string;
  className?: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({ color, label, className = '' }) => (
  <div className={`flex items-center ${className}`}>
    <div 
      className="w-4 h-4 rounded-full mr-2 shadow-sm"
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
    />
    <span className="text-slate-700 font-medium">{label}</span>
  </div>
);

interface ChartLegendProps {
  items: Array<{ color: string; label: string }>;
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ items, className = '' }) => (
  <div className={`flex flex-wrap justify-center gap-6 text-sm bg-slate-50 rounded-lg p-4 ${className}`}>
    {items.map((item, index) => (
      <LegendItem key={index} color={item.color} label={item.label} />
    ))}
  </div>
);

interface StatusGridProps {
  stats: Array<{
    value: number;
    label: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
  }>;
}

export const StatusGrid: React.FC<StatusGridProps> = ({ stats }) => (
  <div className="mt-3 flex justify-center gap-3">
    {stats.map((stat, index) => (
      <div key={index} className={`p-2 ${stat.bgClass} rounded-lg border ${stat.borderClass} text-center min-w-[80px]`}>
        <div className={`text-base font-bold ${stat.textClass}`}>
          {stat.value}
        </div>
        <div className={`text-xs ${stat.textClass} font-medium`}>{stat.label}</div>
      </div>
    ))}
  </div>
);

interface CompactMetricsSidebarProps {
  children: React.ReactNode;
}

export const CompactMetricsSidebar: React.FC<CompactMetricsSidebarProps> = ({ children }) => (
  <div className="w-28 flex-shrink-0 flex flex-col justify-center space-y-1.5">
    {children}
  </div>
);

interface CompactMetricCardProps {
  value: number | string;
  label: string;
  color: 'red' | 'amber' | 'emerald' | 'blue' | 'purple';
  icon?: React.ReactNode;
}

export const CompactMetricCard: React.FC<CompactMetricCardProps> = ({ 
  value, 
  label, 
  color, 
  icon 
}) => {
  const colorClasses = {
    red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-600' }
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-md p-1.5 border border-white/50`}>
      <div className="flex items-center space-x-1.5">
        {icon && (
          <div className={`w-5 h-5 ${colors.iconBg} rounded flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className={`text-base font-bold ${colors.text} leading-none`}>
            {value}
          </div>
          <div className={`text-[10px] ${colors.text} font-medium truncate`}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CompactLegendProps {
  items: Array<{ color: string; label: string }>;
}

export const CompactLegend: React.FC<CompactLegendProps> = ({ items }) => (
  <div className="space-y-0.5">
    {items.map((item, index) => (
      <div key={index} className="flex items-center space-x-1.5">
        <div 
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: item.color }}
        />
        <span className="text-[10px] text-slate-600 font-medium truncate">{item.label}</span>
      </div>
    ))}
  </div>
);
