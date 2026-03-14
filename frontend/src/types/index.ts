export interface User {
  id: number;
  phone_number: string;
  full_name: string;
  email?: string;
}

export interface SignupData {
  full_name: string;
  email?: string;
  phone_number: string;
  password?: string;
}

export interface MedicalProfile {
  id: number;
  user_id: number;
  full_name: string;
  blood_group: string;
  allergies?: string;
  chronic_diseases?: string;
  medications?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
}

export interface Ambulance {
  id: number;
  driver_name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'busy' | 'offline';
}
