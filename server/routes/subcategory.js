import express from 'express';
import { filterItems, getItemsBySubcategory } from '../controllers/subcategoryController.js';

const router = express.Router();

// POST filter search items with pagination
router.post("/filter/:subcategory/:page/:pageSize", filterItems);

// GET search items by subcategory with pagination
router.get("/:subcategory/:page/:pageSize", getItemsBySubcategory);

export default router;
