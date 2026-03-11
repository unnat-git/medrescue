import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import db from './db';
import emergencyRoutes from './routes/emergencyRoutes';
import patientRoutes from './routes/patientRoutes';
import initDB from './init-db';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/emergency', emergencyRoutes);
app.use('/api/patients', patientRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Driver sending live location update
  socket.on('driverLocationUpdate', (data) => {
    // data should have { ambulanceId, latitude, longitude }
    // Broadcast to the respective patient or global room
    // Here we can use rooms based on request_id or global tracking events
    io.emit(`ambulanceLocation_${data.ambulanceId}`, data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;

// Initialize Database then start server
initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
