import { verifyAdminPassword } from '../models/adminModel.js';
import jwt from 'jsonwebtoken';


export const isAdmin = async (req, res, next) => {
    console.log("HIT");

    const { username, password } = req.body; // Assuming username and password are sent in the request body

    const secretKey = process.env.JWT_SECRET;
    // const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
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
