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
