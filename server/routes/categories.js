import express from 'express';
import db from '../config/db.js';

const router = express.Router();

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

        const categoryId = categoryCheckResult.rows[0].id;
        const result = await db.query(
            `SELECT * FROM categories WHERE parent_cat = $1`,
            [categoryId]
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
            "SELECT * FROM listings WHERE category = $1 LIMIT $2 OFFSET $3",
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



export default router;
