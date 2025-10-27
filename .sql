-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  address TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'shipper',
  vehicle_info TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create loads table
CREATE TABLE loads (
  id SERIAL PRIMARY KEY,
  ref VARCHAR(50) UNIQUE NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  cargo_type VARCHAR(255) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  shipper_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id),
  recipient_id INTEGER REFERENCES users(id),
  sender_email VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create access_control table
CREATE TABLE access_control (
  id SERIAL PRIMARY KEY,
  post_loads_enabled BOOLEAN DEFAULT true,
  banners JSONB DEFAULT '{}',
  pages JSONB DEFAULT '{}',
  user_access JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: Muchandida@1)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'cyprianmak@gmail.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin');

-- Insert default access control settings
INSERT INTO access_control (post_loads_enabled, banners, pages, user_access) 
VALUES (true, '{}', '{}', '{}');

-- Create indexes for better performance
CREATE INDEX idx_loads_shipper_id ON loads(shipper_id);
CREATE INDEX idx_loads_origin ON loads(origin);
CREATE INDEX idx_loads_destination ON loads(destination);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
