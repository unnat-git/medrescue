# MedRescue Project Documentation

## 1. Project Overview
MedRescue is a comprehensive emergency medical response system designed to streamline SOS alerts, real-time ambulance tracking, and quick access to patient medical records via QR codes.

---

## 2. Technology Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (v16.1.6) with React (v19.2.3)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Key Libraries**:
  - **Maps**: `leaflet` & `react-leaflet` for real-time location visualization.
  - **Real-time**: `socket.io-client` for live emergency updates.
  - **Icons**: `lucide-react` for a modern UI.
  - **QR Code**: `qrcode` for generating patient medical IDs.
  - **Form Handling**: `react-phone-number-input` for standardized contact data.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via `pg` driver)
- **Real-time Engine**: [Socket.IO](https://socket.io/) for bidirectional communication.
- **Integrations**:
  - **Twilio**: SMS Gateway for OTP (One-Time Password) authentication.
  - **JWT**: `jsonwebtoken` for secure stateless authentication.
  - **Security**: `bcryptjs` for password/sensitive data hashing.

---

## 3. System Architecture & Logic

### A. Authentication Flow
1. **User Registration**: Users register using their phone number.
2. **OTP Verification**: The system sends a 6-digit code via Twilio.
3. **Session Management**: Upon successful verification, a JWT (JSON Web Token) is issued to the frontend, authorizing subsequent API calls.

### B. Emergency SOS System
1. **Trigger**: A user clicks the "SOS" button on the dashboard.
2. **Real-time Alert**: The request is sent to the backend via Socket.IO.
3. **Dispatch**: The backend identifies the nearest available ambulance/driver.
4. **Live Tracking**: 
   - Drivers emit their GPS coordinates.
   - The user's frontend listens for `ambulanceLocation_{id}` events.
   - The location is rendered on a Leaflet map in real-time.

### C. Medical Profile & Patient ID
1. **Unique Identity**: Every user is assigned a permanent, unique Patient ID.
2. **Medical Repository**: Users store critical info (blood group, allergies, emergency contacts).
3. **QR Code Access**: A QR code is generated for each profile. In an emergency, first responders can scan this code to view life-saving information immediately.

### D. Database Logic
- **Users Table**: Stores core account details and phone numbers.
- **Profiles Table**: Contains detailed medical history linked to the User.
- **Hospitals & Drivers**: Managed via seed scripts ([seed-hospitals.ts](file:///c:/Users/rajun/Desktop/medical_project/medrescue/backend/src/seed-hospitals.ts)) to maintain a registry of service providers.
- **Emergency Requests**: Tracks the lifecycle of an SOS event from initiation to resolution.

---

## 4. Deployment & Environment
- **Environment Management**: Utilizes `.env` files for sensitive credentials (DB URLs, Twilio SID/Tokens).
- **Production Readiness**: 
  - Backend uses a compiled TypeScript workflow (`dist/index.js`).
  ---

## 5. Directory Structure

### Frontend (`/frontend`)
- `src/app/`: Next.js App Router pages (Dashboard, Login, Signup, Emergency, Patient Profiles).
- `src/components/`: Reusable UI elements (Buttons, Inputs, Modals, Maps).
- `public/`: Static assets (Icons, Logos).

### Backend (`/backend`)
- [src/index.ts](file:///c:/Users/rajun/Desktop/medical_project/medrescue/backend/src/index.ts): Main entry point (Server & Socket.IO initialization).
- `src/routes/`: API endpoint definitions.
- `src/controllers/`: Business logic for each route.
- `src/services/`: External integrations (Twilio, Database helper).
- [src/db.ts](file:///c:/Users/rajun/Desktop/medical_project/medrescue/backend/src/db.ts): PostgreSQL connection pool.

---

## 6. How to Export to PDF
To obtain the final PDF version of this document:
1. **VS Code**: Open this file, install the **Markdown PDF** extension, and run "Markdown PDF: Export (pdf)".
2. **Browser**: Open a Markdown editor (like [StackEdit](https://stackedit.io/)), paste this content, and use the "Export to PDF" feature.
3. **Command Line**: Use `pandoc PROJECT_DOCUMENTATION.md -o PROJECT_DOCUMENTATION.pdf`.
