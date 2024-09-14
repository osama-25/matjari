import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from 'express-session';
import passport from 'passport';
import authRoutes from "./routes/auth.js";
import pg from 'pg';
import env from 'dotenv';

// import User from "./routes/userModel.js";
const app = express();
const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}; // Added credentials
env.config();

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session and Passport setup
// app.use(session({
//     secret: process.env.SECRETKEY,
//     resave: false,
//     saveUninitialized: true ,
//     cookie: {
//         maxAge: 1000 * 60 * 30 // Session expires after 30 minutes (in milliseconds)
//     }

// }));

// app.use(passport.initialize());
// app.use(passport.session());

app.use('/auth', authRoutes);


app.listen(8080, () => {
    console.log("Server started on port 8080");
});
