import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import db from './config/db.js';
import passport from 'passport';
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js"
//import profileRoutes from "./routes/profile.js"
import itemRoutes from "./routes/item.js";
import env from 'dotenv';
import verifyToken from './middleware/middleware.js';

env.config();

const app = express();

const corsOption = {
    origin: 'http://localhost:3000', // front
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
//app.use('/profile', verifyToken, profileRoutes);
app.use('/api/listing',itemRoutes);


app.use('/', (req, res) => {
    res.send(
        "<h1>This is the backend server</h1>"
    )
});
app.listen(8080, () => {
    console.log("Server started on port 8080");
});

