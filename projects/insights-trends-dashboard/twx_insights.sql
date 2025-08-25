CREATE DATABASE `twx-insights` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
USE twx_insights;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE driver_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    current_rating DECIMAL(3,2) DEFAULT 4.0,
    total_deliveries INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rating (current_rating)
);

CREATE TABLE client_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE deliveries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT UNSIGNED NOT NULL,
    client_id BIGINT UNSIGNED NOT NULL,
    delivery_location VARCHAR(255) NOT NULL,
    route_name VARCHAR(100) NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_time TIME NOT NULL,
    delivery_duration_minutes INT NOT NULL,
    delivery_status ENUM('pending', 'in_transit', 'delivered', 'failed', 'cancelled') DEFAULT 'pending',
    driver_rating DECIMAL(3,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES driver_profiles(id),
    FOREIGN KEY (client_id) REFERENCES client_profiles(id),
    INDEX idx_delivery_date (delivery_date),
    INDEX idx_hourly_analytics (delivery_date, delivery_time),
    INDEX idx_status (delivery_status)
);

CREATE TABLE support_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    category ENUM('delivery_issue', 'payment_problem', 'driver_complaint', 'app_bug', 'account_issue', 'general_inquiry') NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_category_analytics (category, created_at)
);

CREATE TABLE driver_performance_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    driver_id BIGINT UNSIGNED NOT NULL,
    performance_date DATE NOT NULL,
    daily_rating DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES driver_profiles(id),
    UNIQUE KEY unique_driver_date (driver_id, performance_date)
);

CREATE TABLE route_analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    avg_delivery_time_minutes DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_route (route_name)
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
('Juan Dela Cruz', 'juan@example.com'),
('Maria Santos', 'maria@example.com'),
('ABC Corporation', 'abc@client.com'),
('XYZ Enterprises', 'xyz@client.com');

INSERT INTO driver_profiles (user_id, full_name, current_rating, total_deliveries) VALUES
(1, 'Juan Dela Cruz', 4.5, 156),
(2, 'Maria Santos', 4.2, 142);

INSERT INTO client_profiles (user_id, company_name, city, region) VALUES
(3, 'ABC Corporation', 'Manila', 'NCR'),
(4, 'XYZ Enterprises', 'Makati', 'NCR');

INSERT INTO deliveries (driver_id, client_id, delivery_location, route_name, delivery_date, delivery_time, delivery_duration_minutes, delivery_status, driver_rating) VALUES
(1, 1, 'Makati CBD', 'Manila-Makati Route', CURDATE(), '14:30:00', 90, 'delivered', 4.5),
(2, 2, 'BGC, Taguig', 'Pasig-BGC Route', CURDATE(), '16:45:00', 90, 'delivered', 4.0),
(1, 1, 'Quezon City', 'Manila-QC Route', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '11:20:00', 110, 'delivered', 4.8);

INSERT INTO support_tickets (user_id, category, status) VALUES
(1, 'delivery_issue', 'resolved'),
(3, 'payment_problem', 'open'),
(2, 'app_bug', 'in_progress');

INSERT INTO driver_performance_history (driver_id, performance_date, daily_rating) VALUES
(1, CURDATE(), 4.5),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 4.8),
(2, CURDATE(), 4.0),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 4.2);

INSERT INTO route_analytics (route_name, avg_delivery_time_minutes) VALUES
('Manila-Makati Route', 85),
('Pasig-BGC Route', 90),
('Manila-QC Route', 95);CREATE DATABASE `twx-insights` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;