# Flask API for Smart Warehouse Management System

This Flask API provides endpoints for IoT sensor data, RFID tracking, inventory management, and demand predictions.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5001`

## API Endpoints

- `GET /health` - Health check
- `GET /inventory-levels` - Get current inventory levels
- `GET /sensor-alert` - Get sensor alerts
- `GET /rfid-logs` - Get RFID logs (supports date filtering)
- `GET /predict-demand` - Get demand predictions for all products
- `GET /predict-demand/<product_id>` - Get demand predictions for specific product

## Example Usage

```bash
# Get inventory levels
curl http://localhost:5001/inventory-levels

# Get sensor alerts
curl http://localhost:5001/sensor-alert

# Get RFID logs with date filter
curl "http://localhost:5001/rfid-logs?start_date=2025-08-01&end_date=2025-08-08"

# Get demand predictions
curl http://localhost:5001/predict-demand

# Get demand predictions for specific product
curl http://localhost:5001/predict-demand/P001
```
