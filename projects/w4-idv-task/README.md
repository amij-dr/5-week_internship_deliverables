# 📦 Smart Warehouse & Inventory Management System

This project simulates a smart warehouse inventory system using barcode scanning, data visualization, and analytics. It's built as part of a 5-week data science internship to integrate multiple technologies in a full-stack environment.

---

## 🔧 Tech Stack

| Component       | Technology        |
|----------------|-------------------|
| Backend API     | Laravel (PHP)     |
| Microservice    | Flask (Python)    |
| Database        | PostgreSQL        |
| Frontend (optional) | Next.js + Chart.js |
| Analytics       | Metabase          |
| Dataset         | Mock / Kaggle     |

---

## 📁 Project Structure

```
inventory-management/
├── flask-scanner/           # Flask microservice
├── laravel-backend/         # Laravel API for inventory
├── nextjs-dashboard/        # (Optional) Chart.js frontend
├── data/
│   ├── inventory_data.csv   # Mock inventory dataset
│   └── insert_csv.py        # Python script to insert data
```

---

## 🚀 Setup Instructions

### 1. 🐘 PostgreSQL Setup

Create the `inventory` table:

```sql
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(20),
  product_name TEXT,
  quantity INT,
  last_scanned TIMESTAMP,
  status VARCHAR(10)
);
```

### 2. 📥 Insert Inventory Data

From `data/insert_csv.py`:

```bash
pip install pandas psycopg2-binary
python insert_csv.py
```

Ensure your CSV has headers: `SKU, Product Name, Quantity, last_scanned, status`.

---

### 3. 🧠 Flask Microservice

Run the scanner service:

```bash
cd flask-scanner
python app.py
```

Runs on: `http://localhost:5001/rfid-scan`  
Handles incoming POST requests for barcode scans.

---

### 4. ⚙️ Laravel Backend API

Start Laravel server:

```bash
cd laravel-backend
php artisan serve
```

Make sure `routes/api.php` includes:

```php
Route::post('/send-to-scanner', [InventoryController::class, 'sendToScanner']);
Route::get('/inventory', [InventoryController::class, 'getInventory']);
```

**GET `/api/inventory`** returns JSON for dashboards.

---

### 5. 📊 Chart.js Dashboard (Optional)

Navigate to `nextjs-dashboard`:

```bash
npm install
npm run dev
```

Visit: `http://localhost:3000/dashboard`  
Displays quantity-over-time using Chart.js.

---

### 6. 📈 Metabase Setup

Run Metabase via Docker:

```bash
docker run -d -p 3002:3000 --name metabase metabase/metabase
```

Go to: `http://localhost:3002`

- Connect to PostgreSQL
- Explore `inventory` table
- Create dashboards:
  - Quantity over time
  - IN vs OUT pie chart
  - Top SKUs bar chart

---

## ✅ API Summary

### POST `/api/send-to-scanner` (Laravel → Flask)
Used to record scanned inventory data.

```json
{
  "sku": "SKU001",
  "product_name": "Widget A",
  "quantity": 10,
  "status": "IN"
}
```

### GET `/api/inventory`
Returns all inventory records for visualization or analytics.

---

## 📷 Screenshots

_Add screenshots of:_
- Flask endpoint response
- Laravel API in Postman
- Chart.js dashboard
- Metabase charts

---

## 📌 Deliverables

- ✅ Flask microservice (`/rfid-scan`)
- ✅ PostgreSQL schema + data
- ✅ Laravel backend
- ✅ Metabase dashboards
- ✅ (Optional) Chart.js dashboard
- ✅ Project `README.md`

---

## 👤 Author

**Jimal [Your Full Name]**  
_Data Science Intern, 2025_

---

## 📜 License

MIT — Feel free to reuse and adapt for educational purposes.