import db from '../config/db.js';

// Get category ID from the database
export const getCategoryIdByName = async (subcategory) => {
    const result = await db.query("SELECT id FROM categories WHERE name = $1", [subcategory]);
    return result.rowCount === 0 ? null : result.rows[0].id;
};

// Get the total item count for a subcategory with optional filters
export const getTotalItemsCount = async (subcategory, filters = {}) => {
    let query = `SELECT COUNT(*) AS total FROM listings WHERE sub_category = $1`;
    const queryParams = [subcategory];

    if (filters.minPrice) {
        queryParams.push(filters.minPrice);
        query += ` AND price >= $${queryParams.length}`;
    }

    if (filters.maxPrice) {
        queryParams.push(filters.maxPrice);
        query += ` AND price <= $${queryParams.length}`;
    }

    if (filters.location) {
        queryParams.push(filters.location);
        query += ` AND location = $${queryParams.length}`;
    }

    if (filters.delivery) {
        queryParams.push(filters.delivery);
        query += ` AND delivery = $${queryParams.length}`;
    }

    if (filters.condition) {
        queryParams.push(filters.condition);
        query += ` AND condition = $${queryParams.length}`;
    }

    const result = await db.query(query, queryParams);
    return result.rows[0].total;
};

// Get paginated items for a subcategory with optional filters and ordering
export const getItemsForSubcategory = async (subcategory, filters, pageSize, offset, order) => {
    let query = `
        SELECT l.*, 
            (SELECT photo_url FROM listing_photos lp WHERE lp.listing_id = l.id LIMIT 1) AS image
        FROM listings l
        WHERE l.sub_category = $1
    `;
    const queryParams = [subcategory];

    if (filters.minPrice) {
        queryParams.push(filters.minPrice);
        query += ` AND price >= $${queryParams.length}`;
    }
    if (filters.maxPrice) {
        queryParams.push(filters.maxPrice);
        query += ` AND price <= $${queryParams.length}`;
    }
    if (filters.location) {
        queryParams.push(filters.location);
        query += ` AND location = $${queryParams.length}`;
    }
    if (filters.delivery) {
        queryParams.push(filters.delivery);
        query += ` AND delivery = $${queryParams.length}`;
    }
    if (filters.condition) {
        queryParams.push(filters.condition);
        query += ` AND condition = $${queryParams.length}`;
    }

    if (order === 'lowtohigh') {
        query += ` ORDER BY price ASC`;
    } else if (order === 'hightolow') {
        query += ` ORDER BY price DESC`;
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

    const result = await db.query(query, queryParams);
    return result.rows;
};
