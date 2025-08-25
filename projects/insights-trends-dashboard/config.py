"""
Configuration settings for TWX Insights Dashboard
"""
import os
from typing import Dict, List

# Server Configuration
SERVER_HOST: str = "0.0.0.0"
SERVER_PORT: int = 5000
DEBUG_MODE: bool = True

# MySQL Database Configuration
DATABASE_CONFIG: Dict[str, any] = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'twx_insights'),
    'charset': 'utf8mb4',
    'autocommit': True
}

# API Configuration
DEFAULT_DAYS_RANGE: int = 30
MAX_DAYS_RANGE: int = 90
DEFAULT_LOCATION_LIMIT: int = 15

# Auto-refresh Settings (milliseconds)
DASHBOARD_REFRESH_INTERVAL: int = 300000  # 5 minutes

# Chart Colors (Hex codes)
CHART_COLORS: List[str] = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#06b6d4", "#84cc16", "#f97316",
    "#e11d48", "#059669", "#7c3aed", "#dc2626"
]
