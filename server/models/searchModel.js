import db from '../config/db.js';

// Fetch search results with pagination
export const getSearchResults = async (term, pageSize, offset) => {
    const result = await db.query(`
        SELECT l.*, 
               (SELECT photo_url 
                FROM listing_photos lp 
                WHERE lp.listing_id = l.id  
                LIMIT 1) as image
        FROM listings l 
        WHERE l.title ILIKE $1 
        ORDER BY l.created_at DESC
        LIMIT $2 OFFSET $3`,
        [`%${term}%`, pageSize, offset]
    );
    return result.rows;
};

// Get total item count for search
export const getTotalItemsCount = async (term) => {
    const result = await db.query("SELECT COUNT(*) AS total FROM listings WHERE title ILIKE $1", [`%${term}%`]);
    return parseInt(result.rows[0].total);
};

export const fetchFilteredItems = async (searchTerm, filters, page, pageSize) => {
    const { minPrice, maxPrice, location, delivery, condition, order } = filters;

    let query = `SELECT COUNT(*) AS total FROM listings WHERE title ILIKE $1`;
    const queryParams = [`%${searchTerm}%`];

    if (minPrice) {
        queryParams.push(minPrice);
        query += ` AND price >= $${queryParams.length}`;
    }
    if (maxPrice) {
        queryParams.push(maxPrice);
        query += ` AND price <= $${queryParams.length}`;
    }
    if (location) {
        queryParams.push(location);
        query += ` AND location = $${queryParams.length}`;
    }
    if (delivery) {
        queryParams.push(delivery);
        query += ` AND delivery = $${queryParams.length}`;
    }
    if (condition) {
        queryParams.push(condition);
        query += ` AND condition = $${queryParams.length}`;
    }

    const countResult = await db.query(query, queryParams);
    const totalItems = countResult.rows[0].total;
    const totalPages = Math.ceil(totalItems / pageSize);

    const offset = (page - 1) * pageSize;

    let filterQuery = `
    SELECT l.*, 
           (SELECT photo_url 
            FROM listing_photos lp 
            WHERE lp.listing_id = l.id  
            LIMIT 1) as image
    FROM listings l 
    WHERE l.title ILIKE $1`;

    filterQuery += query.replace('SELECT COUNT(*) AS total FROM listings WHERE title ILIKE $1', '');

    if (order === 'lowtohigh') {
        filterQuery += ` ORDER BY price ASC`;
    } else if (order === 'hightolow') {
        filterQuery += ` ORDER BY price DESC`;
    }

    filterQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    const result = await db.query(filterQuery, [...queryParams, pageSize, offset]);

    return {
        items: result.rows,
        totalItems,
        totalPages
    };
};

// Get item suggestions based on search term
export const fetchItemSuggestions = async (term) => {
    const result = await db.query(`
        SELECT title FROM (
                SELECT DISTINCT title, LENGTH(title) as len, 1 as priority
                FROM listings 
                WHERE title ILIKE $1
                UNION ALL
                SELECT DISTINCT title, LENGTH(title) as len, 2 as priority
                FROM listings 
                WHERE title ILIKE $2 AND title NOT ILIKE $1
            ) as combined_results 
            ORDER BY priority ASC, len ASC
            LIMIT 5;
    `, [`${term}%`, `%${term}%`]);

    return result.rows.map(row => row.title);
};
