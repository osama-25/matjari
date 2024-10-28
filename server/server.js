import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";
import socketRoutes, { initializeSocket } from "./routes/socket.js";
import chatRoutes from './routes/chat.js'
import env from 'dotenv';
import verifyToken from './middleware/middleware.js';

env.config();

const app = express();

const corsOption = {
    origin: 'http://localhost:3000', // frontend origin
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/data', verifyToken, dataRoutes);
app.use('/socket', socketRoutes);
app.use('/chat' , chatRoutes);
app.use('/', (req, res) => {
    res.send("<h1>This is the backend server</h1>");
});

// Create the HTTP server and initialize Socket.IO
const server = http.createServer(app);
initializeSocket(server);

// Start the server
server.listen(8080, () => {
    console.log("Server started on port 8080");
});
