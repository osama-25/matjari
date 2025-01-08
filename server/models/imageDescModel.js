import db from '../config/db.js';

export const getTotalItems = async (tags) => {
    const countResult = await db.query(`
        SELECT COUNT(DISTINCT l.id) as total
        FROM listings l
        JOIN listing_photos lp ON lp.listing_id = l.id
        WHERE (
            SELECT COUNT(*)
            FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
            WHERE tag = ANY ($1)
        ) > 2`,
        [tags]
    );
    return parseInt(countResult.rows[0].total);
};

export const getPaginatedResults = async (tags, pageSize, offset) => {
    const result = await db.query(`
        SELECT * FROM ( 
            SELECT DISTINCT ON (l.id) l.*, 
                    (SELECT photo_url 
                    FROM listing_photos lp2 
                    WHERE lp2.listing_id = l.id 
                    ORDER BY lp2.id ASC 
                    LIMIT 1
                    ) as image,
                    (
                      SELECT COUNT(*)
                      FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                      WHERE tag = ANY ($1)
                    ) as matching_tags_count
              FROM listing_photos lp
              JOIN listings l ON lp.listing_id = l.id
              WHERE (
                SELECT COUNT(*)
                FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                WHERE tag = ANY ($1)
            ) >= 2
              ORDER BY l.id, matching_tags_count DESC) as listings
          ORDER BY matching_tags_count DESC   
          LIMIT $2 OFFSET $3`,
        [tags, pageSize, offset]
    );
    return result.rows;
};

export const getFilteredResults = async (tags, filters, pageSize, offset, order) => {
    const { minPrice, maxPrice, location, delivery, condition } = filters;

    let query = `
        SELECT COUNT(DISTINCT l.id) as total
        FROM listings l
        JOIN listing_photos lp ON lp.listing_id = l.id
        WHERE (
            SELECT COUNT(*)
            FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
            WHERE tag = ANY ($1)
        ) > 2`;
    const queryParams = [tags];

    if (minPrice) {
        queryParams.push(minPrice);
        query += ` AND l.price >= $${queryParams.length}`;
    }

    if (maxPrice) {
        queryParams.push(maxPrice);
        query += ` AND l.price <= $${queryParams.length}`;
    }

    if (location) {
        queryParams.push(location);
        query += ` AND l.location = $${queryParams.length}`;
    }

    if (delivery) {
        queryParams.push(delivery);
        query += ` AND l.delivery = $${queryParams.length}`;
    }

    if (condition) {
        queryParams.push(condition);
        query += ` AND l.condition = $${queryParams.length}`;
    }

    const countResult = await db.query(query, queryParams);
    const totalItems = countResult.rows[0].total;
    const totalPages = Math.ceil(totalItems / pageSize);

    let filterQuery = `
    SELECT * FROM ( 
        SELECT DISTINCT ON (l.id) l.*, 
               (SELECT photo_url 
                FROM listing_photos lp2 
                WHERE lp2.listing_id = l.id 
                ORDER BY lp2.id ASC 
                LIMIT 1) as image,
               (
                  SELECT COUNT(*)
                  FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                  WHERE tag = ANY ($1)
               ) as matching_tags_count
        FROM listing_photos lp
        JOIN listings l ON lp.listing_id = l.id
        WHERE (
            SELECT COUNT(*)
            FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
            WHERE tag = ANY ($1)
        ) >= 2`;

    filterQuery += query.replace(`SELECT COUNT(DISTINCT l.id) as total
        FROM listings l
        JOIN listing_photos lp ON lp.listing_id = l.id
        WHERE (
            SELECT COUNT(*)
            FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
            WHERE tag = ANY ($1)
        ) > 2`, '');
    
    filterQuery += ` ORDER BY l.id, matching_tags_count DESC) as listings ORDER BY`

    if (order === 'lowtohigh') {
        filterQuery += ` price ASC,`;
    } else if (order === 'hightolow') {
        filterQuery += ` price DESC,`;
    }

    filterQuery += ` matching_tags_count DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

    const itemsResult = await db.query(filterQuery, queryParams);

    return {
        items: itemsResult.rows,
        totalItems,
        totalPages
    };
};