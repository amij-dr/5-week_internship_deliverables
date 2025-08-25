from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock data generators
def generate_inventory_data():
    products = [
        {'id': 'P001', 'name': 'Widget A', 'base_stock': 45, 'threshold': 50, 'location': 'A1'},
        {'id': 'P002', 'name': 'Widget B', 'base_stock': 15, 'threshold': 30, 'location': 'A2'},
        {'id': 'P003', 'name': 'Widget C', 'base_stock': 8, 'threshold': 25, 'location': 'B1'},
        {'id': 'P004', 'name': 'Widget D', 'base_stock': 75, 'threshold': 40, 'location': 'B2'},
        {'id': 'P005', 'name': 'Widget E', 'base_stock': 32, 'threshold': 35, 'location': 'C1'},
        {'id': 'P006', 'name': 'Widget F', 'base_stock': 22, 'threshold': 30, 'location': 'C2'},
        {'id': 'P007', 'name': 'Widget G', 'base_stock': 5, 'threshold': 20, 'location': 'D1'},
        {'id': 'P008', 'name': 'Widget H', 'base_stock': 88, 'threshold': 60, 'location': 'D2'}
    ]
    
    inventory_data = []
    for product in products:
        # Add some variation to stock levels
        variation = random.randint(-10, 20)
        stock = max(0, product['base_stock'] + variation)
        
        inventory_data.append({
            'product_id': product['id'],
            'product_name': product['name'],
            'stock': stock,
            'min_threshold': product['threshold'],
            'location': product['location'],
            'last_updated': datetime.now().isoformat()
        })
    
    return inventory_data

def generate_sensor_alerts():
    products = ['P001', 'P002', 'P003', 'P004', 'P005']
    alert_types = [
        'Critical: Immediate restock needed',
        'Low: Restock recommended',
        'Warning: Below threshold',
        'Alert: Stock depletion detected',
        'Notice: Approaching minimum threshold'
    ]
    
    alerts = []
    for i in range(random.randint(5, 15)):
        alerts.append({
            'id': i + 1,
            'product_id': random.choice(products),
            'stock': random.randint(1, 50),
            'alert': random.choice(alert_types),
            'timestamp': (datetime.now() - timedelta(hours=random.randint(0, 72))).isoformat()
        })
    
    return sorted(alerts, key=lambda x: x['timestamp'], reverse=True)

def generate_rfid_logs(start_date=None, end_date=None):
    locations = ['Zone A', 'Zone B', 'Zone C', 'Dock 1', 'Dock 2']
    products = ['P001', 'P002', 'P003', 'P004', 'P005']
    scan_types = ['in', 'out', 'move']
    
    logs = []
    for i in range(100):
        timestamp = datetime.now() - timedelta(
            days=random.randint(0, 7),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        # Filter by date range if provided
        if start_date and timestamp < datetime.fromisoformat(start_date):
            continue
        if end_date and timestamp > datetime.fromisoformat(end_date):
            continue
            
        logs.append({
            'id': i + 1,
            'product_id': random.choice(products),
            'location': random.choice(locations),
            'timestamp': timestamp.isoformat(),
            'scan_type': random.choice(scan_types)
        })
    
    return sorted(logs, key=lambda x: x['timestamp'], reverse=True)

def generate_demand_predictions(product_id=None):
    products = [
        {'id': 'P001', 'base_demand': 25, 'volatility': 0.3, 'seasonal': 1.0},
        {'id': 'P002', 'base_demand': 18, 'volatility': 0.5, 'seasonal': 1.2},
        {'id': 'P003', 'base_demand': 35, 'volatility': 0.7, 'seasonal': 0.8},
        {'id': 'P004', 'base_demand': 12, 'volatility': 0.2, 'seasonal': 1.1},
        {'id': 'P005', 'base_demand': 28, 'volatility': 0.4, 'seasonal': 0.9}
    ]
    
    if product_id:
        products = [p for p in products if p['id'] == product_id]
    
    predictions = []
    for i in range(30):  # 30 days of predictions
        date = datetime.now() + timedelta(days=i)
        
        for product in products:
            # Calculate predicted demand with some randomness
            base_variation = 1 + (random.random() - 0.5) * product['volatility']
            predicted = int(product['base_demand'] * product['seasonal'] * base_variation)
            
            # Generate actual demand for past days (first 15 days)
            actual = None
            confidence = 0.85
            
            if i < 15:
                accuracy_factor = 0.9 + random.random() * 0.2
                actual = max(0, int(predicted * accuracy_factor))
                confidence = max(0.7, 0.95 - i * 0.01)
            else:
                confidence = max(0.6, 0.8 - (i - 15) * 0.01)
            
            predictions.append({
                'product_id': product['id'],
                'date': date.strftime('%Y-%m-%d'),
                'predicted_demand': predicted,
                'actual_demand': actual,
                'confidence': round(confidence, 2)
            })
    
    return sorted(predictions, key=lambda x: x['date'])

# API Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/inventory-levels', methods=['GET'])
def get_inventory_levels():
    try:
        data = generate_inventory_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sensor-alert', methods=['GET'])
def get_sensor_alerts():
    try:
        data = generate_sensor_alerts()
        return jsonify({'sensor_alerts': data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/rfid-logs', methods=['GET'])
def get_rfid_logs():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        data = generate_rfid_logs(start_date, end_date)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict-demand', methods=['GET'])
@app.route('/predict-demand/<product_id>', methods=['GET'])
def get_demand_predictions(product_id=None):
    try:
        data = generate_demand_predictions(product_id)
        return jsonify({'predictions': data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask API server...")
    print("Available endpoints:")
    print("  GET /health - Health check")
    print("  GET /inventory-levels - Get current inventory levels")
    print("  GET /sensor-alert - Get sensor alerts")
    print("  GET /rfid-logs - Get RFID logs")
    print("  GET /predict-demand - Get demand predictions")
    print("  GET /predict-demand/<product_id> - Get demand predictions for specific product")
    print("\nServer running on http://localhost:5001")
    
    app.run(debug=True, host='0.0.0.0', port=5001)
