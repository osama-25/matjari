import express from 'express';
import db from '../config/db.js';
import axios from 'axios';
const router = express.Router();


//add Items
router.post('/', async (req, res) => {
    const { category, subCategory, title, description, condition, delivery, price, location, photos, customDetails, userID } = req.body;
    const excludedTags = ['text', 'indoor', 'person'];
    const IMAGE_DESCRIPTION_API = 'http://localhost:8080/imageDesc/describe';
    try {
        //const db = await pool.connect();

        // Save the listing to the database
        const listingResult = await db.query(
            `INSERT INTO listings (category, sub_category, title, description, condition, delivery, price, location, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [category, subCategory, title, description, condition, delivery, price, location, userID]
        );

        const listingId = listingResult.rows[0].id;

        // Save photos to the database
        const photoPromises = photos.map(async (photoUrl) => {
            // Call the image description API
            const response = await axios.post(IMAGE_DESCRIPTION_API, { image: photoUrl });
            let tags = response.data.data?.tags.slice(0, 10).map(tag => tag.name) || [];

            // Filter out unwanted tags
            tags = tags.filter(tag => !excludedTags.includes(tag));

            // Save photo URL and tags to the database
            return db.query(
                `INSERT INTO listing_photos (listing_id, photo_url, tags) VALUES ($1, $2, $3)`,
                [listingId, photoUrl, JSON.stringify(tags)]
            );
        });
        await Promise.all(photoPromises);

        // Save custom details as key-value pairs
        const detailPromises = Object.entries(customDetails).map(([key, value]) =>
            db.query(`INSERT INTO listing_details (listing_id, detail_key, detail_value) VALUES ($1, $2, $3)`, [listingId, key, value])
        );
        await Promise.all(detailPromises);


        res.status(201).json({ message: 'Listing created successfully' });
    } catch (error) {
        console.error('Error saving listing:', error);
        res.status(500).json({ message: 'Error saving listing' });
    }
});

//fetch item
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {

        const itemResult = await db.query(
            `SELECT * FROM listings WHERE id = $1`,
            [id]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const item = itemResult.rows[0];


        const photosResult = await db.query(
            `SELECT photo_url FROM listing_photos WHERE listing_id = $1`,
            [id]
        );
        item.photos = photosResult.rows.map(row => row.photo_url);


        const detailsResult = await db.query(
            `SELECT detail_key, detail_value FROM listing_details WHERE listing_id = $1`,
            [id]
        );

        item.customDetails = detailsResult.rows.reduce((acc, detail) => {
            acc[detail.detail_key] = detail.detail_value;
            return acc;
        }, {});

        const userInfo = await db.query(
            'Select user_name, phone_number, email from users where id= $1',
            [item.user_id]
        );
        item.username = userInfo.rows[0]?.user_name || null;
        item.phone_number = userInfo.rows[0]?.phone_number || null;
        item.email = userInfo.rows[0]?.email || null;

        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const result = await db.query('DELETE FROM listings WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch(error){
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export default router;