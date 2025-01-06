import express from 'express';
import db from '../config/db.js';

export const router = express.Router();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userResult = await db.query(
            "SELECT user_name, photo FROM users WHERE id = $1",
            [userId]
        );

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const listingsResult = await db.query(
            `SELECT * FROM listings WHERE user_id = $1`,
            [userId]
        );

        const listings = listingsResult.rows;

        // Fetch one photo for each listing
        const listingsWithPhotos = await Promise.all(listings.map(async (listing) => {
            const photosResult = await db.query(
                `SELECT photo_url FROM listing_photos WHERE listing_id = $1 LIMIT 1`,
                [listing.id]
            );
            listing.image = photosResult.rows[0]?.photo_url || null;
            return listing;
        }));

        const user = userResult.rows[0];
        user.listings = listingsWithPhotos;
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

export default router;