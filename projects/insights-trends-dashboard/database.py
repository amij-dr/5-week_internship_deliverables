"""
Database Service Module
Handles MySQL database connections and data retrieval for TWX Insights Dashboard
"""

import config
import logging
from datetime import datetime, timedelta
from collections import defaultdict
from typing import List, Dict, Any, Optional
from contextlib import contextmanager

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import MySQL connector with fallback
try:
    import mysql.connector
    mysql_lib = mysql.connector
    logger.info("Using mysql-connector-python")
except ImportError:
    try:
        import pymysql
        mysql_lib = pymysql
        logger.info("Using pymysql")
    except ImportError:
        logger.error("No MySQL connector available. Please install mysql-connector-python or pymysql")
        raise ImportError("No MySQL connector available")


class DatabaseService:
    def __init__(self):
        self.mysql_lib = mysql_lib
        
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        connection = None
        try:
            connection = self.mysql_lib.connect(**config.DATABASE_CONFIG)
            yield connection
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            if connection:
                connection.rollback()
            raise
        finally:
            if connection:
                connection.close()
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results as list of dictionaries"""
        try:
            with self.get_connection() as connection:
                cursor = connection.cursor()
                cursor.execute(query, params or ())
                
                if cursor.description:
                    columns = [desc[0] for desc in cursor.description]
                    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
                    cursor.close()
                    return results
                else:
                    cursor.close()
                    return []
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            return []
    
    def get_driver_performance_data(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get driver performance data from database"""
        query = """
        SELECT 
            dp.full_name as driver_name,
            dph.performance_date as date,
            dph.daily_rating as rating,
            COUNT(DISTINCT d.id) as deliveries_completed,
            AVG(CASE WHEN d.delivery_status = 'delivered' THEN 1 ELSE 0 END) * 100 as on_time_percentage
        FROM driver_profiles dp
        LEFT JOIN driver_performance_history dph ON dp.id = dph.driver_id
        LEFT JOIN deliveries d ON dp.id = d.driver_id 
            AND DATE(d.created_at) = dph.performance_date
        WHERE dph.performance_date >= DATE_SUB(CURDATE(), INTERVAL %s DAY)
        GROUP BY dp.id, dp.full_name, dph.performance_date, dph.daily_rating
        ORDER BY dp.full_name, dph.performance_date
        """
        
        results = self.execute_query(query, (days,))
        
        # Group by driver
        drivers_data = defaultdict(list)
        for row in results:
            driver_name = row['driver_name']
            drivers_data[driver_name].append({
                "date": row['date'].strftime("%Y-%m-%d") if row['date'] else None,
                "rating": float(row['rating']) if row['rating'] else 0.0,
                "deliveries_completed": int(row['deliveries_completed']) if row['deliveries_completed'] else 0,
                "on_time_percentage": round(float(row['on_time_percentage']) if row['on_time_percentage'] else 0.0, 1)
            })
        
        return [{"driver_name": driver, "performance_data": data} 
                for driver, data in drivers_data.items()]
    
    def get_support_issues_data(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get support issues data from database"""
        query = """
        SELECT 
            DATE(created_at) as date,
            category as tag,
            status,
            created_at
        FROM support_tickets 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)
        ORDER BY created_at DESC
        """
        
        results = self.execute_query(query, (days,))
        
        # Tag and severity mappings
        tag_mapping = {
            'delivery_issue': 'Vehicle Breakdown',
            'payment_problem': 'Payment Issue',
            'driver_complaint': 'Client Complaint',
            'app_bug': 'App Bug',
            'account_issue': 'Documentation Problem',
            'general_inquiry': 'Communication Issue'
        }
        
        severity_mapping = {
            'open': 'High',
            'in_progress': 'Medium',
            'resolved': 'Low',
            'closed': 'Low'
        }
        
        return [{
            "date": row['date'].strftime("%Y-%m-%d") if row['date'] else None,
            "tag": tag_mapping.get(row['tag'], row['tag'].replace('_', ' ').title()),
            "severity": severity_mapping.get(row['status'], 'Medium'),
            "resolved": row['status'] in ['resolved', 'closed']
        } for row in results]
    
    def get_delivery_activity_data(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get delivery activity data by days and times"""
        query = """
        SELECT 
            DATE(delivery_date) as date,
            DAYNAME(delivery_date) as day_name,
            HOUR(delivery_time) as hour,
            COUNT(*) as deliveries
        FROM deliveries 
        WHERE delivery_date >= DATE_SUB(CURDATE(), INTERVAL %s DAY)
        GROUP BY DATE(delivery_date), HOUR(delivery_time)
        ORDER BY delivery_date, hour
        """
        
        results = self.execute_query(query, (days,))
        
        # Group by date
        daily_data = defaultdict(lambda: {
            'date': None,
            'day_name': None,
            'hourly_data': defaultdict(int),
            'total_deliveries': 0
        })
        
        for row in results:
            date_str = row['date'].strftime("%Y-%m-%d") if row['date'] else None
            if date_str:
                daily_data[date_str]['date'] = date_str
                daily_data[date_str]['day_name'] = row['day_name']
                daily_data[date_str]['hourly_data'][row['hour']] = row['deliveries']
                daily_data[date_str]['total_deliveries'] += row['deliveries']
        
        # Convert to expected format
        result = []
        for date_str, data in daily_data.items():
            hourly_data = [{"hour": hour, "deliveries": data['hourly_data'].get(hour, 0)} 
                          for hour in range(24)]
            
            result.append({
                "date": data['date'],
                "day_name": data['day_name'],
                "total_deliveries": data['total_deliveries'],
                "hourly_data": hourly_data
            })
        
        return sorted(result, key=lambda x: x['date'])
    
    def get_client_locations_data(self, limit: int = 15) -> List[Dict[str, Any]]:
        """Get frequent client drop-off locations data"""
        query = """
        SELECT 
            d.delivery_location as location,
            COUNT(*) as total_deliveries,
            AVG(d.delivery_duration_minutes) as avg_delivery_time_minutes,
            (COUNT(CASE WHEN d.delivery_status = 'delivered' THEN 1 END) / COUNT(*)) * 100 as success_rate
        FROM deliveries d
        GROUP BY d.delivery_location
        ORDER BY total_deliveries DESC
        LIMIT %s
        """
        
        results = self.execute_query(query, (limit,))
        
        return [{
            "location": row['location'],
            "total_deliveries": int(row['total_deliveries']),
            "avg_delivery_time_minutes": round(float(row['avg_delivery_time_minutes']), 1) if row['avg_delivery_time_minutes'] else 0,
            "success_rate": round(float(row['success_rate']), 1) if row['success_rate'] else 0,
            "peak_hours": [14, 15, 16]  # Default peak hours
        } for row in results]
    
    def get_route_delivery_times_data(self) -> List[Dict[str, Any]]:
        """Get average delivery time per route data"""
        query = """
        SELECT 
            ra.route_name as route,
            ra.avg_delivery_time_minutes,
            COUNT(d.id) as sample_size,
            MIN(d.delivery_duration_minutes) as fastest_time,
            MAX(d.delivery_duration_minutes) as slowest_time,
            STDDEV(d.delivery_duration_minutes) as std_deviation
        FROM route_analytics ra
        LEFT JOIN deliveries d ON ra.route_name = d.route_name
        GROUP BY ra.route_name, ra.avg_delivery_time_minutes
        ORDER BY ra.avg_delivery_time_minutes
        """
        
        results = self.execute_query(query, ())
        
        return [{
            "route": row['route'],
            "avg_delivery_time_minutes": round(float(row['avg_delivery_time_minutes']), 1) if row['avg_delivery_time_minutes'] else 0,
            "sample_size": int(row['sample_size']) if row['sample_size'] else 0,
            "fastest_time": int(row['fastest_time']) if row['fastest_time'] else 0,
            "slowest_time": int(row['slowest_time']) if row['slowest_time'] else 0,
            "std_deviation": round(float(row['std_deviation']), 1) if row['std_deviation'] else 0
        } for row in results]
    
    def get_dashboard_summary_data(self, days: int = 7) -> Dict[str, Any]:
        """Get dashboard summary statistics"""
        queries = {
            'deliveries': "SELECT COUNT(*) as total_deliveries FROM deliveries WHERE delivery_date >= DATE_SUB(CURDATE(), INTERVAL %s DAY)",
            'rating': "SELECT AVG(current_rating) as avg_rating FROM driver_profiles WHERE status = 1",
            'support': "SELECT COUNT(*) as open_issues FROM support_tickets WHERE status IN ('open', 'in_progress')",
            'drivers': "SELECT COUNT(*) as active_drivers FROM driver_profiles WHERE status = 1"
        }
        
        results = {}
        for key, query in queries.items():
            params = (days,) if key == 'deliveries' else ()
            result = self.execute_query(query, params)
            results[key] = result[0] if result else {}
        
        return {
            "total_deliveries_week": results['deliveries'].get('total_deliveries', 0),
            "avg_driver_rating": round(float(results['rating'].get('avg_rating', 0)), 2),
            "open_support_issues": results['support'].get('open_issues', 0),
            "active_drivers": results['drivers'].get('active_drivers', 0),
            "peak_delivery_hour": 14,
            "most_common_issue": "delivery_issue"
        }


# Global database service instance
db_service = DatabaseService()
