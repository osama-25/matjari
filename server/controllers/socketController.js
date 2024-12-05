
import { Server } from 'socket.io';

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

