-- Create the main database schema for the wedding invitation system

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    guest_type VARCHAR(20) DEFAULT 'individual' CHECK (guest_type IN ('individual', 'couple', 'family')),
    partner_name VARCHAR(255),
    number_of_guests INTEGER DEFAULT 1,
    dietary_restrictions TEXT,
    special_requests TEXT,
    password VARCHAR(255) NOT NULL,
    invitation_sent BOOLEAN DEFAULT FALSE,
    invitation_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ceremony responses table
CREATE TABLE IF NOT EXISTS ceremony_responses (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    ceremony_type VARCHAR(20) NOT NULL CHECK (ceremony_type IN ('dot', 'civil')),
    response VARCHAR(20) NOT NULL CHECK (response IN ('attending', 'not-attending', 'pending')),
    response_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(guest_id, ceremony_type)
);

-- Create invitations log table
CREATE TABLE IF NOT EXISTS invitations_log (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_status VARCHAR(20) DEFAULT 'sent' CHECK (email_status IN ('sent', 'delivered', 'failed', 'bounced')),
    email_provider_id VARCHAR(255),
    error_message TEXT
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_password ON guests(password);
CREATE INDEX IF NOT EXISTS idx_ceremony_responses_guest_id ON ceremony_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_ceremony_responses_ceremony_type ON ceremony_responses(ceremony_type);
CREATE INDEX IF NOT EXISTS idx_invitations_log_guest_id ON invitations_log(guest_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for guests table
CREATE TRIGGER update_guests_updated_at 
    BEFORE UPDATE ON guests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
