'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartCard, StatCard, CompactMetricsSidebar, CompactMetricCard, CompactLegend } from '@/components/ui/ChartComponents';
import { canvasUtils } from '@/utils/chartConfig';
import {
  processRFIDData,
  calculateCanvasDimensions,
  drawHeatmapTitle,
  drawHourLabels,
  drawLocationLabels,
  drawHeatmapCells,
  drawHeatmapLegend,
  calculateRFIDStats,
  DEFAULT_HEATMAP_CONFIG,
  type RFIDData,
} from '@/utils/rfidUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface RFIDHeatmapProps {
  data: RFIDData[];
  title?: string;
  useSideLayout?: boolean;
}

export default function RFIDHeatmap({ data, title = 'RFID Activity Heatmap', useSideLayout = false }: RFIDHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  console.log('RFIDHeatmap received data:', data.length, 'entries');
  console.log('RFIDHeatmap sample data:', data.slice(0, 3));
  
  // Process data into heatmap format
  const { locations, hours, activityMatrix, maxActivity } = processRFIDData(data);
  
  // Calculate statistics
  const { totalActivity, peakHour, mostActiveLocation } = calculateRFIDStats(data);

  console.log('RFIDHeatmap calculated stats:', { totalActivity, peakHour, mostActiveLocation });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate canvas dimensions
    const { width, height } = calculateCanvasDimensions(locations, hours, DEFAULT_HEATMAP_CONFIG);
    
    // Set canvas size and clear
    canvasUtils.setCanvasSize(canvas, width, height);
    canvasUtils.clearCanvas(ctx, width, height);
    
    // Draw all heatmap components
    drawHourLabels(ctx, hours, DEFAULT_HEATMAP_CONFIG);
    drawLocationLabels(ctx, locations, DEFAULT_HEATMAP_CONFIG);
    drawHeatmapCells(ctx, activityMatrix, maxActivity, DEFAULT_HEATMAP_CONFIG);
    drawHeatmapLegend(ctx, maxActivity, height, DEFAULT_HEATMAP_CONFIG);
    
  }, [data, title, locations, hours, activityMatrix, maxActivity]);

  const activityIcon = (
    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const clockIcon = (
    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const locationIcon = (
    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  if (useSideLayout) {
    return (
      <ChartCard title={title} useSideLayout={true}>
        {/* Canvas Container */}
        <div className="flex-1 min-h-0 flex justify-center items-center">
          <canvas 
            ref={canvasRef} 
            className="border border-slate-200 rounded-lg shadow-sm bg-white max-w-full h-auto"
            style={{ maxHeight: '300px' }}
          />
        </div>
        
        {/* Compact Sidebar with Metrics */}
        <CompactMetricsSidebar>
          <CompactMetricCard
            value={totalActivity > 0 ? Math.round(totalActivity / 1000) : totalActivity}
            label={totalActivity > 1000 ? "Total (K)" : "Total"}
            color="blue"
            icon={activityIcon}
          />
          <CompactMetricCard
            value={peakHour}
            label="Peak Hour"
            color="emerald"
            icon={clockIcon}
          />
          <CompactMetricCard
            value={mostActiveLocation.slice(0, 8)}
            label="Active Zone"
            color="purple"
            icon={locationIcon}
          />
        </CompactMetricsSidebar>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title={title}
    >
      {/* Side-by-side layout: Chart and Metrics */}
      <div className="flex gap-4">
        {/* Canvas Container */}
        <div className="flex-1 flex justify-center">
          <canvas 
            ref={canvasRef} 
            className="border border-slate-200 rounded-lg shadow-sm bg-white"
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px' }}
          />
        </div>
        
        {/* Metrics Sidebar */}
        <div className="flex flex-col gap-2 min-w-[120px]">
          <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-blue-800">Activity</div>
                <div className="text-sm font-bold text-blue-700">
                  {totalActivity > 1000 ? `${Math.round(totalActivity / 1000)}K` : totalActivity}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-emerald-800">Peak</div>
                <div className="text-sm font-bold text-emerald-700">{peakHour}:00</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-purple-800">Zone</div>
                <div className="text-sm font-bold text-purple-700">{mostActiveLocation.slice(0, 6)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
