/**
 * Central API Configuration
 * 
 * Default: Production Render URL
 * Local Development: Set NEXT_PUBLIC_API_URL in .env.local to 'http://localhost:8000'
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://medrescue.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  },
  PROFILE: {
    BASE: `${API_BASE_URL}/api/profiles`,
    PUBLIC: (id: string) => `${API_BASE_URL}/api/profiles/${id}`,
  },
  EMERGENCY: {
    BASE: `${API_BASE_URL}/api/emergency`,
  }
};
