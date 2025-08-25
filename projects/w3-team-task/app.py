from flask import Flask, jsonify
import joblib
from geopy.distance import geodesic
from flask import Flask, request, jsonify, render_template
from geopy.distance import geodesic
import datetime
import joblib
from get_gps import get_latest_position

app = Flask(__name__)
model = joblib.load("delivery_eta_model.pkl")

# Set destination for testing
DROPOFF_LAT = 14.6091
DROPOFF_LNG = 121.0223

def get_eta(current_lat, current_lng, dropoff_lat, dropoff_lng, model):
    distance = geodesic((current_lat, current_lng), (dropoff_lat, dropoff_lng)).km
    hour = datetime.datetime.now().hour
    weekday = datetime.datetime.now().weekday()
    features = [[distance, hour, weekday]]
    eta_minutes = model.predict(features)[0]
    return eta_minutes

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/live_eta")
def live_eta():
    pos = get_latest_position()
    if not pos:
        return jsonify({"error": "No GPS data available"}), 400

    eta = get_eta(pos["lat"], pos["lng"], DROPOFF_LAT, DROPOFF_LNG, model)
    return jsonify({
        "eta_minutes": round(eta, 2),
        "current_location": f"{pos['lat']}, {pos['lng']}",
        "timestamp": pos["timestamp"]
    })

if __name__ == "__main__":
    app.run(debug=True)
