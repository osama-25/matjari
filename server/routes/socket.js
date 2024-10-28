import express from 'express';
import { Server } from 'socket.io';

const router = express.Router();

// Placeholder route for Socket.IO
router.get('/', (req, res) => {
    res.send("Socket.IO server is running.");
});

// Function to initialize Socket.IO
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // frontend origin
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
    
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        })
        socket.on('sent_message', (data) => {
            socket.to(data.room).emit("receive_message", data);
        })
    });
};

export default router;
