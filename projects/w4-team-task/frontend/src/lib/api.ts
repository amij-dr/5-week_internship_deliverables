// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api';

// Helper function to create timeout signal
const createTimeoutSignal = (timeoutMs: number) => {
  if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
    return AbortSignal.timeout(timeoutMs);
  }
  // Fallback for older browsers
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

// Types for API responses
export interface InventoryItem {
  product_id: string;
  product_name: string;
  stock: number;
  min_threshold: number;
  location: string;
  last_updated: string;
}

export interface SensorAlert {
  id: number;
  product_id: string;
  stock: number;
  alert: string;
  timestamp: string;
}

export interface RFIDLog {
  id: number;
  product_id: string;
  location: string;
  timestamp: string;
  scan_type: 'in' | 'out' | 'move';
}

export interface DemandPrediction {
  product_id: string;
  date: string;
  predicted_demand: number;
  actual_demand?: number;
  confidence: number;
}

export interface SalesData {
  id: number;
  product_id: string;
  month: number;
  year: number;
  sales: number;
  date: string;
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
  alert_severity: 'low' | 'medium' | 'high';
}

// API utility functions
class WarehouseAPI {
  
  // Fetch current inventory levels
  static async getInventoryLevels(): Promise<InventoryItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory-levels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (!response.ok) throw new Error('Failed to fetch inventory levels');
      return await response.json();
    } catch (error) {
      console.warn('Flask API not available, using mock data:', error);
      // Return mock data for development
      return this.getMockInventoryData();
    }
  }

  // Fetch sensor alerts
  static async getSensorAlerts(): Promise<SensorAlert[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-alert`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (!response.ok) throw new Error('Failed to fetch sensor alerts');
      const data = await response.json();
      return data.sensor_alerts || data;
    } catch (error) {
      console.warn('Flask API not available, using mock data:', error);
      return this.getMockSensorAlerts();
    }
  }

  // Fetch RFID logs
  static async getRFIDLogs(startDate?: string, endDate?: string): Promise<RFIDLog[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await fetch(`${API_BASE_URL}/rfid-logs?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (!response.ok) throw new Error('Failed to fetch RFID logs');
      return await response.json();
    } catch (error) {
      console.warn('Flask API not available, using mock data:', error);
      return this.getMockRFIDLogs();
    }
  }

  // Fetch demand predictions
  static async getDemandPredictions(productId?: string): Promise<DemandPrediction[]> {
    try {
      const url = productId 
        ? `${API_BASE_URL}/predict-demand/${productId}`
        : `${API_BASE_URL}/predict-demand`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (!response.ok) throw new Error('Failed to fetch demand predictions');
      const data = await response.json();
      return data.predictions || data;
    } catch (error) {
      console.warn('Flask API not available, using mock data:', error);
      return this.getMockDemandPredictions();
    }
  }

  // Fetch sales data
  static async getSalesData(): Promise<SalesData[]> {
    try {
      const response = await fetch(`${LARAVEL_API_URL}/sales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent long hanging requests
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (!response.ok) throw new Error('Failed to fetch sales data');
      return await response.json();
    } catch (error) {
      console.warn('Laravel API not available, using mock data:', error);
      return this.getMockSalesData();
    }
  }

  // Process RFID data for heatmap
  static processRFIDForHeatmap(logs: RFIDLog[]) {
    console.log('Processing RFID data for heatmap:', logs.length, 'logs');
    console.log('Sample RFID logs:', logs.slice(0, 3));
    
    if (!logs || logs.length === 0) {
      console.warn('No RFID logs to process, generating sample data for development');
      // Return sample data for development when no logs are available
      return this.generateSampleRFIDHeatmapData();
    }

    // Group by location and hour
    const grouped = logs.reduce((acc, log) => {
      const date = new Date(log.timestamp);
      const hour = date.getHours();
      const key = `${log.location}-${hour}`;
      
      if (!acc[key]) {
        acc[key] = {
          location: log.location,
          hour: hour,
          activity_count: 0
        };
      }
      acc[key].activity_count++;
      return acc;
    }, {} as Record<string, {
      location: string;
      hour: number;
      activity_count: number;
    }>);

    const result = Object.values(grouped);
    console.log('Processed RFID heatmap data:', result.length, 'entries');
    console.log('Sample processed data:', result.slice(0, 5));
    
    // If no processed data, fallback to sample data
    if (result.length === 0) {
      console.warn('No processed RFID data, using sample data');
      return this.generateSampleRFIDHeatmapData();
    }
    
    return result;
  }

  // Generate sample RFID heatmap data for development
  private static generateSampleRFIDHeatmapData(): Array<{location: string; hour: number; activity_count: number}> {
    const locations = ['Zone A', 'Zone B', 'Zone C', 'Dock 1', 'Dock 2'];
    const sampleData: Array<{location: string; hour: number; activity_count: number}> = [];
    
    // Generate data for each location across 24 hours
    locations.forEach(location => {
      for (let hour = 0; hour < 24; hour++) {
        // Create realistic activity patterns
        let activityCount = 0;
        
        // Higher activity during business hours (8 AM - 6 PM)
        if (hour >= 8 && hour <= 18) {
          // Peak hours with more activity
          const peakHours = [9, 10, 14, 15, 16]; // 9 AM, 10 AM, 2 PM, 3 PM, 4 PM
          const baseActivity = Math.floor(Math.random() * 15) + 5; // 5-20 activities
          const peakMultiplier = peakHours.includes(hour) ? 1.5 : 1.0;
          activityCount = Math.floor(baseActivity * peakMultiplier);
        } else {
          // Low activity outside business hours
          activityCount = Math.floor(Math.random() * 5); // 0-5 activities
        }
        
        // Only add entries with activity > 0 for better visualization
        if (activityCount > 0) {
          sampleData.push({
            location,
            hour,
            activity_count: activityCount
          });
        }
      }
    });
    
    console.log('Generated sample RFID heatmap data:', sampleData.length, 'entries');
    return sampleData;
  }

  // Process data for trends chart
  static async getTrendsData(): Promise<TrendsData[]> {
    try {
      console.log('Fetching trends data...');
      
      // For development, directly use mock data which has better date distribution
      // This ensures we always have a good range of data for testing
      const mockData = this.getMockTrendsData();
      console.log('Using mock trends data:', mockData.length, 'entries');
      
      // Verify date range
      if (mockData.length > 0) {
        const dates = mockData.map(d => d.date).sort();
        console.log('Date range:', dates[0], 'to', dates[dates.length - 1]);
      }
      
      return mockData;
      
      /* 
      // Real API integration (uncomment when APIs are ready)
      const [inventory, sales, alerts] = await Promise.all([
        this.getInventoryLevels().catch(error => {
          console.warn('Failed to fetch inventory levels:', error);
          return this.getMockInventoryData();
        }),
        this.getSalesData().catch(error => {
          console.warn('Failed to fetch sales data:', error);
          return this.getMockSalesData();
        }),
        this.getSensorAlerts().catch(error => {
          console.warn('Failed to fetch sensor alerts:', error);
          return this.getMockSensorAlerts();
        })
      ]);

      console.log('Fetched data:', { 
        inventoryCount: inventory.length, 
        salesCount: sales.length, 
        alertsCount: alerts.length 
      });

      // Group data by date
      const trends = new Map();
      
      // Process inventory data
      inventory.forEach(item => {
        const date = item.last_updated.split('T')[0];
        if (!trends.has(date)) {
          trends.set(date, {
            date,
            inventory_level: 0,
            sales: 0,
            restocks: 0,
            alerts: 0,
            inventory_turnover: 0,
            stock_coverage_days: 0,
            restock_efficiency: 0,
            alert_severity: 'low' as 'low' | 'medium' | 'high'
          });
        }
        const trend = trends.get(date);
        trend.inventory_level += item.stock;
      });

      // Process sales data
      sales.forEach(item => {
        const date = item.date;
        if (!trends.has(date)) {
          trends.set(date, {
            date,
            inventory_level: 0,
            sales: 0,
            restocks: 0,
            alerts: 0,
            inventory_turnover: 0,
            stock_coverage_days: 0,
            restock_efficiency: 0,
            alert_severity: 'low' as 'low' | 'medium' | 'high'
          });
        }
        const trend = trends.get(date);
        trend.sales += item.sales;
      });

      // Process alerts
      alerts.forEach(alert => {
        const date = alert.timestamp.split('T')[0];
        if (!trends.has(date)) {
          trends.set(date, {
            date,
            inventory_level: 0,
            sales: 0,
            restocks: 0,
            alerts: 0,
            inventory_turnover: 0,
            stock_coverage_days: 0,
            restock_efficiency: 0,
            alert_severity: 'low' as 'low' | 'medium' | 'high'
          });
        }
        const trend = trends.get(date);
        trend.alerts++;
        if (alert.alert.includes('restock')) {
          trend.restocks++;
        }
      });

      // Calculate additional metrics for each trend
      trends.forEach(trend => {
        // Calculate inventory turnover (sales/inventory ratio)
        trend.inventory_turnover = trend.inventory_level > 0 
          ? Math.round((trend.sales / trend.inventory_level) * 100) / 100 
          : 0;
        
        // Calculate stock coverage days (how many days current inventory will last)
        trend.stock_coverage_days = trend.sales > 0 
          ? Math.round(trend.inventory_level / trend.sales)
          : 999;
        
        // Calculate restock efficiency (sales per restock)
        trend.restock_efficiency = trend.restocks > 0 
          ? Math.round((trend.sales / trend.restocks) * 100) / 100
          : 0;
        
        // Determine alert severity based on alert count
        trend.alert_severity = trend.alerts > 5 ? 'high' : (trend.alerts > 2 ? 'medium' : 'low');
      });

      const result = Array.from(trends.values()).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      console.log('Processed trends data:', result.length, 'entries');
      return result;
      */
    } catch (error) {
      console.error('Error processing trends data, using mock data:', error);
      return this.getMockTrendsData();
    }
  }

  // Mock data for development and fallback
  private static getMockInventoryData(): InventoryItem[] {
    const inventoryData: InventoryItem[] = [];
    
    // Generate inventory data for the last 30 days
    const products = [
      { id: 'P001', name: 'Widget A', baseStock: 45, threshold: 50, location: 'A1' },
      { id: 'P002', name: 'Widget B', baseStock: 15, threshold: 30, location: 'A2' },
      { id: 'P003', name: 'Widget C', baseStock: 8, threshold: 25, location: 'B1' },
      { id: 'P004', name: 'Widget D', baseStock: 75, threshold: 40, location: 'B2' },
      { id: 'P005', name: 'Widget E', baseStock: 32, threshold: 35, location: 'C1' },
      { id: 'P006', name: 'Widget F', baseStock: 22, threshold: 30, location: 'C2' },
      { id: 'P007', name: 'Widget G', baseStock: 5, threshold: 20, location: 'D1' },
      { id: 'P008', name: 'Widget H', baseStock: 88, threshold: 60, location: 'D2' }
    ];
    
    // Generate data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString();
      
      products.forEach(product => {
        // Add some variation to stock levels over time
        const timeVariation = Math.sin(i * 0.2) * 10; // Cyclical variation
        const randomVariation = Math.floor(Math.random() * 20) - 10; // ±10 units
        const stock = Math.max(0, product.baseStock + timeVariation + randomVariation);
        
        inventoryData.push({
          product_id: product.id,
          product_name: product.name,
          stock: Math.round(stock),
          min_threshold: product.threshold,
          location: product.location,
          last_updated: dateString
        });
      });
    }
    
    return inventoryData;
  }

  private static getMockSensorAlerts(): SensorAlert[] {
    const alerts: SensorAlert[] = [];
    const products = ['P001', 'P002', 'P003', 'P004', 'P005'];
    const alertTypes = [
      'Critical: Immediate restock needed',
      'Low: Restock recommended', 
      'Warning: Below threshold',
      'Alert: Stock depletion detected',
      'Notice: Approaching minimum threshold'
    ];
    
    // Generate alerts for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Randomly generate 0-3 alerts per day
      const alertCount = Math.floor(Math.random() * 4);
      
      for (let j = 0; j < alertCount; j++) {
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        date.setHours(randomHour, randomMinute, 0, 0);
        
        alerts.push({
          id: i * 10 + j + 1,
          product_id: products[Math.floor(Math.random() * products.length)],
          stock: Math.floor(Math.random() * 50) + 1,
          alert: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          timestamp: date.toISOString()
        });
      }
    }
    
    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private static getMockRFIDLogs(): RFIDLog[] {
    const locations = ['Zone A', 'Zone B', 'Zone C', 'Dock 1', 'Dock 2'];
    const products = ['P001', 'P002', 'P003', 'P004', 'P005'];
    const logs: RFIDLog[] = [];
    
    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      
      logs.push({
        id: i + 1,
        product_id: products[Math.floor(Math.random() * products.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: date.toISOString(),
        scan_type: ['in', 'out', 'move'][Math.floor(Math.random() * 3)] as 'in' | 'out' | 'move'
      });
    }
    
    return logs;
  }

  private static getMockDemandPredictions(): DemandPrediction[] {
    const products = [
      { id: 'P001', basedemand: 25, volatility: 0.3, seasonal: 1.0 }, // Widget A - stable
      { id: 'P002', basedemand: 18, volatility: 0.5, seasonal: 1.2 }, // Widget B - moderate variation
      { id: 'P003', basedemand: 35, volatility: 0.7, seasonal: 0.8 }, // Widget C - high variation
      { id: 'P004', basedemand: 12, volatility: 0.2, seasonal: 1.1 }, // Widget D - very stable
      { id: 'P005', basedemand: 28, volatility: 0.4, seasonal: 0.9 }  // Widget E - low variation
    ];
    
    const predictions: DemandPrediction[] = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      products.forEach(product => {
        // Calculate seasonal multiplier (simulating weekly patterns)
        const weeklyMultiplier = isWeekend ? 0.7 : 1.0;
        const seasonalEffect = product.seasonal * weeklyMultiplier;
        
        // Generate predicted demand with some randomness
        const baseVariation = 1 + (Math.random() - 0.5) * product.volatility;
        const predicted = Math.round(product.basedemand * seasonalEffect * baseVariation);
        
        // Generate actual demand (only for past days - first 15 days)
        let actual: number | undefined = undefined;
        let confidence = 0.85; // High confidence for recent predictions
        
        if (i < 15) {
          // Simulate prediction accuracy - better predictions have less variance
          const accuracyFactor = 0.9 + (Math.random() * 0.2); // 90-110% accuracy
          const marketNoise = 1 + (Math.random() - 0.5) * 0.3; // Market volatility
          actual = Math.round(predicted * accuracyFactor * marketNoise);
          actual = Math.max(0, actual); // Ensure non-negative
          
          // Confidence decreases slightly with time
          confidence = Math.max(0.7, 0.95 - (i * 0.01));
        } else {
          // Future predictions have lower confidence
          confidence = Math.max(0.6, 0.8 - ((i - 15) * 0.01));
        }
        
        predictions.push({
          product_id: product.id,
          date: date.toISOString().split('T')[0],
          predicted_demand: predicted,
          actual_demand: actual,
          confidence: Math.round(confidence * 100) / 100 // Round to 2 decimal places
        });
      });
    }
    
    return predictions.sort((a, b) => a.date.localeCompare(b.date));
  }

  private static getMockSalesData(): SalesData[] {
    const sales: SalesData[] = [];
    const products = ['P001', 'P002', 'P003', 'P004', 'P005'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      products.forEach((productId, index) => {
        sales.push({
          id: i * products.length + index + 1,
          product_id: productId,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          sales: Math.floor(Math.random() * 30) + 5,
          date: date.toISOString().split('T')[0]
        });
      });
    }
    
    return sales;
  }

  private static getMockTrendsData() {
    const trends = [];
    const dayCount = 60; // 2 months of data for better visualization
    
    // Base values for realistic progression
    let baseInventory = 180;
    let baseSales = 25;
    let baseRestocks = 2;
    let baseAlerts = 3;
    
    for (let i = dayCount; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isMonday = dayOfWeek === 1;
      const isFriday = dayOfWeek === 5;
      
      // Weekly patterns - higher sales midweek, restocks on Monday
      const weeklyMultiplier = isWeekend ? 0.6 : (isFriday ? 1.3 : 1.0);
      const restockMultiplier = isMonday ? 2.5 : (isWeekend ? 0.2 : 1.0);
      
      // Monthly trends - simulate seasonal variations
      const monthProgress = (dayCount - i) / dayCount;
      const seasonalTrend = 1 + Math.sin(monthProgress * Math.PI * 2) * 0.2;
      
      // Calculate values with realistic relationships
      const dailySales = Math.round(baseSales * weeklyMultiplier * seasonalTrend * (0.8 + Math.random() * 0.4));
      const dailyRestocks = Math.round(baseRestocks * restockMultiplier * (0.5 + Math.random() * 1.0));
      
      // Inventory follows sales patterns (depletes with sales, increases with restocks)
      const inventoryChange = dailyRestocks * 15 - dailySales; // Each restock adds ~15 units
      baseInventory = Math.max(50, baseInventory + inventoryChange + (Math.random() - 0.5) * 10);
      
      // Alerts increase when inventory is low
      const inventoryRatio = baseInventory / 200;
      const alertProbability = inventoryRatio < 0.4 ? 0.8 : (inventoryRatio < 0.6 ? 0.4 : 0.1);
      const dailyAlerts = Math.random() < alertProbability ? Math.round(baseAlerts * (1.5 - inventoryRatio)) : 0;
      
      // Determine alert severity based on alert count
      const alertSeverity: 'low' | 'medium' | 'high' = dailyAlerts > 5 ? 'high' : (dailyAlerts > 2 ? 'medium' : 'low');
      
      // Use YYYY-MM-DD format for consistency
      const dateString = date.toISOString().split('T')[0];
      
      trends.push({
        date: dateString,
        inventory_level: Math.round(baseInventory),
        sales: dailySales,
        restocks: dailyRestocks,
        alerts: dailyAlerts,
        // Additional analytics metrics
        inventory_turnover: Math.round((dailySales / baseInventory) * 100) / 100,
        stock_coverage_days: Math.round(baseInventory / (dailySales || 1)),
        restock_efficiency: Math.round((dailyRestocks > 0 ? dailySales / dailyRestocks : 0) * 100) / 100,
        alert_severity: alertSeverity
      });
    }
    
    // Sort by date to ensure proper chronological order
    const sortedTrends = trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log('Generated mock trends data:', sortedTrends.length, 'entries');
    console.log('Date range:', sortedTrends[0]?.date, 'to', sortedTrends[sortedTrends.length - 1]?.date);
    
    return sortedTrends;
  }
}

export default WarehouseAPI;
