const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const bookingRoutes = require('./routes/bookings');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Serve static files from the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configure CORS with increased limits
app.use(cors({
    maxBodyLength: 50 * 1024 * 1024, // 50MB in bytes
}));

// Configure body parsers with increased limits
app.use(express.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            res.status(400).json({ message: 'Invalid JSON' });
            throw new Error('Invalid JSON');
        }
    }
}));

app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

// Server info endpoint
app.get('/api/server-info', (req, res) => {
    res.json({ port: server.address().port });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Function to find an available port
const findAvailablePort = async (startPort) => {
    const net = require('net');

    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });

        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
};

// Start server
let server;
const startServer = async () => {
    try {
        const port = await findAvailablePort(5000);
        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            // Store the port in a file for the frontend to read
            require('fs').writeFileSync('port.txt', port.toString());
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 