import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';

import passport from 'passport';
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js"
import env from 'dotenv';
import verifyToken from './middleware/middleware.js';

env.config();

const app = express();

const corsOption = {
    origin: 'http://localhost:3000', // front
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());

// Session setup
// app.use(session({
//     secret: process.env.SECRETKEY,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 1000 * 60 * 30 // 30 minutes
//     }
// }));

// // // Initialize Passport and session handling
// app.use(passport.initialize());
// app.use(passport.session());

// Routes



app.use('/auth', authRoutes);
app.use('/data', verifyToken, dataRoutes);
app.use('/', (req, res) => {
    res.send(
        "<h1>This is the backend server</h1>"
    )
});


app.listen(8080, () => {
    console.log("Server started on port 8080");
});

