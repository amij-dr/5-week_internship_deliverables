import pandas as pd
import psycopg2
from datetime import datetime

# Load CSV
df = pd.read_csv(r"C:\Users\jimal\inventory-management\data\inventory_data.csv")

# Format 'last_scanned' column if missing
if 'last_scanned' not in df.columns:
    df['last_scanned'] = datetime.now()

# Format 'status' column if missing
if 'status' not in df.columns:
    df['status'] = 'IN'

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname="warehouse",
    user="postgres",
    password="hellopogi0164",
    host="localhost",
    port=5432
)
cur = conn.cursor()

# Insert each row
for _, row in df.iterrows():
    cur.execute("""
        INSERT INTO inventory (sku, product_name, quantity, last_scanned, status)
        VALUES (%s, %s, %s, %s, %s)
    """, (row['sku'], row['product_name'], int(row['quantity']), row['last_scanned'], row['status']))

conn.commit()
cur.close()
conn.close()

print("Inserted all data successfully.")
