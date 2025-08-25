import { calculateHeatmapColor, canvasUtils } from '@/utils/chartConfig';

export interface RFIDData {
  location: string;
  hour: number;
  activity_count: number;
  product_id?: string;
  timestamp?: string;
}

export interface HeatmapConfig {
  cellWidth: number;
  cellHeight: number;
  marginLeft: number;
  marginTop: number;
}

export const DEFAULT_HEATMAP_CONFIG: HeatmapConfig = {
  cellWidth: 40,
  cellHeight: 40,
  marginLeft: 100,
  marginTop: 50,
};

// Process RFID data into heatmap format
export const processRFIDData = (data: RFIDData[]) => {
  const locations = [...new Set(data.map(item => item.location))].sort();
  const hours = Array.from({length: 24}, (_, i) => i);
  
  const activityMatrix = locations.map(location => 
    hours.map(hour => {
      const activity = data.find(item => item.location === location && item.hour === hour);
      return activity ? activity.activity_count : 0;
    })
  );
  
  const maxActivity = Math.max(...data.map(item => item.activity_count));
  
  return { locations, hours, activityMatrix, maxActivity };
};

// Calculate canvas dimensions
export const calculateCanvasDimensions = (locations: string[], hours: number[], config: HeatmapConfig) => {
  const width = config.marginLeft + hours.length * config.cellWidth + 50;
  const height = config.marginTop + locations.length * config.cellHeight + 50;
  return { width, height };
};

// Draw heatmap title
export const drawHeatmapTitle = (ctx: CanvasRenderingContext2D, title: string, canvasWidth: number) => {
  canvasUtils.drawText(ctx, title, canvasWidth / 2, 25, {
    font: 'bold 16px Arial',
    color: '#1f2937',
    align: 'center',
  });
};

// Draw hour labels
export const drawHourLabels = (ctx: CanvasRenderingContext2D, hours: number[], config: HeatmapConfig) => {
  hours.forEach((hour, hourIndex) => {
    canvasUtils.drawText(
      ctx,
      `${hour}:00`,
      config.marginLeft + hourIndex * config.cellWidth + config.cellWidth / 2,
      config.marginTop - 10,
      {
        font: '12px Arial',
        color: '#6b7280',
        align: 'center',
      }
    );
  });
};

// Draw location labels
export const drawLocationLabels = (ctx: CanvasRenderingContext2D, locations: string[], config: HeatmapConfig) => {
  locations.forEach((location, locationIndex) => {
    canvasUtils.drawText(
      ctx,
      location,
      config.marginLeft - 10,
      config.marginTop + locationIndex * config.cellHeight + config.cellHeight / 2 + 4,
      {
        font: '12px Arial',
        color: '#6b7280',
        align: 'right',
      }
    );
  });
};

// Draw heatmap cells
export const drawHeatmapCells = (
  ctx: CanvasRenderingContext2D,
  activityMatrix: number[][],
  maxActivity: number,
  config: HeatmapConfig
) => {
  activityMatrix.forEach((locationData, locationIndex) => {
    locationData.forEach((activity, hourIndex) => {
      const intensity = maxActivity > 0 ? activity / maxActivity : 0;
      const color = calculateHeatmapColor(intensity);
      
      // Draw cell
      canvasUtils.drawRect(
        ctx,
        config.marginLeft + hourIndex * config.cellWidth,
        config.marginTop + locationIndex * config.cellHeight,
        config.cellWidth - 1,
        config.cellHeight - 1,
        color
      );
      
      // Add activity count text for non-zero values
      if (activity > 0) {
        canvasUtils.drawText(
          ctx,
          activity.toString(),
          config.marginLeft + hourIndex * config.cellWidth + config.cellWidth / 2,
          config.marginTop + locationIndex * config.cellHeight + config.cellHeight / 2 + 3,
          {
            font: '10px Arial',
            color: intensity > 0.5 ? '#ffffff' : '#000000',
            align: 'center',
          }
        );
      }
    });
  });
};

