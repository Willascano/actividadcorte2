const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('message', (message) => {
        console.log(`Received: ${message}`);
        io.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
