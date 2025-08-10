-- Hotel Management System Database Schema

-- Users table (staff and admin accounts)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hotel settings
CREATE TABLE IF NOT EXISTS hotel_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Room types
CREATE TABLE IF NOT EXISTS room_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    max_occupancy INTEGER NOT NULL,
    amenities TEXT, -- JSON array of amenities
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type_id INTEGER NOT NULL,
    floor INTEGER,
    status VARCHAR(50) DEFAULT 'available', -- available, occupied, maintenance, cleaning
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Guests
CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    id_number VARCHAR(100),
    loyalty_tier VARCHAR(50) DEFAULT 'Bronze',
    loyalty_points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reservations
CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- pending, confirmed, checked_in, checked_out, cancelled
    confirmation_code VARCHAR(50),
    special_requests TEXT,
    created_by INTEGER, -- user who created the reservation
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Inventory items
CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    category VARCHAR(100),
    current_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 100,
    unit_cost DECIMAL(10,2),
    supplier VARCHAR(255),
    last_restocked DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    room_id INTEGER,
    category VARCHAR(100),
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    assigned_to INTEGER,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    due_date DATE,
    completed_at DATETIME,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Channel manager connections
CREATE TABLE IF NOT EXISTS channel_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_name VARCHAR(255) NOT NULL,
    api_key VARCHAR(500),
    is_active BOOLEAN DEFAULT false,
    last_sync DATETIME,
    sync_status VARCHAR(50) DEFAULT 'disconnected', -- connected, disconnected, error
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT OR IGNORE INTO hotel_settings (name, address, phone, email) 
VALUES ('Armaflex Hotel', '123 Luxury Avenue, City, State 12345', '+1-555-HOTEL', 'info@armaflex.com');

-- Insert default room types
INSERT OR IGNORE INTO room_types (name, description, base_price, max_occupancy, amenities) VALUES
('Standard Room', 'Comfortable room with essential amenities', 150.00, 2, '["Free WiFi", "Air Conditioning", "TV", "Mini Fridge"]'),
('Deluxe Suite', 'Spacious suite with premium amenities', 250.00, 4, '["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Balcony", "Living Area"]'),
('Presidential Suite', 'Ultimate luxury accommodation', 800.00, 6, '["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Balcony", "Living Area", "Jacuzzi", "Butler Service"]');

-- Insert sample rooms
INSERT OR IGNORE INTO rooms (room_number, room_type_id, floor) VALUES
('101', 1, 1), ('102', 1, 1), ('103', 1, 1),
('201', 2, 2), ('202', 2, 2),
('301', 3, 3);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, succeeded, failed, cancelled, refunded
    payment_method VARCHAR(50), -- card, bank_transfer, cash, etc.
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),
    description TEXT,
    metadata TEXT, -- JSON for additional data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

-- Payment refunds table
CREATE TABLE IF NOT EXISTS payment_refunds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id INTEGER NOT NULL,
    stripe_refund_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, cancelled
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    guest_id INTEGER,
    email_address VARCHAR(255),
    phone_number VARCHAR(50),
    enable_email BOOLEAN DEFAULT true,
    enable_sms BOOLEAN DEFAULT false,
    email_preferences TEXT, -- JSON of email notification types
    sms_preferences TEXT, -- JSON of SMS notification types
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '08:00',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (guest_id) REFERENCES guests(id)
);

-- Notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    guest_id INTEGER,
    type VARCHAR(50) NOT NULL, -- email, sms
    template_name VARCHAR(100) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed, delivered
    error_message TEXT,
    sent_at DATETIME,
    delivered_at DATETIME,
    metadata TEXT, -- JSON for additional data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (guest_id) REFERENCES guests(id)
);

-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (email, password_hash, name, role, department) VALUES
('admin@armaflex.com', '$2b$10$example_hash_for_admin123', 'System Administrator', 'admin', 'Management');
