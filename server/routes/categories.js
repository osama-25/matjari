import express from 'express';
import db from '../config/db.js';

export const router = express.Router();

router.post("/filter/:category", async (req, res) => {
    const { category } = req.params;
    const { order } = req.body;

    try {
        // Get category ID from the database
        const categoryResult = await db.query(
            "SELECT id FROM categories WHERE name = $1",
            [category]
        );

        if (categoryResult.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        const parsedPage = parseInt(req.query.page) || 1;
        const parsedPageSize = parseInt(req.query.pageSize) || 10;

        const countResult = await db.query(
            "SELECT COUNT(*) AS total FROM listings WHERE category = $1",
            [category]
        );
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
            WHERE l.category = $1`;

        if (order === 'lowtohigh') {
            filterQuery += ` ORDER BY price ASC`;
        } else if (order === 'hightolow') {
            filterQuery += ` ORDER BY price DESC`;
        }

        filterQuery += ` LIMIT $2 OFFSET $3`;
        const queryParams = [category, parsedPageSize, offset];

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

router.get('/:name', async (req, res) => {
    console.log('Route hit');
    const { name } = req.params;
    console.log(name);
    try {
        // Check if the category exists in the table by its name
        const categoryCheckResult = await db.query(
            `SELECT id FROM categories WHERE name = $1 and parent_cat is NULL`,
            [name]
        );
        console.log('Category check result:', categoryCheckResult.rowCount);
        if (categoryCheckResult.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        const result = await db.query(
            `SELECT * FROM categories WHERE parent_cat = $1`,
            [name]
        );

        const data = result.rows;
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: "Error retrieving subcategories", message: error.message });
    }
});

router.get("/:category/:page/:pageSize", async (req, res) => {
    const { category, page, pageSize } = req.params; // Extract from URL parameters
    try {
        // Validate `page` and `pageSize` to ensure they are integers and positive
        const parsedPage = parseInt(page);
        const parsedPageSize = parseInt(pageSize);

        if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedPageSize) || parsedPageSize < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }

        // Get category ID from the database
        const categoryResult = await db.query(
            "SELECT id FROM categories WHERE name = $1",
            [category]
        );

        if (categoryResult.rowCount === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Calculate the offset for pagination
        const offset = (parsedPage - 1) * parsedPageSize;

        // Fetch total items count for the category to calculate total pages
        const countResult = await db.query(
            "SELECT COUNT(*) AS total FROM listings WHERE category = $1",
            [category]
        );
        const totalItems = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        // Fetch items for the current page with limit and offset
        const itemsResult = await db.query(
            `SELECT l.*, 
                    (SELECT photo_url FROM listing_photos lp WHERE lp.listing_id = l.id LIMIT 1) AS image
             FROM listings l 
             WHERE l.category = $1 
             LIMIT $2 OFFSET $3`,
            [category, parsedPageSize, offset]
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

router.get("/", async (req, res) => {
    try {
        const categoryResult = await db.query(
            `SELECT name FROM categories WHERE parent_cat is NULL`,
        );
        const data = categoryResult.rows;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
