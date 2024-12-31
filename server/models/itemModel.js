import db from '../config/db.js';
import axios from 'axios';

const excludedTags = ['text', 'indoor', 'person', 'outdoor', 'clothing', 'fashion', 'people', 'screenshot'];
const IMAGE_DESCRIPTION_API = 'http://localhost:8080/imageDesc/describe';

export const addItem = async (itemData) => {
    const { category, subCategory, title, description, condition, delivery, price, location, photos, customDetails, userID } = itemData;

    const listingResult = await db.query(
        `INSERT INTO listings (category, sub_category, title, description, condition, delivery, price, location, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [category, subCategory, title, description, condition, delivery, price, location, userID]
    );

    const listingId = listingResult.rows[0].id;

    for (const photoUrl of photos) {
        const response = await axios.post(IMAGE_DESCRIPTION_API, { image: photoUrl });
        let tags = response.data.data?.tags.slice(0, 10).map(tag => tag.name) || [];
        tags = tags.filter(tag => !excludedTags.includes(tag));

        await db.query(
            `INSERT INTO listing_photos (listing_id, photo_url, tags) VALUES ($1, $2, $3)`,
            [listingId, photoUrl, JSON.stringify(tags)]
        );
    }

    const detailPromises = Object.entries(customDetails).map(([key, value]) =>
        db.query(`INSERT INTO listing_details (listing_id, detail_key, detail_value) VALUES ($1, $2, $3)`, [listingId, key, value])
    );
    await Promise.all(detailPromises);

    return listingId;
};

export const fetchAllItems = async () => {
    const itemResult = await db.query(`SELECT * FROM listings`);
    return itemResult.rows;
};

export const fetchItemById = async (id) => {
    const itemResult = await db.query(`SELECT * FROM listings WHERE id = $1`, [id]);
    if (itemResult.rows.length === 0) {
        throw new Error('Item not found');
    }

    const item = itemResult.rows[0];

    const photosResult = await db.query(`SELECT photo_url FROM listing_photos WHERE listing_id = $1`, [id]);
    item.photos = photosResult.rows.map(row => row.photo_url);

    const detailsResult = await db.query(`SELECT detail_key, detail_value FROM listing_details WHERE listing_id = $1`, [id]);
    item.customDetails = detailsResult.rows.reduce((acc, detail) => {
        acc[detail.detail_key] = detail.detail_value;
        return acc;
    }, {});

    item.customDetails = Object.entries(item.customDetails).map(([key, value]) => ({
        title: key,
        description: value,
    }));

    const userInfo = await db.query('SELECT user_name, phone_number, email, photo FROM users WHERE id = $1', [item.user_id]);
    const user = userInfo.rows[0] || {};

    if (user.user_name) item.username = user.user_name;
    if (user.phone_number) item.phone_number = user.phone_number;
    if (user.email) item.email = user.email;
    if (user.photo) item.userPhoto = user.photo;

    return item;
};

export const deleteItemById = async (id) => {
    const listingResult = await db.query('DELETE FROM listings WHERE id = $1', [id]);
    if (listingResult.rowCount === 0) {
        throw new Error('Listing not found');
    }

    await db.query('DELETE FROM listing_photos WHERE listing_id = $1', [id]);
    await db.query('DELETE FROM listing_details WHERE listing_id = $1', [id]);
};

export const updateItem = async (listingId, itemData) => {
    const { category, sub_category, title, description, condition, delivery, price, location, photos, customDetails } = itemData;

    const updateListingResult = await db.query(
        `UPDATE listings
         SET category = $1, sub_category = $2, title = $3, description = $4, condition = $5, 
             delivery = $6, price = $7, location = $8
         WHERE id = $9`,
        [category, sub_category, title, description, condition, delivery, price, location, listingId]
    );

    if (updateListingResult.rowCount === 0) {
        throw new Error('Listing not found');
    }

    const photoPlaceholders = photos.map((_, index) => `$${index + 2}`).join(',');
    await db.query(
        `DELETE FROM listing_photos WHERE listing_id = $1 AND photo_url NOT IN (${photoPlaceholders})`,
        [listingId, ...photos]
    );

    for (const photoUrl of photos) {
        const existingPhoto = await db.query('SELECT 1 FROM listing_photos WHERE listing_id = $1 AND photo_url = $2', [listingId, photoUrl]);
        if (existingPhoto.rows.length > 0) {
            continue;
        }

        const response = await axios.post(IMAGE_DESCRIPTION_API, { image: photoUrl });
        let tags = response.data.data?.tags.slice(0, 10).map(tag => tag.name) || [];
        tags = tags.filter(tag => !excludedTags.includes(tag));

        await db.query(
            `INSERT INTO listing_photos (listing_id, photo_url, tags) VALUES ($1, $2, $3)`,
            [listingId, photoUrl, JSON.stringify(tags)]
        );
    }

    await db.query(`DELETE FROM listing_details WHERE listing_id = $1`, [listingId]);

    const detailPromises = Object.entries(customDetails).map(([key, value]) =>
        db.query(`INSERT INTO listing_details (listing_id, detail_key, detail_value) VALUES ($1, $2, $3)`, [listingId, key, value])
    );
    await Promise.all(detailPromises);
};

export const fetchItemsByUserId = async (userId) => {
    const listingsResult = await db.query(`SELECT * FROM listings WHERE user_id = $1`, [userId]);
    const listings = listingsResult.rows;

    const listingsWithPhotos = await Promise.all(listings.map(async (listing) => {
        const photosResult = await db.query(`SELECT photo_url FROM listing_photos WHERE listing_id = $1 LIMIT 1`, [listing.id]);
        listing.image = photosResult.rows[0]?.photo_url || null;
        return listing;
    }));

    return listingsWithPhotos;
};