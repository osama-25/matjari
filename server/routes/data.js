import express from 'express';
import verifyToken from '../middleware/middleware.js';
import db from '../config/db.js';
const router = express.Router();

router.get("/get", verifyToken, async (req, res) => {

    const id = parseInt(req.user.id, 10); // Ensure id is an integer
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const dbRes = await db.query("select * from users where id = $1", [id]);
        const data = dbRes.rows[0];
        res.status(201).json({ user: data });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put("/modify", verifyToken, async (req, res) => {
    const id = req.user.id;
    const { email, user_name, fname, lname, phone_number, photo } = req.body;

    console.log("HIHIHIHIHIHIHIHI");

    console.log(req.body);

    // Optional: Validate the incoming data here
    if (!email || !user_name || !fname || !lname) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const dbRes = await db.query(
            "UPDATE users SET email = $1, user_name = $2, fname = $3, lname = $4, phone_number = $5, photo = $6 WHERE id = $7 RETURNING *",
            [email, user_name, fname, lname, phone_number, photo, id]
        );

        if (dbRes.rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const updatedUser = dbRes.rows[0];
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating user data:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;