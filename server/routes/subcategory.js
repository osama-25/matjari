import express from 'express';
import db from '../config/db.js';

export const router = express.Router();

router.post("/filter/:subcategory", async (req, res) => {
    const { subcategory } = req.params;
    const { minPrice, maxPrice, location, delivery, condition, order } = req.body;

    try {
        // Get category ID from the database
        const subcategoryResult = await db.query(
            "SELECT id FROM categories WHERE name = $1",
            [subcategory]
        );

        if (subcategoryResult.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        let query = `SELECT COUNT(*) AS total FROM listings WHERE sub_category = $1`;
        const queryParams = [subcategory];

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

        const parsedPage = parseInt(req.query.page) || 1;
        const parsedPageSize = parseInt(req.query.pageSize) || 10;

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
            WHERE l.sub_category = $1`;

        filterQuery += query.replace('SELECT COUNT(*) AS total FROM listings WHERE sub_category = $1', '');

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
        console.error("Error fetching filtered items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:subcategory/:page/:pageSize", async (req, res) => {
    const { subcategory, page, pageSize } = req.params; // Extract from URL parameters
    try {
        // Validate `page` and `pageSize` to ensure they are integers and positive
        const parsedPage = parseInt(page);
        const parsedPageSize = parseInt(pageSize);

        if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedPageSize) || parsedPageSize < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }

        // Get category ID from the database
        const subcategoryResult = await db.query(
            "SELECT id FROM categories WHERE name = $1",
            [subcategory]
        );

        if (subcategoryResult.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Calculate the offset for pagination
        const offset = (parsedPage - 1) * parsedPageSize;

        // Fetch total items count for the category to calculate total pages
        const countResult = await db.query(
            "SELECT COUNT(*) AS total FROM listings WHERE sub_category = $1",
            [subcategory]
        );
        const totalItems = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(totalItems / parsedPageSize);
        
        // Fetch items for the current page with limit and offset
        const itemsResult = await db.query(
            `SELECT l.*, 
                    (SELECT photo_url FROM listing_photos lp WHERE lp.listing_id = l.id LIMIT 1) AS image 
             FROM listings l 
             WHERE l.sub_category = $1 
             LIMIT $2 OFFSET $3`,
            [subcategory, parsedPageSize, offset]
        );

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

export default router;