import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js"
import itemRoutes from "./routes/item.js";
import socketRoutes, { initializeSocket } from "./routes/socket.js";
import chatRoutes from './routes/chat.js'
import env from 'dotenv';
import verifyToken from './middleware/middleware.js';
import azure from './routes/azure.js';
import images from './routes/images.js';
import categoriesRoutes from './routes/categories.js';
env.config();

const app = express();

const corsOption = {
    origin: 'http://localhost:3000', // frontend origin
    credentials: true,
    optionsSuccessStatus: 200
};
// //database
// const pool = new Pool({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
// });

app.use(cors(corsOption));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/data', verifyToken, dataRoutes);
//app.use('/profile', verifyToken, profileRoutes);
app.use('/api/listing', itemRoutes);
app.use('/categories', categoriesRoutes);

app.use('/socket', socketRoutes);
app.use('/chat', chatRoutes);
app.use('/azure', azure);
app.use('/img', images)



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
