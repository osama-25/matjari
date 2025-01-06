import db from '../config/db.js';

export const checkFavorite = async (userId, listingId) => {
    const result = await db.query(
        'SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2',
        [userId, listingId]
    );
    return result.rows.length > 0;
};

export const addFavorite = async (userId, listingId) => {
    await db.query('INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2)', [userId, listingId]);
};

export const removeFavorite = async (userId, listingId) => {
    await db.query('DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2', [userId, listingId]);
};

export const getFavoritesByUserId = async (userId) => {
    const result = await db.query(
        `SELECT DISTINCT ON (l.id) l.id, l.title, l.price, l.location, lp.photo_url
         FROM favorites f
         JOIN listings l ON f.listing_id = l.id
         LEFT JOIN listing_photos lp ON l.id = lp.listing_id
         WHERE f.user_id = $1
         ORDER BY l.id`,
        [userId]
    );
    return result.rows;
};

export const getFavoriteListingIdsByUserId = async (userId) => {
    const result = await db.query('SELECT listing_id FROM favorites WHERE user_id = $1', [userId]);
    return result.rows.map(row => row.listing_id);
};

export const isListingFavorited = async (userId, listingId) => {
    const result = await db.query(
        `SELECT * FROM favorites
         WHERE user_id = $1 AND listing_id = $2`,
        [userId, listingId]
    );
    return result.rowCount > 0;
};