import { getCategoryIdByName, getTotalItemsByCategory, getItemsByCategory, getSubcategoriesByName, getAllCategories } from '../models/categoriesModel.js';

export const filterItemsByCategory = async (req, res) => {
    const { category } = req.params;
    const { order } = req.body;

    try {
        const categoryId = await getCategoryIdByName(category);

        if (!categoryId) {
            return res.status(404).json({ error: "Category not found" });
        }

        const parsedPage = parseInt(req.query.page) || 1;
        const parsedPageSize = parseInt(req.query.pageSize) || 10;

        const totalItems = await getTotalItemsByCategory(category);
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        const offset = (parsedPage - 1) * parsedPageSize;

        const items = await getItemsByCategory(category, parsedPageSize, offset, order);

        res.status(200).json({
            items,
            page: parsedPage,
            pageSize: parsedPageSize,
            totalItems,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching filtered items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getSubcategories = async (req, res) => {
    const { name } = req.params;

    try {
        const subcategories = await getSubcategoriesByName(name);

        if (subcategories.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: "Error retrieving subcategories", message: error.message });
    }
};

export const getItemsByCategoryWithPagination = async (req, res) => {
    const { category, page, pageSize } = req.params;

    try {
        const parsedPage = parseInt(page);
        const parsedPageSize = parseInt(pageSize);

        if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedPageSize) || parsedPageSize < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }

        const categoryId = await getCategoryIdByName(category);

        if (!categoryId) {
            return res.status(404).json({ error: "Category not found" });
        }

        const offset = (parsedPage - 1) * parsedPageSize;

        const totalItems = await getTotalItemsByCategory(category);
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        const items = await getItemsByCategory(category, parsedPageSize, offset);

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

export const getAllCategoriesHandler = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};