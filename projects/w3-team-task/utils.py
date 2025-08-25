import pandas as pd
from geopy.distance import geodesic
import datetime
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Load data
df = pd.read_csv("historical_deliveries.csv")
 
# Feature engineering
df['pickup_time'] = pd.to_datetime(df['pickup_time'])
df['dropoff_time'] = pd.to_datetime(df['dropoff_time'])
df['travel_time_minutes'] = (df['dropoff_time'] - df['pickup_time']).dt.total_seconds() / 60
df['distance_km'] = df.apply(lambda row: geodesic((row['pickup_lat'], row['pickup_lng']),
                                                  (row['dropoff_lat'], row['dropoff_lng'])).km, axis=1)
df['hour'] = df['pickup_time'].dt.hour
df['weekday'] = df['pickup_time'].dt.weekday

print(df.head())

print("Data training")
X = df[['distance_km', 'hour', 'weekday']]
y = df['travel_time_minutes']
 
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
 
model = RandomForestRegressor()
model.fit(X_train, y_train) 
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions) 
print(f"Mean Absolute Error: {mae:.2f} minutes")

# Save the model
joblib.dump(model, "delivery_eta_model.pkl")


