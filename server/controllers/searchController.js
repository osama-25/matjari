import { getSearchResults, getTotalItemsCount, fetchFilteredItems, fetchItemSuggestions } from "../models/searchModel.js";

// Controller for fetching search results with pagination
export const searchItems = async (req, res) => {
    const { term, page, pageSize } = req.query;
    console.log("Search route: " + term);
    console.log("Pages: " + pageSize);

    try {
        const parsedPage = parseInt(page) || 1;
        const parsedPageSize = parseInt(pageSize) || 10;

        // Validate pagination parameters
        if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedPageSize) || parsedPageSize < 1) {
            return res.status(400).json({ error: "Invalid pagination parameters" });
        }

        // Ensure search term is provided
        if (!term) {
            return res.status(400).json({ error: "Search term is required" });
        }

        const offset = (parsedPage - 1) * parsedPageSize;

        // Get total items count for pagination
        const totalItems = await getTotalItemsCount(term);
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        // Get items for the current page
        const items = await getSearchResults(term, parsedPageSize, offset);

        res.status(200).json({
            items: items,
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

// Controller for filtering search items with pagination
export const filterItems = async (req, res) => {
    const { page, pageSize } = req.params;
    const { searchTerm, minPrice, maxPrice, location, delivery, condition, order } = req.body;

    try {
        const parsedPage = parseInt(page) || 1;
        const parsedPageSize = parseInt(pageSize) || 5;

        const filters = { minPrice, maxPrice, location, delivery, condition, order };
        const result = await fetchFilteredItems(searchTerm, filters, parsedPage, parsedPageSize);

        res.status(200).json({
            items: result.items,
            page: parsedPage,
            pageSize: parsedPageSize,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller for fetching search suggestions
export const getSuggestions = async (req, res) => {
    const { term } = req.query;
    console.log("Suggestions route: " + term);

    if (!term) {
        return res.json({ suggestions: [] });
    }

    try {
        const suggestions = await fetchItemSuggestions(term);
        res.json({ suggestions });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