// Draw legend
export const drawHeatmapLegend = (
  ctx: CanvasRenderingContext2D,
  maxActivity: number,
  canvasHeight: number,
  config: HeatmapConfig
) => {
  const legendY = canvasHeight - 30;
  const legendX = config.marginLeft;
  const legendWidth = 200;
  const legendHeight = 15;
  
  // Legend title
  canvasUtils.drawText(ctx, 'Activity Level:', legendX, legendY - 5, {
    font: '12px Arial',
    color: '#374151',
  });
  
  // Legend gradient
  for (let i = 0; i <= legendWidth; i++) {
    const intensity = i / legendWidth;
    const color = calculateHeatmapColor(intensity);
    canvasUtils.drawRect(ctx, legendX + i, legendY, 1, legendHeight, color);
  }
  
  // Legend labels
  canvasUtils.drawText(ctx, '0', legendX, legendY + legendHeight + 12, {
    font: '10px Arial',
    color: '#6b7280',
    align: 'center',
  });
  
  canvasUtils.drawText(ctx, maxActivity.toString(), legendX + legendWidth, legendY + legendHeight + 12, {
    font: '10px Arial',
    color: '#6b7280',
    align: 'center',
  });
};

// Calculate RFID statistics
export const calculateRFIDStats = (data: RFIDData[]) => {
  console.log('calculateRFIDStats called with data:', data.length, 'entries');
  console.log('Sample data:', data.slice(0, 3));
  
  // Handle empty data case
  if (!data || data.length === 0) {
    console.warn('No data provided to calculateRFIDStats, returning zero values');
    return {
      totalActivity: 0,
      peakHour: 0,
      mostActiveLocation: 'No Data'
    };
  }
  
  // Validate data structure and clean invalid entries
  const validData = data.filter(item => {
    const isValid = item && 
                   typeof item.activity_count === 'number' && 
                   !isNaN(item.activity_count) && 
                   item.activity_count >= 0 &&
                   typeof item.hour === 'number' && 
                   !isNaN(item.hour) &&
                   typeof item.location === 'string' && 
                   item.location.length > 0;
    
    if (!isValid) {
      console.warn('Invalid data entry found:', item);
    }
    return isValid;
  });
  
  console.log('Valid data entries:', validData.length, 'out of', data.length);
  
  if (validData.length === 0) {
    console.warn('No valid data entries found');
    return {
      totalActivity: 0,
      peakHour: 0,
      mostActiveLocation: 'No Valid Data'
    };
  }
  
  // Calculate total activity
  const totalActivity = validData.reduce((sum, item) => {
    const activity = Number(item.activity_count) || 0;
    return sum + activity;
  }, 0);
  
  console.log('Total activity calculated:', totalActivity);
  
  if (totalActivity === 0) {
    console.warn('Total activity is zero');
    return {
      totalActivity: 0,
      peakHour: 0,
      mostActiveLocation: validData[0]?.location || 'Unknown'
    };
  }
  
  // Calculate peak hour
  const hours = Array.from({length: 24}, (_, i) => i);
  const peakHour = hours.reduce((peak, hour) => {
    const hourActivity = validData.filter(item => item.hour === hour)
      .reduce((sum, item) => sum + (Number(item.activity_count) || 0), 0);
    const peakActivity = validData.filter(item => item.hour === peak)
      .reduce((sum, item) => sum + (Number(item.activity_count) || 0), 0);
    return hourActivity > peakActivity ? hour : peak;
  }, 0);
  
  // Calculate most active location
  const locations = [...new Set(validData.map(item => item.location))];
  const mostActiveLocation = locations.reduce((most, location) => {
    const locationActivity = validData.filter(item => item.location === location)
      .reduce((sum, item) => sum + (Number(item.activity_count) || 0), 0);
    const mostActivity = validData.filter(item => item.location === most)
      .reduce((sum, item) => sum + (Number(item.activity_count) || 0), 0);
    return locationActivity > mostActivity ? location : most;
  }, locations[0] || 'Unknown');
  
  const result = { totalActivity, peakHour, mostActiveLocation };
  console.log('calculateRFIDStats result:', result);
  
  return result;
};
