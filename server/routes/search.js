import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/search', async (req, res) => {
    const { term, page, pageSize } = req.query;
    try {
        // Default values if not provided
        const parsedPage = parseInt(page) || 1;
        const parsedPageSize = parseInt(pageSize) || 10;
        console.log("Search route: "+term);
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
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        // Fetch items for the current page with limit and offset
        const itemsResult = await db.query(
            "SELECT * FROM listings WHERE title ILIKE $1 LIMIT $2 OFFSET $3",
            [`%${term}%`, parsedPageSize, offset]
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