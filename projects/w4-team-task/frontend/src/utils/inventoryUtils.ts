import { getStockStatus } from '@/utils/chartConfig';

export interface InventoryData {
  product_id: string;
  stock: number;
  min_threshold?: number;
  product_name?: string;
  last_updated: string;
}

// Process inventory data to remove duplicates and get latest data
export const processInventoryData = (data: InventoryData[]) => {
  return data.reduce((acc, current) => {
    const existingIndex = acc.findIndex((item: InventoryData) => item.product_id === current.product_id);
    
    if (existingIndex === -1) {
      acc.push(current);
    } else {
      const existing = acc[existingIndex];
      const currentDate = new Date(current.last_updated);
      const existingDate = new Date(existing.last_updated);
      
      if (currentDate > existingDate) {
        acc[existingIndex] = current;
      }
    }
    
    return acc;
  }, [] as InventoryData[]);
};

// Generate chart colors based on stock status
export const generateInventoryColors = (data: InventoryData[]) => {
  return data.map(item => {
    const threshold = item.min_threshold || 20;
    const status = getStockStatus(item.stock, threshold);
    return {
      backgroundColor: status.color,
      borderColor: status.borderColor,
    };
  });
};

// Calculate inventory statistics
export const calculateInventoryStats = (data: InventoryData[]) => {
  const stats = {
    critical: 0,
    low: 0,
    normal: 0,
  };

  data.forEach(item => {
    const threshold = item.min_threshold || 20;
    const status = getStockStatus(item.stock, threshold);
    stats[status.status as keyof typeof stats]++;
  });

  return stats;
};

// Generate tooltip callback for inventory chart
export const createInventoryTooltipCallback = (data: InventoryData[]) => {
  return {
    afterLabel: function(context: any) {
      const item = data[context.dataIndex];
      const threshold = item.min_threshold || 20;
      const status = getStockStatus(item.stock, threshold);
      
      if (context.dataset.label === 'Current Stock') {
        return `Status: ${status.message}`;
      }
      return '';
    }
  };
};
