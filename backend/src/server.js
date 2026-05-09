const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Allow frontend domain here in production
        methods: ['GET', 'POST', 'PATCH']
    }
});

app.use(cors());
app.use(express.json());

// Pass IO to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Import Routes
const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Use Routes
app.use('/api', expertRoutes);
app.use('/api', bookingRoutes);

// Socket Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
