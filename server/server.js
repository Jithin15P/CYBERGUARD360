 // server/server.js (updated with log routes)
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const attackRoutes = require('./routes/attackRoutes');
const logRoutes = require('./routes/logRoutes'); // Import log routes

const app = express();
connectDB();

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

module.exports.io = io; // Expose io object for use in other modules


// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: "http://localhost:3000"
}));

// --- Socket.IO Connection ---
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    socket.on('disconnect', () => {
        console.log('A user disconnected via WebSocket:', socket.id);
    });
});

// --- Routes ---
app.get('/api/status', (req, res) => {
    res.json({ message: 'CyberGuard Backend is running!', status: 'OK' });
});

app.use('/api/attack', attackRoutes); // Attack simulation routes
app.use('/api/logs', logRoutes);     // Log retrieval routes

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));