import { createUser, getUserByEmail, hashPassword } from '../models/userModel.js';
import db from '../config/db.js';
import passport from '../config/passport.js';
import { generateToken } from '../middleware/middleware.js';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from './emailService.js';

// Password Reset Request Handler
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        // Generate a password reset token
        const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

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
    const { token, newPassword } = req.body;

    try {
        // Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);

        // Update the user's password in the database
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, decoded.id]);

        res.status(200).json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
};

// Register a new user
export const register = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, userName } = req.body.info;

    console.log("hit register");

    try {
        // Check if email is already registered
        const existingUser = await getUserByEmail(email);
        console.log("hit register-1");

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Validate password and confirmPassword
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords don't match!" });
        }

        // Create the user
        const user = await createUser({ firstName, lastName, email, password, userName });
        const userId = user.id;
        console.log("hit register-2");
        // Generate a token for the registered user
        const token = generateToken({ id: userId, email });
        console.log("hit register-3");
        res.status(200).json({ success: true, token, message: "User registered successfully", user });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
};

// Login an existing user
export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Authentication error" });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: info.message || "email or password incorrect" });
        }

        // Generate a token for the logged-in user
        const token = generateToken({ id: user.id, email: user.email });

        res.status(200).json({ success: true, token, message: "Login successful!", user });
    })(req, res, next);
};

export const googleLogin = async (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Authentication error" });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: info?.message || "Google authentication failed" });
        }

        // Generate a token for the logged-in user
        const token = generateToken({ id: user.id, email: user.email });

        // Redirect to the frontend with the token in the query string
        const frontendRedirectUrl = `${process.env.FRONTEND_URL}/home?token=${token}`;
        return res.redirect(frontendRedirectUrl);
    })(req, res, next);
};

