import { useState, useEffect, useCallback } from 'react';
import WarehouseAPI, { InventoryItem, DemandPrediction, RFIDLog, TrendsData } from '@/lib/api';
import { RFIDHeatmapData } from '@/types/dashboard';

interface DashboardData {
  inventoryData: InventoryItem[];
  demandData: DemandPrediction[];
  rfidData: RFIDHeatmapData[];
  trendsData: TrendsData[];
  products: string[];
}

interface UseDashboardDataReturn {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (refreshInterval: number): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData>({
    inventoryData: [],
    demandData: [],
    rfidData: [],
    trendsData: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [inventory, demand, rfidLogs, trends] = await Promise.all([
        WarehouseAPI.getInventoryLevels(),
        WarehouseAPI.getDemandPredictions(),
        WarehouseAPI.getRFIDLogs(),
        WarehouseAPI.getTrendsData()
      ]);

      // Extract unique products for filtering
      const uniqueProducts = [...new Set([
        ...inventory.map(item => item.product_id),
        ...demand.map(item => item.product_id)
      ])];

      setData({
        inventoryData: inventory,
        demandData: demand,
        rfidData: WarehouseAPI.processRFIDForHeatmap(rfidLogs),
        trendsData: trends,
        products: uniqueProducts,
      });
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
