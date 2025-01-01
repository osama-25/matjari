import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { term, page, pageSize } = req.query;
    console.log("Search route: "+term);
    console.log("Pages: "+pageSize);
    try {
        // Default values if not provided
        const parsedPage = parseInt(page) || 1;
        const parsedPageSize = parseInt(pageSize) || 10;
        console.log("PageSize: "+parsedPageSize);
        //console.log("Search route: "+term);
        // Validate page and pageSize
        if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedPageSize) || parsedPageSize < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }

        // Ensure term is not empty
        if (!term) {
            return res.status(400).json({ error: "Search term is required" });
        }

        // Calculate the offset for pagination
        const offset = (parsedPage - 1) * parsedPageSize;

        // Fetch total items count to calculate total pages
        const countResult = await db.query(
            "SELECT COUNT(*) AS total FROM listings WHERE title ILIKE $1",
            [`%${term}%`]
        );
        const totalItems = parseInt(countResult.rows[0].total);
        console.log("Total Items: "+totalItems);
        const totalPages = Math.ceil(totalItems / parsedPageSize);
        console.log("Total Pages: "+totalPages);
        // Fetch items for the current page with limit and offset
        const itemsResult = await db.query(`
            SELECT l.*, 
                   (SELECT photo_url 
                    FROM listing_photos lp 
                    WHERE lp.listing_id = l.id  
                    LIMIT 1) as image
            FROM listings l 
            WHERE l.title ILIKE $1 
            LIMIT $2 OFFSET $3`,
            [`%${term}%`, parsedPageSize, offset]
        );
        console.log("Search Results:", {
            totalItems: itemsResult.rows.length,
            items: itemsResult.rows.map(item => ({
                id: item.id,
                title: item.title,
                image: item.image
            }))
        });
        // Return paginated results along with metadata
        res.status(200).json({
            items: itemsResult.rows,
            page: parsedPage,
            pageSize: parsedPageSize,
            totalItems,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/filter/:page/:pageSize', async (req, res) => {
    const { page, pageSize } = req.params;
    const { searchTerm, minPrice, maxPrice, location, delivery, condition, order } = req.body;

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

    try {
        const parsedPage = parseInt(page) || 1;
        const parsedPageSize = parseInt(pageSize) || 5;

        const countResult = await db.query(query, queryParams);
        const totalItems = countResult.rows[0].total;
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        const offset = (parsedPage - 1) * parsedPageSize;

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
        queryParams.push(parsedPageSize, offset);

        const itemsResult = await db.query(filterQuery, queryParams);

        res.status(200).json({
            items: itemsResult.rows,
            page: parsedPage,
            pageSize: parsedPageSize,
            totalItems,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;