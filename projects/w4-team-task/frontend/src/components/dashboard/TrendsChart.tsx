'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { TrendsData } from '@/lib/api';
import { ChartCard, StatCard, CompactMetricsSidebar, CompactMetricCard, CompactLegend } from '@/components/ui/ChartComponents';
import { commonChartOptions, chartColors } from '@/utils/chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

interface TrendsChartProps {
  data: TrendsData[];
  title?: string;
  useSideLayout?: boolean;
}

// Helper function to calculate trend analytics
const calculateTrendAnalytics = (data: TrendsData[]) => {
  const analytics = {
    avgInventory: data.reduce((sum, item) => sum + item.inventory_level, 0) / data.length,
    totalSales: data.reduce((sum, item) => sum + item.sales, 0),
    totalAlerts: data.reduce((sum, item) => sum + item.alerts, 0),
    totalRestocks: data.reduce((sum, item) => sum + item.restocks, 0),
  };

  // Calculate trend direction
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.inventory_level, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.inventory_level, 0) / secondHalf.length;
  
  const trend = secondHalfAvg > firstHalfAvg ? 'increasing' : 
                secondHalfAvg < firstHalfAvg ? 'decreasing' : 'stable';

  return { analytics, trend };
};

export default function TrendsChart({ data, title = 'Inventory Trends Over Time', useSideLayout = false }: TrendsChartProps) {
  // Sort data by date to ensure proper chronological order
  const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Debug logging to check data
  console.log('TrendsChart data:', {
    count: sortedData.length,
    dateRange: sortedData.length > 0 ? `${sortedData[0].date} to ${sortedData[sortedData.length - 1].date}` : 'No data',
    sampleDates: sortedData.slice(0, 5).map(d => d.date)
  });
  
  const { analytics } = calculateTrendAnalytics(sortedData);

  // Calculate date range to determine appropriate time unit
  const getTimeUnit = () => {
    if (sortedData.length <= 1) return 'day';
    
    const firstDate = new Date(sortedData[0].date);
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    const daysDiff = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    
    console.log('Date range analysis:', { firstDate, lastDate, daysDiff });
    
    if (daysDiff <= 7) return 'day';
    if (daysDiff <= 30) return 'day';
    if (daysDiff <= 90) return 'week';
    return 'month';
  };

  const timeUnit = getTimeUnit();

  const chartData = {
    labels: sortedData.map(item => item.date), // Use date string directly, Chart.js will parse it
    datasets: [
      {
        label: 'Inventory Level',
        data: sortedData.map(item => item.inventory_level),
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Sales',
        data: sortedData.map(item => item.sales),
        borderColor: chartColors.success,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'Restocks',
        data: sortedData.map(item => item.restocks),
        borderColor: chartColors.warning,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1',
      },
      {
        label: 'Alerts',
        data: sortedData.map(item => item.alerts),
        borderColor: chartColors.danger,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    ...commonChartOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...commonChartOptions.plugins,
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: function(tooltipItems: any[]) {
            if (tooltipItems.length > 0) {
              const date = new Date(tooltipItems[0].label);
              return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
            }
            return '';
          },
          afterBody: function(tooltipItems: any[]) {
            const label = tooltipItems[0].label;
            const dataPoint = sortedData.find(item => item.date === label);
            if (dataPoint) {
              const turnoverRate = dataPoint.inventory_level > 0 ? 
                (dataPoint.sales / dataPoint.inventory_level * 100).toFixed(1) : '0';
              return `Inventory Turnover: ${turnoverRate}%`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        ...commonChartOptions.scales.x,
        type: 'time' as const,
        time: {
          unit: timeUnit as any,
          parser: 'yyyy-MM-dd', // Specify the input format (fixed for date-fns compatibility)
          displayFormats: {
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy'
          },
          tooltipFormat: 'MMM dd, yyyy'
        },
        title: {
          ...commonChartOptions.scales.x.title,
          display: false,
        },
        ticks: {
          ...commonChartOptions.scales.x.ticks,
          maxTicksLimit: sortedData.length > 30 ? 8 : Math.min(sortedData.length, 15),
          autoSkip: true,
          autoSkipPadding: 20,
          source: 'data' as const
        }
      },
      y: {
        ...commonChartOptions.scales.y,
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          ...commonChartOptions.scales.y.title,
          text: 'Inventory & Sales',
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Events Count',
          font: {
            size: 12,
            weight: 'bold' as const
          },
          color: '#64748b'
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          }
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const legendItems = [
    { color: chartColors.primary, label: 'Inventory' },
    { color: chartColors.success, label: 'Sales' },
    { color: chartColors.warning, label: 'Restocks' },
    { color: chartColors.danger, label: 'Alerts' },
  ];

  if (useSideLayout) {
    return (
      <ChartCard title={title} useSideLayout={true}>
        {/* Chart Container */}
        <div className="flex-1 min-h-0">
          <Line data={chartData} options={options} />
        </div>
        
        {/* Compact Sidebar with Metrics */}
        <CompactMetricsSidebar>
          <CompactMetricCard
            value={Math.round(analytics.avgInventory)}
            label="Avg Units"
            color="blue"
            icon={
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4" />
              </svg>
            }
          />
          <CompactMetricCard
            value={analytics.totalSales}
            label="Total Sales"
            color="emerald"
            icon={
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <CompactMetricCard
            value={analytics.totalRestocks}
            label="Restocks"
            color="amber"
            icon={
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9" />
              </svg>
            }
          />
          <CompactMetricCard
            value={analytics.totalAlerts}
            label="Alerts"
            color="red"
            icon={
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            }
          />
        </CompactMetricsSidebar>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title={title}
    >
      {/* Chart Container */}
      <div className="h-48 mb-4">
        <Line data={chartData} options={options} />
      </div>
      
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={analytics.avgInventory.toFixed(0)}
          label="Avg Units"
          color="blue"
        />
        
        <StatCard
          value={analytics.totalSales.toLocaleString()}
          label="Total Sales"
          color="emerald"
        />
        
        <StatCard
          value={analytics.totalRestocks.toString()}
          label="Restocks"
          color="amber"
        />
        
        <StatCard
          value={analytics.totalAlerts.toString()}
          label="Alerts"
          color="red"
        />
      </div>
    </ChartCard>
  );
}
