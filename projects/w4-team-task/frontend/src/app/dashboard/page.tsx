'use client';

import { useState, useMemo } from 'react';
import InventoryChart from '@/components/dashboard/InventoryChart';
import DemandChart from '@/components/dashboard/DemandChart';
import RFIDHeatmap from '@/components/dashboard/RFIDHeatmap';
import TrendsChart from '@/components/dashboard/TrendsChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { calculateDashboardMetrics } from '@/utils/dashboardUtils';

// Header component with metrics
const DashboardHeader = ({ 
  selectedProduct, 
  refreshInterval, 
  loading, 
  products, 
  metrics,
  onProductChange, 
  onIntervalChange, 
  onRefresh 
}: {
  selectedProduct: string;
  refreshInterval: number;
  loading: boolean;
  products: string[];
  metrics: any;
  onProductChange: (productId: string) => void;
  onIntervalChange: (interval: number) => void;
  onRefresh: () => void;
}) => (
  <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-10">
    <div className="w-full px-4 py-2">
      {/* Single Row - Title, Metrics, and Controls */}
      <div className="flex justify-between items-center">
        {/* Left: Title */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Smart Warehouse Analytics
            </h1>
          </div>
        </div>
        
        {/* Center: Controls */}
        <div className="flex items-center space-x-2 mx-6 flex-1 justify-center">
          {/* Product Filter - Smaller */}
          <select
            value={selectedProduct}
            onChange={(e) => onProductChange(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-md px-2 py-1.5 pr-6 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow"
          >
            <option value="">All Products</option>
            {products.map(productId => (
              <option key={productId} value={productId}>{productId}</option>
            ))}
          </select>
          
          {/* Refresh Interval - Smaller */}
          <select
            value={refreshInterval}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            className="appearance-none bg-white border border-slate-200 rounded-md px-2 py-1.5 pr-6 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow"
          >
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={60000}>1m</option>
            <option value={300000}>5m</option>
          </select>
          
          {/* Manual Refresh - Smaller */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center px-2 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </>
            )}
          </button>
        </div>
        
        {/* Right: Metrics */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="bg-blue-50 backdrop-blur-sm rounded-md shadow-sm border border-blue-100 p-2 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-blue-800">Products</div>
                <div className="text-sm font-bold text-blue-700">{metrics.totalProducts}</div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 backdrop-blur-sm rounded-md shadow-sm border border-red-100 p-2 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-red-800">Low Stock</div>
                <div className="text-sm font-bold text-red-700">{metrics.lowStockItems}</div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 backdrop-blur-sm rounded-md shadow-sm border border-emerald-100 p-2 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-emerald-800">Inventory</div>
                <div className="text-sm font-bold text-emerald-700">{metrics.totalInventory}</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 backdrop-blur-sm rounded-md shadow-sm border border-purple-100 p-2 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-purple-800">RFID</div>
                <div className="text-sm font-bold text-purple-700">{metrics.totalRFIDActivity}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
        <div className="w-12 h-12 border-4 border-slate-200 rounded-full animate-spin border-t-slate-600 mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-slate-600">Loading dashboard data...</p>
      <p className="text-sm text-slate-400">Connecting to smart warehouse systems</p>
    </div>
  </div>
);

// Error component
const ErrorScreen = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading dashboard</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default function DashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [refreshInterval, setRefreshInterval] = useState<number>(30000);

  const { data, loading, error, refetch } = useDashboardData(refreshInterval);
  
  // Calculate metrics for display
  const metrics = useMemo(() => 
    calculateDashboardMetrics(data.inventoryData, data.rfidData),
    [data.inventoryData, data.rfidData]
  );

  // Filter demand data by selected product
  const filteredDemandData = useMemo(() => 
    selectedProduct 
      ? data.demandData.filter(item => item.product_id === selectedProduct)
      : data.demandData,
    [data.demandData, selectedProduct]
  );

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleIntervalChange = (interval: number) => {
    setRefreshInterval(interval);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Show loading state only on initial load
  if (loading && data.inventoryData.length === 0) {
    return <LoadingScreen />;
  }

  // Show error state
  if (error) {
    return <ErrorScreen error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      <DashboardHeader
        selectedProduct={selectedProduct}
        refreshInterval={refreshInterval}
        loading={loading}
        products={data.products}
        metrics={metrics}
        onProductChange={handleProductChange}
        onIntervalChange={handleIntervalChange}
        onRefresh={handleRefresh}
      />

      {/* Dashboard Content - Charts with Side Metrics */}
      <main className="flex-1 p-2 overflow-hidden">
        <div className="h-full grid grid-cols-2 gap-2">
          
          {/* Top Left - Inventory Chart */}
          <div className="overflow-hidden">
            <InventoryChart 
              data={data.inventoryData} 
              title="Inventory Stock Levels"
              useSideLayout={true}
            />
          </div>
          
          {/* Top Right - Trends Chart */}
          <div className="overflow-hidden">
            <TrendsChart 
              data={data.trendsData} 
              title="Inventory Trends"
              useSideLayout={true}
            />
          </div>
          
          {/* Bottom Left - Demand Chart */}
          <div className="overflow-hidden">
            <DemandChart 
              data={filteredDemandData} 
              title="Demand Prediction"
              productId={selectedProduct}
              useSideLayout={false}
            />
          </div>
          
          {/* Bottom Right - RFID Heatmap */}
          <div className="overflow-hidden">
            <RFIDHeatmap 
              data={data.rfidData} 
              title="RFID Activity Heatmap"
              useSideLayout={false}
            />
          </div>
          
        </div>
      </main>
    </div>
  );
}
