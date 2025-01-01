import db from '../config/db.js';

export const getCategoryIdByName = async (category) => {
    const result = await db.query(
        "SELECT id FROM categories WHERE name = $1",
        [category]
    );
    return result.rows[0]?.id || null;
};

export const getTotalItemsByCategory = async (category) => {
    const result = await db.query(
        "SELECT COUNT(*) AS total FROM listings WHERE category = $1",
        [category]
    );
    return parseInt(result.rows[0].total);
};

export const getItemsByCategory = async (category, limit, offset, order) => {
    let filterQuery = `
        SELECT l.*, 
               (SELECT photo_url 
                FROM listing_photos lp 
                WHERE lp.listing_id = l.id  
                LIMIT 1) as image
        FROM listings l 
        WHERE l.category = $1`;

    if (order === 'lowtohigh') {
        filterQuery += ` ORDER BY price ASC`;
    } else if (order === 'hightolow') {
        filterQuery += ` ORDER BY price DESC`;
    }

    filterQuery += ` LIMIT $2 OFFSET $3`;
    const queryParams = [category, limit, offset];

    const result = await db.query(filterQuery, queryParams);
    return result.rows;
};

export const getSubcategoriesByName = async (name) => {
    const result = await db.query(
        `SELECT * FROM categories WHERE parent_cat = $1`,
        [name]
    );
    return result.rows;
};

export const getAllCategories = async () => {
    const result = await db.query(
        `SELECT name FROM categories WHERE parent_cat is NULL`
    );
    return result.rows;
};