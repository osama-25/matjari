import { getCategoryIdByName, getTotalItemsCount, getItemsForSubcategory } from '../models/SubcategoryModel.js';

// Controller function for filtering items based on various criteria
export const filterItems = async (req, res) => {
    const { subcategory, page, pageSize } = req.params;
    const { minPrice, maxPrice, location, delivery, condition, order } = req.body;

    try {
        const categoryId = await getCategoryIdByName(subcategory);
        if (!categoryId) {
            return res.status(404).json({ error: "Category not found" });
        }

        const totalItems = await getTotalItemsCount(subcategory, { minPrice, maxPrice, location, delivery, condition });
        const totalPages = Math.ceil(totalItems / pageSize);
        const offset = (parseInt(page) - 1) * parseInt(pageSize);

        const items = await getItemsForSubcategory(subcategory, { minPrice, maxPrice, location, delivery, condition }, pageSize, offset, order);

        res.status(200).json({
            items,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalItems,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching filtered items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function for fetching items by subcategory without filters
export const getItemsBySubcategory = async (req, res) => {
    const { subcategory, page, pageSize } = req.params;

    try {
        const parsedPage = parseInt(page);
        const parsedPageSize = parseInt(pageSize);

        if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedPageSize) || parsedPageSize < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }

        const categoryId = await getCategoryIdByName(subcategory);
        if (!categoryId) {
            return res.status(404).json({ error: "Category not found" });
        }

        const offset = (parsedPage - 1) * parsedPageSize;
        const totalItems = await getTotalItemsCount(subcategory);
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        const items = await getItemsForSubcategory(subcategory, {}, parsedPageSize, offset, '');

        res.status(200).json({
            items,
            page: parsedPage,
            pageSize: parsedPageSize,
            totalItems,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
