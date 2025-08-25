# TWX Insights & Trends Dashboard

A Flask-based analytics dashboard that provides insights and trends for the TWX delivery platform. This dashboard connects to a MySQL database to display real-time analytics data and features a modern, interactive UI (see `dashboard.html`).

## Features

- **Driver Performance Analytics**: Track driver ratings, deliveries completed, and performance over time
- **Support Issues Tracking**: Monitor support ticket categories, resolution status, and trends
- **Delivery Activity Analysis**: Analyze delivery patterns by day, time, and location
- **Client Location Insights**: Identify frequent drop-off locations and delivery statistics
- **Route Performance**: Monitor average delivery times per route
- **Dashboard Summary**: Get quick overview statistics for key metrics


## Prerequisites

- Python 3.8 or higher
- MySQL Server (XAMPP, WAMP, or standalone)
- Flask and related dependencies
- MySQL connector: `mysql-connector-python` (recommended) or `pymysql`


## Database Setup

1. **Create the MySQL Database**:
   ```sql
   CREATE DATABASE twx_insights CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run the provided SQL script** (`twx_insights.sql`) to create tables and insert sample data.

3. **Update Database Configuration**:
   Edit `config.py` and update the `DATABASE_CONFIG` section with your MySQL credentials:
   ```python
   DATABASE_CONFIG = {
       'host': 'localhost',
       'user': 'root',
       'password': 'your_mysql_password',  # Update this
       'database': 'twx_insights',
       'charset': 'utf8mb4',
       'autocommit': True
   }
   ```


## Installation

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**:
   ```bash
   python app.py
   ```

3. **Access the Dashboard**:
   Open your browser and navigate to: `http://localhost:5000`


## API Endpoints

The dashboard provides the following REST API endpoints:

- `GET /` - Main dashboard HTML page
- `GET /api/driver-performance?days=30&driver=name` - Driver performance data
- `GET /api/support-issues?days=30` - Support issues analytics
- `GET /api/delivery-activity?days=30` - Delivery activity patterns
- `GET /api/client-locations?limit=15` - Client location statistics
- `GET /api/route-delivery-times` - Route performance data
- `GET /api/dashboard-summary` - Overall dashboard summa ry
