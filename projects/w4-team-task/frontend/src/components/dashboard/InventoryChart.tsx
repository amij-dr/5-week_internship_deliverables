'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartCard, ChartLegend, StatusGrid, CompactMetricsSidebar, CompactMetricCard, CompactLegend } from '@/components/ui/ChartComponents';
import { commonChartOptions, chartColors, getStockStatus } from '@/utils/chartConfig';
import { 
  processInventoryData, 
  generateInventoryColors, 
  calculateInventoryStats,
  createInventoryTooltipCallback,
  type InventoryData
} from '@/utils/inventoryUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InventoryChartProps {
  data: InventoryData[];
  title?: string;
  useSideLayout?: boolean;
}

export default function InventoryChart({ data, title = 'Inventory Stock Levels', useSideLayout = false }: InventoryChartProps) {
  // Process data to remove duplicates and get latest entries
  const uniqueData = processInventoryData(data);
  
  // Generate colors based on stock status
  const colors = generateInventoryColors(uniqueData);
  
  // Calculate statistics
  const stats = calculateInventoryStats(uniqueData);

  const chartData = {
    labels: uniqueData.map(item => item.product_name || item.product_id),
    datasets: [
      {
        label: 'Current Stock',
        data: uniqueData.map(item => item.stock),
        backgroundColor: colors.map(c => c.backgroundColor),
        borderColor: colors.map(c => c.borderColor),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        callbacks: createInventoryTooltipCallback(uniqueData),
      },
    },
    scales: {
      ...commonChartOptions.scales,
      y: {
        ...commonChartOptions.scales.y,
        title: {
          ...commonChartOptions.scales.y.title,
          text: 'Quantity',
        },
      },
      x: {
        ...commonChartOptions.scales.x,
        title: {
          ...commonChartOptions.scales.x.title,
          display: false,
        },
      },
    },
  };

  const legendItems = [
    { color: chartColors.danger, label: 'Critical' },
    { color: chartColors.warning, label: 'Low' },
    { color: chartColors.success, label: 'Normal' },
  ];

  const statusStats = [
    {
      value: stats.critical,
      label: 'Critical',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-100',
      textClass: 'text-red-600',
    },
    {
      value: stats.low,
      label: 'Low',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-100',
      textClass: 'text-amber-600',
    },
    {
      value: stats.normal,
      label: 'Normal',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-100',
      textClass: 'text-emerald-600',
    },
  ];

  if (useSideLayout) {
    return (
      <ChartCard title={title} useSideLayout={true}>
        {/* Chart Container */}
        <div className="flex-1 min-h-0">
          <Bar data={chartData} options={options} />
        </div>
        
        {/* Compact Sidebar with Metrics */}
        <CompactMetricsSidebar>
          <CompactMetricCard
            value={stats.critical}
            label="Critical"
            color="red"
            icon={
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            }
          />
          <CompactMetricCard
            value={stats.low}
            label="Low Stock"
            color="amber"
            icon={
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            }
          />
          <CompactMetricCard
            value={stats.normal}
            label="Normal"
            color="emerald"
            icon={
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Legend */}
      <ChartLegend items={legendItems} className="mb-3" />
      
      {/* Status Statistics */}
      <StatusGrid stats={statusStats} />
    </ChartCard>
  );
}
