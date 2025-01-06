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