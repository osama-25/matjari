import express from 'express';
import db from '../config/db.js';
import axios from 'axios';
const router = express.Router();
const excludedTags = ['text', 'indoor', 'person', 'outdoor', 'clothing', 'fashion', 'people'];
const IMAGE_DESCRIPTION_API = 'http://localhost:8080/imageDesc/describe';
//add Items
router.post('/', async (req, res) => {
    const { category, subCategory, title, description, condition, delivery, price, location, photos, customDetails, userID } = req.body;
    
    
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


        res.status(201).json({ 
            message: 'Listing created successfully',
            itemId: listingId 
        });
    } catch (error) {
        console.error('Error saving listing:', error);
        res.status(500).json({ message: 'Error saving listing' });
    }
});

//fetch item


router.get('/fetch-all-items', async (req, res) => {
    const itemResult = await db.query(
        `SELECT * FROM listings`,
    );


    if (itemResult.rows.length === 0) {
        return res.status(404).json({ message: 'Error in the items fetching' });
    }

    return res.status(200).json(itemResult.rows);
});

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

        // Transform `customDetails` from object to array format
        item.customDetails = Object.entries(item.customDetails).map(([key, value]) => ({
            title: key,
            description: value,
        }));

        const userInfo = await db.query(
            'Select user_name, phone_number, email from users where id= $1',
            [item.user_id]
        );
        const user = userInfo.rows[0] || {};

        if (user.user_name) item.username = user.user_name;
        if (user.phone_number) item.phone_number = user.phone_number;
        if (user.email) item.email = user.email;

        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`Deleting listing with ID: ${id}`);

        // Delete listing record
        const listingResult = await db.query('DELETE FROM listings WHERE id = $1', [id]);
        if (listingResult.rowCount === 0) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Delete associated photos
        await db.query('DELETE FROM listing_photos WHERE listing_id = $1', [id]);

        // Delete associated custom details
        await db.query('DELETE FROM listing_details WHERE listing_id = $1', [id]);

        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/update/:listingId', async (req, res) => {
    const { listingId } = req.params;
    const { category, sub_category, title, description, condition, delivery, price, location, photos, customDetails } = req.body;
    //const excludedTags = ['text', 'indoor', 'person'];
    //const IMAGE_DESCRIPTION_API = 'http://localhost:8080/imageDesc/describe';
    
    try {
        console.log('listingId' + listingId);
        console.log(req.body);
        // Update the listing in the database
        const updateListingResult = await db.query(
            `UPDATE listings
             SET category = $1, sub_category = $2, title = $3, description = $4, condition = $5, 
                 delivery = $6, price = $7, location = $8
             WHERE id = $9`,
            [category, sub_category, title, description, condition, delivery, price, location, listingId]
        );

        if (updateListingResult.rowCount === 0) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Delete removed photos
        const photoPlaceholders = photos.map((_, index) => `$${index + 2}`).join(',');
        await db.query(
            `DELETE FROM listing_photos WHERE listing_id = $1 AND photo_url NOT IN (${photoPlaceholders})`,
            [listingId, ...photos]
        );

        const photoPromises = photos.map(async (photoUrl) => {
            // Check if photo already exists
            const existingPhoto = await db.query(
                'SELECT 1 FROM listing_photos WHERE listing_id = $1 AND photo_url = $2',
                [listingId, photoUrl]
            );
            if (existingPhoto.rows.length > 0) {
                return Promise.resolve(); // Skip if photo already exists
            }
            // Call the image description API
            const response = await axios.post(IMAGE_DESCRIPTION_API, { image: photoUrl });
            let tags = response.data.data?.tags.slice(0, 10).map(tag => tag.name) || [];

            // Filter out unwanted tags
            tags = tags.filter(tag => !excludedTags.includes(tag));

            // Save new photo URL and tags to the database
            return db.query(
                `INSERT INTO listing_photos (listing_id, photo_url, tags) VALUES ($1, $2, $3)`,
                [listingId, photoUrl, JSON.stringify(tags)]
            );
        });
        await Promise.all(photoPromises);

        // Delete existing custom details and add new ones
        await db.query(`DELETE FROM listing_details WHERE listing_id = $1`, [listingId]);

        const detailPromises = Object.entries(customDetails).map(([key, value]) =>
            db.query(`INSERT INTO listing_details (listing_id, detail_key, detail_value) VALUES ($1, $2, $3)`, [listingId, key, value])
        );
        await Promise.all(detailPromises);

        res.status(201).json({ message: 'Listing updated successfully' });
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ message: 'Error updating listing' });
    }
});

router.get('/store/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
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

        res.status(200).json({ listings: listingsWithPhotos });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: 'Error fetching listings' });
    }
});


export default router;