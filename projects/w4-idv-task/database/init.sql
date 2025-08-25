-- Don't create the database (it's already created via POSTGRES_DB env var)

-- Switch to the database
\c warehouse;

-- Create table only if it doesn't exist
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(20),
  product_name TEXT,
  quantity INT,
  last_scanned TIMESTAMP,
  status VARCHAR(10)
);