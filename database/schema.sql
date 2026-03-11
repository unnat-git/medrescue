CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(50),
  blood_group VARCHAR(10),
  allergies TEXT,
  chronic_conditions TEXT,
  current_medications TEXT,
  past_surgeries TEXT,
  emergency_contact VARCHAR(255),
  doctor_name VARCHAR(255)
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
  patient_id INTEGER REFERENCES patients(id),
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

INSERT INTO hospitals (name, latitude, longitude, contact_number)
SELECT 'City General Hospital', 37.7649, -122.4294, '1-800-HOSPITAL'
WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE name = 'City General Hospital');


