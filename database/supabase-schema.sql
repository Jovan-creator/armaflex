-- Armaflex Hotel Comprehensive Database Schema for Supabase
-- This schema supports rooms, dining, events, facilities, and all services

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (staff and admin accounts)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'receptionist', 'housekeeping', 'maintenance', 'accountant', 'restaurant', 'events', 'spa', 'support')),
    department VARCHAR(100),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel settings
CREATE TABLE IF NOT EXISTS hotel_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    currency VARCHAR(10) DEFAULT 'UGX',
    timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
    mtn_api_key VARCHAR(255),
    airtel_api_key VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service categories
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room types
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    max_occupancy INTEGER NOT NULL,
    amenities JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type_id UUID NOT NULL REFERENCES room_types(id),
    floor INTEGER,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'out_of_order')),
    view_type VARCHAR(100),
    balcony BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dining venues
CREATE TABLE IF NOT EXISTS dining_venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN ('fine_dining', 'casual_dining', 'bar_lounge', 'pool_bar', 'coffee_shop', 'room_service', 'private_dining')),
    description TEXT,
    capacity INTEGER,
    opening_hours JSONB,
    menu_items JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    price_range VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event spaces
CREATE TABLE IF NOT EXISTS event_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL CHECK (type IN ('meeting_room', 'conference_hall', 'banquet_hall', 'outdoor_space', 'boardroom', 'wedding_venue')),
    capacity INTEGER NOT NULL,
    area_sqm DECIMAL(8,2),
    equipment JSONB DEFAULT '[]',
    catering_available BOOLEAN DEFAULT true,
    av_equipment BOOLEAN DEFAULT true,
    wifi BOOLEAN DEFAULT true,
    natural_light BOOLEAN DEFAULT false,
    price_per_hour DECIMAL(10,2),
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facility services
CREATE TABLE IF NOT EXISTS facility_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('spa', 'fitness', 'pool', 'wellness', 'recreation', 'business', 'transport', 'laundry')),
    description TEXT,
    duration_minutes INTEGER,
    price DECIMAL(10,2),
    capacity INTEGER DEFAULT 1,
    equipment_needed TEXT[],
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guests
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    id_number VARCHAR(100),
    nationality VARCHAR(100),
    date_of_birth DATE,
    loyalty_tier VARCHAR(50) DEFAULT 'Bronze',
    loyalty_points INTEGER DEFAULT 0,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings (unified for all services)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    guest_id UUID NOT NULL REFERENCES guests(id),
    booking_type VARCHAR(50) NOT NULL CHECK (booking_type IN ('room', 'dining', 'event', 'facility', 'package')),
    
    -- Room booking specific
    room_id UUID REFERENCES rooms(id),
    check_in_date DATE,
    check_out_date DATE,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    
    -- Dining booking specific
    dining_venue_id UUID REFERENCES dining_venues(id),
    dining_date DATE,
    dining_time TIME,
    party_size INTEGER,
    
    -- Event booking specific
    event_space_id UUID REFERENCES event_spaces(id),
    event_date DATE,
    event_start_time TIME,
    event_end_time TIME,
    event_type VARCHAR(100),
    attendees INTEGER,
    
    -- Facility booking specific
    facility_service_id UUID REFERENCES facility_services(id),
    service_date DATE,
    service_time TIME,
    
    -- Common fields
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'UGX',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    special_requests TEXT,
    internal_notes TEXT,
    
    -- Contact and confirmation
    confirmation_code VARCHAR(50),
    email_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments (enhanced for mobile money)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'mobile_money', 'bank_transfer', 'cash', 'paypal')),
    provider VARCHAR(50), -- MTN, Airtel, Stripe, PayPal, etc.
    transaction_id VARCHAR(255),
    reference_number VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'UGX',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    phone_number VARCHAR(50), -- for mobile money
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Package deals (combinations of services)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    services JSONB NOT NULL, -- Array of service combinations
    original_price DECIMAL(10,2) NOT NULL,
    package_price DECIMAL(10,2) NOT NULL,
    savings DECIMAL(10,2) GENERATED ALWAYS AS (original_price - package_price) STORED,
    validity_days INTEGER DEFAULT 30,
    max_guests INTEGER DEFAULT 2,
    images JSONB DEFAULT '[]',
    terms_conditions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    guest_id UUID NOT NULL REFERENCES guests(id),
    service_type VARCHAR(50) NOT NULL,
    service_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    response TEXT, -- Management response
    response_by UUID REFERENCES users(id),
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability calendar
CREATE TABLE IF NOT EXISTS availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('room', 'dining', 'event_space', 'facility')),
    resource_id UUID NOT NULL,
    date DATE NOT NULL,
    time_slot TIME,
    is_available BOOLEAN DEFAULT true,
    reason VARCHAR(255), -- maintenance, private event, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(resource_type, resource_id, date, time_slot)
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    guest_id UUID REFERENCES guests(id),
    email_address VARCHAR(255),
    phone_number VARCHAR(50),
    enable_email BOOLEAN DEFAULT true,
    enable_sms BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Africa/Kampala',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification logs
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    recipient VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'sms')),
    template_name VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data
INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES
('Accommodation', 'rooms', 'Hotel rooms and suites for overnight stays', 'bed', 1),
('Dining', 'dining', 'Restaurant reservations and dining experiences', 'utensils', 2),
('Events', 'events', 'Meeting rooms, conferences, and event spaces', 'calendar', 3),
('Spa & Wellness', 'spa', 'Spa treatments, wellness services, and fitness', 'leaf', 4),
('Facilities', 'facilities', 'Pool, recreation, and other hotel amenities', 'swimming-pool', 5);

INSERT INTO hotel_settings (name, address, phone, email, website) VALUES
('Armaflex Hotel', 'Jinja Camp, Juba Road, Lira City West Division, Uganda', '+256 392004134', 'info@armaflexhotel.com', 'https://armaflexhotel.com');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_type ON bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_availability_resource ON availability(resource_type, resource_id, date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
