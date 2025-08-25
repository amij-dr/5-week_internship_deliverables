"""
Utility functions for TWX Insights Dashboard
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class DataValidator:
    """Validate and sanitize input data"""
    
    @staticmethod
    def validate_days_range(days: int, max_days: int = 90) -> int:
        """Validate and clamp days range"""
        if days < 1:
            return 1
        if days > max_days:
            return max_days
        return days
    
    @staticmethod
    def validate_limit(limit: int, max_limit: int = 50) -> int:
        """Validate and clamp limit values"""
        if limit < 1:
            return 1
        if limit > max_limit:
            return max_limit
        return limit

class ResponseFormatter:
    """Format API responses consistently"""
    
    @staticmethod
    def success_response(data: Any, metadata: Optional[Dict] = None) -> Dict:
        """Create a success response"""
        response = {
            "success": True,
            "data": data,
            "metadata": metadata or {"generated_at": datetime.now().isoformat()}
        }
        return response
    
    @staticmethod
    def error_response(error_message: str, status_code: int = 400) -> Dict:
        """Create an error response"""
        return {
            "success": False,
            "error": error_message,
            "metadata": {"generated_at": datetime.now().isoformat()}
        }

class DatabaseUtils:
    """Database utility functions"""
    
    @staticmethod
    def safe_float_conversion(value: Any, default: float = 0.0) -> float:
        """Safely convert value to float"""
        try:
            return float(value) if value is not None else default
        except (ValueError, TypeError):
            return default
    
    @staticmethod
    def safe_int_conversion(value: Any, default: int = 0) -> int:
        """Safely convert value to int"""
        try:
            return int(value) if value is not None else default
        except (ValueError, TypeError):
            return default
    
    @staticmethod
    def format_date(date_obj: Any) -> Optional[str]:
        """Safely format date object to string"""
        if date_obj is None:
            return None
        try:
            if isinstance(date_obj, datetime):
                return date_obj.strftime("%Y-%m-%d")
            return str(date_obj)
        except (ValueError, AttributeError):
            return None

def setup_logging(level: str = "INFO") -> None:
    """Setup logging configuration"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('insights.log')
        ]
    )
