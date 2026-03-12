# MedRescue Frontend Interface

## Overview
This is the Next.js 14 frontend application for the **MedRescue - Medical Quick Response System**. This directory houses the user-facing web interfaces, dynamic dashboards, and real-time mapping components essential for the platform's operation.

## What It Does
The MedRescue frontend provides tailored, responsive interfaces for various stakeholders involved in the emergency response lifecycle:
- **Public Users:** An accessible interface allowing individuals to trigger SOS emergency requests with precise geolocation data and manage their health profiles/QR codes.
- **Ambulance Drivers:** A dedicated, real-time tracking dashboard that alerts drivers to nearby emergencies, calculates optimal routes using the Google Maps API, and provides seamless navigation to the patient's location.
- **Hospitals & Dispatchers:** A command center view to monitor incoming emergencies, track active ambulance fleets on a live map, and prepare medical teams for incoming arrivals based on patient profiles.

## Technologies Used
- **Next.js 14:** For optimized, server-side rendered, and highly responsive web pages.
- **React & Tailwind CSS:** Ensuring a modern, accessible, and mobile-first user interface design.
- **Socket.IO-Client:** Enabling live, bi-directional communication for real-time location updates.
- **Google Maps API:** Supplying interactive map components and crucial routing interfaces for driver navigation.

By combining these technologies into a single, cohesive frontend system, this project bridges the communication gap between individuals in distress and rapid medical responders.
