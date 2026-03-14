# MedRescue - Medical Quick Response System

## What is MedRescue?
MedRescue is a full-stack medical emergency response application built with Next.js 14, Node.js/Express, PostgreSQL, Socket.IO, and Google Maps API. It serves as a rapid-response platform designed to streamline and accelerate the process of dispatching medical assistance to those in need.

## The Problem It Solves
During critical medical emergencies, every passing second significantly impacts patient outcomes. Traditional emergency dispatch systems often suffer from manual delays, inaccurate location sharing, and a lack of real-time visibility for both the distressed individual and the responding units. Furthermore, first responders often arrive at the scene without crucial prior knowledge of a patient's medical history (such as allergies, chronic conditions, or blood type), which can delay life-saving treatments.

## How MedRescue Addresses These Challenges
MedRescue modernizes emergency medical services by offering:
- **Instant Geolocation:** Automatically pinpoints the exact location of the emergency request, eliminating the ambiguity of phone-based address descriptions.
- **Smart Ambulance Dispatch:** Utilizes the Haversine formula to instantly identify and dispatch the nearest available ambulance, drastically reducing response times.
- **Live Real-time Tracking:** Provides live Socket.IO-powered tracking so users, hospitals, and dispatchers can monitor the ambulance's route in real-time, providing peace of mind and better preparedness.
- **Instant Access to Medical Profiles:** Users can generate secure MedRescue QR codes linking to their vital medical IDs. In an emergency, first responders can scan the QR code to instantly access critical health data before administering treatment.
- **Comprehensive Dashboards:** Tailored interfaces for Ambulance Drivers to manage ride requests and for Hospitals to prepare for incoming patients, ensuring a synchronized and efficient operational flow.
- **OTP-Verified Authentication:** Secure user signup and login using Twilio Verify API for phone number verification.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Twilio Account

### Environment Variables

#### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://medrescue:MedRescueSecure@dpg-d6oulihaae7s73bk8jk0-a.singapore-postgres.render.com/medrescue

PORT=8000
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database Setup
Run the `database/schema.sql` on your PostgreSQL instance to set up the necessary tables:
- `users`: User authentication data.
- `medical_profiles`: Health records per user.
- `emergency_requests`: Active SOS tracking.

## Production Deployment (Render & Vercel)

### Backend (Render)
When deploying to Render, you **MUST** go to the "Environment" tab in your Render dashboard and manually add the following variables:
- `DATABASE_URL`: Your Render PostgreSQL URL.
- `JWT_SECRET`: A long random string.
- `TWILIO_ACCOUNT_SID`: (From Twilio Dashboard)
- `TWILIO_AUTH_TOKEN`: (From Twilio Dashboard)
- `TWILIO_VERIFY_SERVICE_SID`: (From Twilio Verify Service)
- `FRONTEND_URL`: `https://your-app.vercel.app`

### Frontend (Vercel)
In the Vercel project settings, add:
- `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com`


