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

// Filter search results based on various criteria
export const fetchFilteredItems = async (query, queryParams, pageSize, offset) => {
    const filterQuery = query + ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

    const result = await db.query(filterQuery, queryParams);
    return result.rows;
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
