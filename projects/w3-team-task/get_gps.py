import requests
from requests.auth import HTTPBasicAuth

# Traccar server config
TRACCAR_API_URL = "http://localhost:8082/api/positions"
USERNAME = "jimalyn.delrosario1@gmail.com"
PASSWORD = "hellopogi0164"

def get_latest_position():
    response = requests.get(TRACCAR_API_URL, auth=HTTPBasicAuth(USERNAME, PASSWORD))
    data = response.json()

    if not data:
        return None

    # Assuming one device only, take the first position
    position = data[0]
    return {
        "device_id": position["deviceId"],
        "lat": position["latitude"],
        "lng": position["longitude"],
        "timestamp": position["fixTime"]
    }

# Test
if __name__ == "__main__":
    pos = get_latest_position()
    if pos:
        print(f"GPS Position: {pos['lat']}, {pos['lng']} at {pos['timestamp']}")
    else:
        print("No GPS data available.")
