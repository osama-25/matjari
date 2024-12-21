import express from 'express';
import db from '../config/db.js';
import { console } from 'inspector';
const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, listingId } = req.body;

    try {
        // Check if the listing is already favorited
        const existingFavorite = await db.query(
            'SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2',
            [userId, listingId]
        );

        if (existingFavorite.rows.length > 0) {
            // If it exists, remove it (unfavorite)
            await db.query('DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2', [userId, listingId]);
            return res.status(200).json({ message: 'Listing unfavorited successfully' });
        }

        // Otherwise, add it as a favorite
        await db.query('INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2)', [userId, listingId]);
        res.status(200).json({ message: 'Listing favorited successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error handling favorite action' });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log("User id is: "+userId);
    try {
        const favorites = await db.query(
            `SELECT l.id, l.title, l.price, l.location, lp.photo_url
             FROM favorites f
             JOIN listings l ON f.listing_id = l.id
             LEFT JOIN listing_photos lp ON l.id = lp.listing_id
             WHERE f.user_id = $1`,
            [userId]
        );

        res.status(200).json({ favorites: favorites.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving favorites' });
    }
});


export default router;