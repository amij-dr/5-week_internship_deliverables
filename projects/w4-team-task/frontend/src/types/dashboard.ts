export interface RFIDHeatmapData {
  location: string;
  hour: number;
  activity_count: number;
}

export interface TrendsData {
  date: string;
  inventory_level: number;
  sales: number;
  restocks: number;
  alerts: number;
  inventory_turnover: number;
  stock_coverage_days: number;
  restock_efficiency: number;
  alert_severity: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  lowStockItems: number;
  totalInventory: number;
  totalRFIDActivity: number;
}

export interface RefreshConfig {
  interval: number;
  isAutoRefresh: boolean;
}

export const REFRESH_INTERVALS = [
  { value: 10000, label: '10s refresh' },
  { value: 30000, label: '30s refresh' },
  { value: 60000, label: '1m refresh' },
  { value: 300000, label: '5m refresh' },
] as const;
