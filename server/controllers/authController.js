import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import passport from '../config/passport.js';
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
export const verifyToken = (req, res, next) => {
    // const token = req.header('Authorization');


    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from 'Bearer <token>'
    // console.log(token);


    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

// Register a new user
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, userName } = req.body.info;

        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (checkResult.rowCount > 0) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords don't match!" });
        }

        const user = new User(firstName, lastName, email, password, userName);
        const userId = await user.save();

        const registeredUser = (await db.query('SELECT * FROM users WHERE id = $1', [userId])).rows[0];
        const token = generateToken(registeredUser);

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

        const token = generateToken(user);
        res.status(200).json({ success: true, token, message: "Login successful!" });
    })(req, res, next);
};


