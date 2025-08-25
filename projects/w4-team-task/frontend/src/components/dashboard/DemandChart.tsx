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
} from 'chart.js';
import 'chartjs-adapter-date-fns';
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
  TimeScale
);

interface DemandData {
  date: string;
  actual_demand?: number;
  predicted_demand: number;
  product_id: string;
}

interface DemandChartProps {
  data: DemandData[];
  title?: string;
  productId?: string;
  useSideLayout?: boolean;
}

// Helper function to calculate prediction accuracy
const calculateAccuracy = (data: DemandData[]) => {
  const actualData = data.filter(item => item.actual_demand !== undefined && item.actual_demand !== null);
  
  if (actualData.length === 0) return null;
  
  return actualData.reduce((acc, item) => {
    const predicted = item.predicted_demand;
    const actual = item.actual_demand!;
    return acc + (1 - Math.abs(predicted - actual) / actual);
  }, 0) / actualData.length * 100;
};

export default function DemandChart({ data, title = 'Demand Prediction vs Actual', productId, useSideLayout = false }: DemandChartProps) {
  // Filter and sort data
  const filteredData = productId ? data.filter(item => item.product_id === productId) : data;
  const sortedData = filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = {
    labels: sortedData.map(item => item.date),
    datasets: [
      {
        label: 'Predicted Demand',
        data: sortedData.map(item => item.predicted_demand),
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#1d4ed8',
        pointRadius: 4,
        tension: 0.1,
      },
      {
        label: 'Actual Demand',
        data: sortedData.map(item => item.actual_demand || null),
        borderColor: chartColors.success,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: chartColors.success,
        pointBorderColor: '#047857',
        pointRadius: 4,
        tension: 0.1,
        spanGaps: false,
      }
    ],
  };

  const options = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      tooltip: {
        ...commonChartOptions.plugins.tooltip,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          afterBody: function(tooltipItems: any[]) {
            if (tooltipItems.length >= 2) {
              const predicted = tooltipItems[0].raw;
              const actual = tooltipItems[1].raw;
              if (actual !== null && predicted !== null) {
                const accuracy = ((1 - Math.abs(predicted - actual) / actual) * 100).toFixed(1);
                return `Accuracy: ${accuracy}%`;
              }
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
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM dd'
          }
        },
        title: {
          ...commonChartOptions.scales.x.title,
          display: false,
        }
      },
      y: {
        ...commonChartOptions.scales.y,
        title: {
          ...commonChartOptions.scales.y.title,
          text: 'Demand Quantity',
        }
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  // Calculate accuracy
  const accuracy = calculateAccuracy(sortedData);
  const actualDataCount = sortedData.filter(item => item.actual_demand !== undefined && item.actual_demand !== null).length;

  const accuracyIcon = (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const warningIcon = (
    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const legendItems = [
    { color: chartColors.primary, label: 'Predicted' },
    { color: chartColors.success, label: 'Actual' },
  ];

  if (useSideLayout) {
    return (
      <ChartCard title={`${title}${productId ? ` - ${productId}` : ''}`} useSideLayout={true}>
        {/* Chart Container */}
        <div className="flex-1 min-h-0">
          <Line data={chartData} options={options} />
        </div>
        
        {/* Compact Sidebar with Metrics */}
        <CompactMetricsSidebar>
          {actualDataCount > 0 ? (
            <CompactMetricCard
              value={accuracy ? Math.round(accuracy) : 0}
              label={`${accuracy?.toFixed(1)}% Accuracy`}
              color="blue"
              icon={
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              }
            />
          ) : (
            <CompactMetricCard
              value={0}
              label="No Actual Data"
              color="amber"
              icon={warningIcon}
            />
          )}
          <div className="pt-2 border-t border-slate-200">
            <CompactLegend items={legendItems} />
          </div>
        </CompactMetricsSidebar>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title={`${title}${productId ? ` - ${productId}` : ''}`}
    >
      {/* Chart Container with inline accuracy metric */}
      <div className="relative">
        <div className="h-40 mb-2">
          <Line data={chartData} options={options} />
        </div>
        
        {/* Compact accuracy metric positioned in top right */}
        <div className="absolute top-2 right-2">
          {actualDataCount > 0 ? (
            <div className="bg-blue-50/90 backdrop-blur-sm rounded-md px-2 py-1 border border-blue-100 shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-xs font-medium text-blue-700">
                  {accuracy?.toFixed(1)}% Accuracy
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/90 backdrop-blur-sm rounded-md px-2 py-1 border border-amber-100 shadow-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
                <div className="text-xs font-medium text-amber-700">
                  Prediction Only
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChartCard>
  );
}
