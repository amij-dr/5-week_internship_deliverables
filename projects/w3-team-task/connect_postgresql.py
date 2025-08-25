import pandas as pd
from sqlalchemy import create_engine

# Load CSV
df = pd.read_csv("historical_deliveries.csv")

# Connect to PostgreSQL
engine = create_engine("postgresql://postgres:hellopogi0164@localhost:5432/delivery_db")

# Insert into table
df.to_sql("deliveries", engine, if_exists="replace", index=False)
