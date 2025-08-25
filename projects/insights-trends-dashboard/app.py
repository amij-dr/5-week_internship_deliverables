"""
Flask Application for TWX Insights Dashboard
Provides REST API endpoints for analytics insights and trends
"""

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from datetime import datetime
from collections import Counter
import logging
import config
from database import db_service

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Helper function for standardized API responses
def create_api_response(success: bool, data: any = None, error: str = None, metadata: dict = None):
    """Create standardized API response"""
    response = {"success": success}
    
    if data is not None:
        response["data"] = data
    
    if error:
        response["error"] = error
    
    if metadata:
        response["metadata"] = metadata
    else:
        response["metadata"] = {"generated_at": datetime.now().isoformat()}
    
    return jsonify(response)

# Routes
@app.route('/')
def dashboard():
    """Serve the main dashboard HTML page"""
    try:
        return send_file('dashboard.html')
    except Exception as e:
        logger.error(f"Error serving dashboard: {e}")
        return create_api_response(False, error="Dashboard not available")

@app.route('/api/driver-performance')
def get_driver_performance():
    """API endpoint for driver performance over time data"""
    try:
        days = request.args.get('days', config.DEFAULT_DAYS_RANGE, type=int)
        days = min(days, config.MAX_DAYS_RANGE)  # Enforce maximum
        
        driver_filter = request.args.get('driver', None)
        
        data = db_service.get_driver_performance_data(days)
        
        if driver_filter:
            data = [d for d in data if d['driver_name'].lower() == driver_filter.lower()]
        
        metadata = {
            "total_drivers": len(data),
            "date_range": days,
            "generated_at": datetime.now().isoformat()
        }
        
        return create_api_response(True, data, metadata=metadata)
        
    except Exception as e:
        logger.error(f"Error in get_driver_performance: {e}")
        return create_api_response(False, error="Failed to fetch driver performance data")

@app.route('/api/support-issues')
def get_support_issues():
    """API endpoint for support issues data"""
    try:
        days = request.args.get('days', config.DEFAULT_DAYS_RANGE, type=int)
        days = min(days, config.MAX_DAYS_RANGE)
        
        issues = db_service.get_support_issues_data(days)
        
        # Aggregate data
        tag_counts = Counter(issue['tag'] for issue in issues)
        severity_counts = Counter(issue['severity'] for issue in issues)
        
        response_data = {
            "tag_distribution": dict(tag_counts),
            "severity_distribution": dict(severity_counts),
            "total_issues": len(issues),
            "resolved_issues": len([i for i in issues if i['resolved']]),
            "raw_data": issues
        }
        
        metadata = {
            "date_range": days,
            "generated_at": datetime.now().isoformat()
        }
        
        return create_api_response(True, response_data, metadata=metadata)
        
    except Exception as e:
        logger.error(f"Error in get_support_issues: {e}")
        return create_api_response(False, error="Failed to fetch support issues data")

@app.route('/api/delivery-activity')
def get_delivery_activity():
    """API endpoint for delivery activity by days/times"""
    try:
        days = request.args.get('days', config.DEFAULT_DAYS_RANGE, type=int)
        days = min(days, config.MAX_DAYS_RANGE)
        
        daily_data = db_service.get_delivery_activity_data(days)
        
        # Calculate aggregations
        from collections import defaultdict
        day_totals = defaultdict(list)
        hour_totals = defaultdict(int)
        
        for day_data in daily_data:
            if day_data['day_name']:
                day_totals[day_data['day_name']].append(day_data['total_deliveries'])
            for hour_data in day_data['hourly_data']:
                hour_totals[hour_data['hour']] += hour_data['deliveries']
        
        # Calculate averages
        day_averages = {day: sum(counts)/len(counts) if counts else 0 
                       for day, counts in day_totals.items()}
        
        response_data = {
            "daily_data": daily_data,
            "day_averages": day_averages,
            "hourly_totals": dict(hour_totals)
        }
        
        metadata = {
            "date_range": days,
            "generated_at": datetime.now().isoformat()
        }
        
        return create_api_response(True, response_data, metadata=metadata)
        
    except Exception as e:
        logger.error(f"Error in get_delivery_activity: {e}")
        return create_api_response(False, error="Failed to fetch delivery activity data")

@app.route('/api/client-locations')
def get_client_locations():
    """API endpoint for frequent client drop-off locations"""
    try:
        limit = request.args.get('limit', config.DEFAULT_LOCATION_LIMIT, type=int)
        
        data = db_service.get_client_locations_data(limit)
        
        metadata = {
            "total_locations": len(data),
            "showing_top": limit,
            "generated_at": datetime.now().isoformat()
        }
        
        return create_api_response(True, data, metadata=metadata)
        
    except Exception as e:
        logger.error(f"Error in get_client_locations: {e}")
        return create_api_response(False, error="Failed to fetch client locations data")

@app.route('/api/route-delivery-times')
def get_route_delivery_times():
    """API endpoint for average delivery time per route"""
    try:
        data = db_service.get_route_delivery_times_data()
        
        metadata = {
            "total_routes": len(data),
            "generated_at": datetime.now().isoformat()
        }
        
        return create_api_response(True, data, metadata=metadata)
        
    except Exception as e:
        logger.error(f"Error in get_route_delivery_times: {e}")
        return create_api_response(False, error="Failed to fetch route delivery times data")

@app.route('/api/dashboard-summary')
def get_dashboard_summary():
    """API endpoint for overall dashboard summary"""
    try:
        summary_data = db_service.get_dashboard_summary_data(7)  # Last 7 days
        
        metadata = {
            "period": "Last 7 days",
            "generated_at": datetime.now().isoformat()
        }
        
        return create_api_response(True, summary_data, metadata=metadata)
        
    except Exception as e:
        logger.error(f"Error in get_dashboard_summary: {e}")
        return create_api_response(False, error="Failed to fetch dashboard summary data")

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return create_api_response(False, error="Endpoint not found"), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return create_api_response(False, error="Internal server error"), 500

if __name__ == '__main__':
    try:
        logger.info(f"Starting TWX Insights Dashboard on {config.SERVER_HOST}:{config.SERVER_PORT}")
        app.run(
            debug=config.DEBUG_MODE, 
            host=config.SERVER_HOST, 
            port=config.SERVER_PORT
        )
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
    finally:
        logger.info("Application shutdown")
