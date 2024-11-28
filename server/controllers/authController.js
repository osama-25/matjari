import User from '../models/userModel.js';
import db from '../config/db.js';
import passport from '../config/passport.js';
import { generateToken } from '../middleware/middleware.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendResetEmail } from './emailService.js';
// import nodemailer from 'nodemailer';

// Password Reset Request Handler
export const requestPasswordReset = async (req, res) => {

    console.log("got here");

    const { email } = req.body;

    try {
        // Check if user exists
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        const user = result.rows[0];

        // Generate a password reset token
        const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' }); // Expires in 15 minutes

        // Send the reset token via email

        await sendResetEmail(email, resetToken);


        res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (error) {
        console.error("Error in password reset request:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Password Reset Confirmation Handler
export const resetPassword = async (req, res) => {

    console.log("????");

    const { token, newPassword } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        // Hash the new password
        // console.log(typeof (process.parseInt(env.SALTROUNDS)));
        // console.log(typeof (process.env.SALTROUNDS));

        const saltRounds = parseInt(process.env.SALTROUNDS);

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, decoded.id]);

        res.status(200).json({ success: true, message: "Password has been reset successfully" });
        console.log("fine");

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
};


export const register = async (req, res) => {
    try {


        console.log("1");

        const { firstName, lastName, email, password, confirmPassword, userName } = req.body.info;

        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (checkResult.rowCount > 0) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords don't match!" });
        }

        console.log("2");
        const user = new User(firstName, lastName, email, password, userName);
        const userId = await user.save();

        const registeredUser = (await db.query('SELECT * FROM users WHERE id = $1', [userId])).rows[0];
        const token = generateToken({
            id: registeredUser.id,
            email: registeredUser.email
        });

        res.status(201).json({ success: true, token, message: "User registered successfully" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
};


// Login an existing user
export const login = (req, res, next) => {


    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ success: false, message: "Authentication error" });

        if (!user) return res.status(401).json({ success: false, message: info.message });
        req.user = user;
        console.log("authController");

        console.log(req.user);


        const token = generateToken({
            id: req.user.id,
            email: req.user.email
        });


        res.status(200).json({ success: true, token, message: "Login successful!", user: user });
    })(req, res, next);
};



