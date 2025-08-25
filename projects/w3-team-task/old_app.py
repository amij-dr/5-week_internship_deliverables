from flask import Flask, request, jsonify, render_template
from geopy.distance import geodesic
import datetime
import joblib
 
app = Flask(__name__)
model = joblib.load("delivery_eta_model.pkl")


def get_eta(current_lat, current_lng, dropoff_lat, dropoff_lng, model):
    distance = geodesic((current_lat, current_lng), (dropoff_lat, dropoff_lng)).km
    hour = datetime.datetime.now().hour
    weekday = datetime.datetime.now().weekday()
    features = [[distance, hour, weekday]]
    eta_minutes = model.predict(features)[0]
    return eta_minutes

@app.route('/')
def home():
    return render_template('old_index.html')

@app.route('/predict_eta', methods=['POST'])
def predict_eta():
	data = request.json
	current_lat = data['current_lat']
	current_lng = data['current_lng']
	dropoff_lat = data['dropoff_lat']
	dropoff_lng = data['dropoff_lng']
	
	eta = get_eta(current_lat, current_lng, dropoff_lat, dropoff_lng, model)
	message = "Arriving soon!" if eta < 5 else "On the way."
 
	return jsonify({"eta_minutes": round(eta, 2), "message": message})
 
if __name__ == "__main__":
    app.run(debug=True)
