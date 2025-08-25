from flask import Flask, request, jsonify
from datetime import datetime
import psycopg2

app = Flask(__name__)

@app.route('/rfid-scan', methods=['POST'])
def scan_barcode():
    data = request.json
    conn = psycopg2.connect(dbname="warehouse", user="postgres", password="hellopogi0164", host="postgres", port="5432")
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO inventory (sku, product_name, quantity, last_scanned, status)
        VALUES (%s, %s, %s, %s, %s)
    """, (data['sku'], data['product_name'], data['quantity'], datetime.now(), data['status']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Scanned successfully"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)

