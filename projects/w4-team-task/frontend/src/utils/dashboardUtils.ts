import { InventoryItem } from '@/lib/api';
import { RFIDHeatmapData, DashboardMetrics } from '@/types/dashboard';

export const calculateDashboardMetrics = (
  inventoryData: InventoryItem[],
  rfidData: RFIDHeatmapData[]
): DashboardMetrics => {
  const totalProducts = inventoryData.length;
  
  const lowStockItems = inventoryData.filter(
    item => item.stock < (item.min_threshold || 20)
  ).length;
  
  const totalInventory = inventoryData.reduce(
    (sum, item) => sum + item.stock, 
    0
  );
  
  const totalRFIDActivity = rfidData.reduce(
    (sum, item) => sum + item.activity_count, 
    0
  );

  return {
    totalProducts,
    lowStockItems,
    totalInventory,
    totalRFIDActivity,
  };
};

export const getStockStatus = (stock: number, threshold: number = 20) => {
  if (stock < threshold * 0.5) {
    return { status: 'critical', color: 'red', message: 'Critical - Immediate restock needed' };
  }
  if (stock < threshold) {
    return { status: 'low', color: 'orange', message: 'Low - Restock recommended' };
  }
  return { status: 'normal', color: 'green', message: 'Normal' };
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};
