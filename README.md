# MedRescue - Medical Quick Response System

A full-stack medical emergency response application built with Next.js 14, Node.js/Express, PostgreSQL, Socket.IO, and Google Maps API placeholders.

## Project Structure

- `frontend/`: Next.js 14 application serving user, driver, and hospital interfaces derived from Stitch designs.
- `backend/`: Node.js/Express API with Socket.IO logic for real-time tracking, Haversine matching, and routing endpoints.
- `database/`: `schema.sql` containing the PostgreSQL structure and startup data.

## Features Delivered
- **Landing Page, Medical Profile, QR View, Dashboards (Driver/Hospital)**: Fully mapped in Next.js structure inside `frontend/src/app`.
- **Geolocation API Integration**: Written in the `emergency` request interface.
- **REST APIs & Database**: Request logic matching nearest ambulance via Haversine distance algorithm in `backend`.
- **Socket.io Integration**: Configured in backend and frontend `services/socket.ts` template to broadcast location.

## Setup Instructions

### Prerequisites
1. Node.js 18+ and npm
2. PostgreSQL server running locally or remotely.

### 1. Database Setup
1. Create a local PostgreSQL database named `medrescue`.
2. Execute the commands in `medrescue/database/schema.sql` to build tables and seed temporary driver logic.

### 2. Backend Environment
1. Navigate to `medrescue/backend`.
2. (Optional) Provide `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medrescue` in a `.env` file.
3. Run `npm install` and then `npm run dev` to start up the API on Port 8000.

### 3. Frontend Setup
1. Navigate to `medrescue/frontend`.
2. Be sure `lucide-react` and `socket.io-client` dependencies are added.
3. Run `npm run dev` to serve the UI on Port 3000.

---
**Quick Start Script**: Use the included `run_local.ps1` from the project root to spawn both instances instantly in new terminal windows.
