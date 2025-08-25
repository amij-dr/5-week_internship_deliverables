# Smart Warehouse Analytics Dashboard

A comprehensive real-time warehouse management system built with Next.js, featuring advanced analytics, demand prediction, and RFID activity monitoring.

## 📊 Dashboard Overview

The Smart Warehouse Dashboard provides real-time insights into warehouse operations through interactive visualizations and key performance indicators. The system integrates inventory management, demand forecasting, RFID tracking, and trend analysis into a unified interface.

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # API utilities
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Utility functions
backend/
├── flask-api/                  # Python Flask API
└── laravel/                   # PHP Laravel API
```

## 📈 Components Documentation

### 1. Dashboard Header (`DashboardHeader.tsx`)

**Purpose**: Provides navigation, controls, and summary metrics at the top of the dashboard.

**Features**:
- Product filtering dropdown
- Refresh interval selector (10s, 30s, 1m, 5m)
- Manual refresh button
- Real-time loading indicators
- Responsive design with mobile optimization

**Props**:
```typescript
interface DashboardHeaderProps {
  selectedProduct: string;
  products: string[];
  refreshInterval: number;
  loading: boolean;
  onProductChange: (productId: string) => void;
  onIntervalChange: (interval: number) => void;
  onRefresh: () => void;
}
```

### 2. Metrics Sidebar (`MetricsSidebar.tsx`)

**Purpose**: Displays key warehouse performance indicators in an easy-to-scan format.

**Metrics Displayed**:
- **Total Products**: Number of unique products in inventory
- **Low Stock Items**: Products below their minimum threshold
- **Total Inventory**: Sum of all product quantities
- **RFID Activity**: Total scan events across all locations

**Features**:
- Color-coded metric cards (blue, red, emerald, purple)
- Interactive hover effects
- Formatted number displays
- Icon-based visual indicators

**Visual Design**:
- Glass morphism effect with backdrop blur
- Responsive card layout
- Consistent spacing and typography

### 3. Inventory Chart (`InventoryChart.tsx`)

**Purpose**: Visualizes current stock levels across all products with status indicators.

**Chart Type**: Horizontal Bar Chart (Chart.js)

**Features**:
- **Color-coded bars** based on stock status:
  - 🔴 **Critical** (< 50% of threshold): Red
  - 🟡 **Low** (< threshold): Orange/Amber
  - 🟢 **Normal** (>= threshold): Green
- **Compact sidebar** with quick stats
- **Interactive tooltips** showing detailed stock information
- **Responsive layout** with side-by-side and full-width modes

**Data Structure**:
```typescript
interface InventoryData {
  product_id: string;
  product_name?: string;
  stock: number;
  min_threshold?: number;
  last_updated: string;
}
```

**Status Calculation**:
- Critical: `stock < threshold * 0.5`
- Low: `stock < threshold`
- Normal: `stock >= threshold`

### 4. Demand Chart (`DemandChart.tsx`)

**Purpose**: Compares predicted vs. actual demand with accuracy metrics.

**Chart Type**: Line Chart (Chart.js)

**Features**:
- **Dual-line visualization**:
  - Blue line: Predicted demand
  - Green line: Actual demand (historical data only)
- **Accuracy calculation**: Percentage match between predicted and actual
- **Time-series data** with proper date formatting
- **Product filtering** support
- **Confidence indicators** for predictions

**Key Metrics**:
- **Prediction Accuracy**: `(1 - |predicted - actual| / actual) * 100`
- **Data Coverage**: Shows available actual vs. predicted data points
- **Trend Direction**: Visual indication of demand patterns

**Data Structure**:
```typescript
interface DemandData {
  date: string;
  actual_demand?: number;
  predicted_demand: number;
  product_id: string;
}
```

### 5. RFID Heatmap (`RFIDHeatmap.tsx`)

**Purpose**: Displays warehouse activity patterns by location and time using a custom canvas-based heatmap.

**Visualization**: Custom Canvas Heatmap

**Features**:
- **24-hour time grid** (X-axis: 0-23 hours)
- **Location-based rows** (Y-axis: warehouse zones)
- **Activity intensity** represented by color gradients
- **Interactive hover** with activity details
- **Statistical summaries**:
  - Total activity count
  - Peak activity hour
  - Most active location

**Color Scheme**:
- Light colors: Low activity
- Dark red/intense colors: High activity
- Gradient mapping based on maximum activity

**Data Processing**:
```typescript
interface RFIDData {
  location: string;
  hour: number;
  activity_count: number;
  product_id?: string;
  timestamp?: string;
}
```

**Canvas Rendering**:
- Custom drawing functions for cells, labels, and legends
- Responsive sizing based on data dimensions
- High-DPI support for crisp visuals

### 6. Trends Chart (`TrendsChart.tsx`)

**Purpose**: Shows historical warehouse performance across multiple metrics over time.

**Chart Type**: Multi-line Chart (Chart.js)

**Metrics Tracked**:
- **Inventory Level**: Total units in stock
- **Sales**: Daily/weekly sales volume
- **Restocks**: Replenishment events
- **Alerts**: System notifications and warnings

**Additional Analytics**:
- **Inventory Turnover**: Sales-to-inventory ratio
- **Stock Coverage**: Days of inventory remaining
- **Restock Efficiency**: Sales per restock event
- **Alert Severity**: Categorized warning levels

**Features**:
- **Multi-axis scaling** for different metric ranges
- **Trend direction indicators**
- **Statistical summaries** in sidebar
- **Time period filtering**
- **Smooth line interpolation**

**Data Structure**:
```typescript
interface TrendsData {
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
```

### 7. Chart Components (`ChartComponents.tsx`)

**Purpose**: Reusable UI components for consistent chart presentation.

**Components Available**:

#### ChartCard
- **Purpose**: Wrapper for all chart visualizations
- **Features**: Title, description, glass morphism styling, responsive layout
- **Props**: `title`, `description`, `children`, `useSideLayout`

#### StatCard
- **Purpose**: Display individual metrics with color coding
- **Colors**: blue, green, red, amber, purple, emerald
- **Features**: Icon support, formatted values, hover effects

#### CompactMetricsSidebar
- **Purpose**: Space-efficient metrics display for side layouts
- **Layout**: Vertical stack with minimal spacing
- **Use case**: When chart and metrics share limited space

#### CompactMetricCard
- **Purpose**: Condensed version of StatCard for sidebars
- **Features**: Icon, value, label in compact format
- **Colors**: Same color scheme as StatCard

### 8. Loading States (`DashboardLoading.tsx`)

**Purpose**: Provides feedback during data fetching operations.

**Features**:
- **Animated spinner** with gradient effects
- **Status messages** indicating current operation
- **Backdrop blur** for visual consistency
- **Responsive positioning**

## 🔧 Utility Functions

### Dashboard Utils (`dashboardUtils.ts`)

**Functions**:
- `calculateDashboardMetrics()`: Computes summary statistics
- `getStockStatus()`: Determines inventory status levels
- `formatNumber()`: Applies locale-specific number formatting
- `formatPercentage()`: Standardizes percentage display

### Inventory Utils (`inventoryUtils.ts`)

**Functions**:
- `processInventoryData()`: Removes duplicates, gets latest data
- `generateInventoryColors()`: Maps status to color schemes
- `calculateInventoryStats()`: Computes critical/low/normal counts
- `createInventoryTooltipCallback()`: Custom tooltip formatting

### RFID Utils (`rfidUtils.ts`)

**Functions**:
- `processRFIDData()`: Converts logs to heatmap matrix
- `calculateCanvasDimensions()`: Responsive canvas sizing
- `drawHeatmapCells()`: Canvas rendering for activity cells
- `calculateRFIDStats()`: Activity analytics and peak detection

### Chart Config (`chartConfig.ts`)

**Configurations**:
- **Color Palettes**: Consistent color schemes across charts
- **Font Settings**: Typography standards for all visualizations
- **Responsive Breakpoints**: Mobile and desktop layout rules
- **Theme Integration**: Light/dark mode support

## 📊 Key Metrics Explained

### Dashboard Metrics

1. **Total Products**
   - Count of unique product IDs in inventory
   - Helps understand inventory diversity

2. **Low Stock Items**
   - Products below their minimum threshold
   - Critical for reorder planning

3. **Total Inventory**
   - Sum of all product quantities
   - Indicates overall stock levels

4. **RFID Activity**
   - Total scan events across locations
   - Measures warehouse operational intensity

### Inventory Status Classifications

1. **Critical** (Red)
   - Stock < 50% of minimum threshold
   - Requires immediate reordering

2. **Low** (Orange)
   - Stock < minimum threshold
   - Restock recommended soon

3. **Normal** (Green)
   - Stock >= minimum threshold
   - Adequate supply levels

### Demand Prediction Accuracy

- **Calculation**: `(1 - |predicted - actual| / actual) * 100`
- **Range**: 0-100%
- **Interpretation**: Higher percentages indicate better prediction models

### Trends Analytics

1. **Inventory Turnover**
   - Formula: `sales / inventory_level`
   - Measures how quickly stock converts to sales

2. **Stock Coverage Days**
   - Formula: `inventory_level / daily_sales`
   - Estimates days until stockout

3. **Restock Efficiency**
   - Formula: `sales / restocks`
   - Measures sales generated per restock event

## 🔄 Data Flow

### 1. Data Sources
- **Flask API** (`http://localhost:5001`): Real-time sensor data, RFID logs
- **Laravel API** (`http://localhost:8000/api`): Sales data, historical records
- **Mock Data**: Fallback for development and testing

### 2. Data Processing Pipeline
```
Raw API Data → Data Validation → Processing Utils → Chart Components → Visual Display
```

### 3. Refresh Mechanisms
- **Auto-refresh**: Configurable intervals (10s, 30s, 1m, 5m)
- **Manual refresh**: User-triggered via header button
- **Error handling**: Graceful degradation to mock data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+ (for Flask API)
- PHP 8.0+ (for Laravel API)
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smart-warehouse-team
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Set up backend services**
```bash
# Flask API
cd backend/flask-api
pip install -r requirements.txt

# Laravel API
cd ../laravel
composer install
```

4. **Configure environment variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api

# Flask API (.env)
FLASK_ENV=development
DATABASE_URL=your_database_url

# Laravel API (.env)
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=warehouse_db
```

### Running the Application

1. **Start backend services**
```bash
# Start Flask API (Terminal 1)
cd backend/flask-api
python app.py

# Start Laravel API (Terminal 2)
cd backend/laravel
php artisan serve

# Or use the batch file
./start-backends.bat
```

2. **Start frontend development server**
```bash
cd frontend
npm run dev
```

3. **Access the application**
- Frontend: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`



*Last updated: August 2025*
