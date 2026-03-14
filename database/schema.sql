CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  blood_group VARCHAR(10),
  allergies TEXT,
  chronic_diseases TEXT,
  medications TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ambulances (
  id SERIAL PRIMARY KEY,
  driver_name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status VARCHAR(50) DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  contact_number VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS emergency_requests (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES medical_profiles(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  ambulance_id INTEGER REFERENCES ambulances(id),
  status VARCHAR(50) DEFAULT 'pending',
  phone_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial data conditionally
INSERT INTO ambulances (driver_name, latitude, longitude, status)
SELECT 'John Driver', 37.7749, -122.4194, 'available'
WHERE NOT EXISTS (SELECT 1 FROM ambulances WHERE driver_name = 'John Driver');

INSERT INTO ambulances (driver_name, latitude, longitude, status)
SELECT 'Mike Swift', 37.7849, -122.4094, 'available'
WHERE NOT EXISTS (SELECT 1 FROM ambulances WHERE driver_name = 'Mike Swift');





