import jwt from 'jsonwebtoken';
import { verifyAdminPassword } from '../models/adminModel.js';

export default async function verifyToken(req, res, next) {

    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // becase the authHeader is 'Bearer token' so we cut the [0] index

    console.log("token: : " + token);

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const res = await jwt.verify(token, process.env.JWT_SECRET, {
            "algorithms": ["HS256"],
        })



        req.user = res.user;
        next();

    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};


export const generateToken = (user) => {
    return jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '24h' });
};


export const isAdmin = async (req, res, next) => {
    console.log("HIT");

    const { username, password } = req.body; 

    const secretKey = process.env.JWT_SECRET;

    console.log(username, password);

    try {
        const isAdmin = await verifyAdminPassword(username, password);
        if (isAdmin) {
            const token = jwt.sign({ isAdmin: true }, secretKey, { expiresIn: '2h' });
            
            console.log("ADMIN");

            res.status(200).json({ message: 'Access granted. Admins only.', success: true, token });
        } else {
            console.log("NOT ADMIN");

            res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
