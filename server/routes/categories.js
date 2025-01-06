import express from 'express';
import { filterItemsByCategory, getSubcategories, getItemsByCategoryWithPagination, getAllCategoriesHandler } from '../controllers/categoriesController.js';

const router = express.Router();

router.post("/filter/:category", filterItemsByCategory);
router.get('/:name', getSubcategories);
router.get("/:category/:page/:pageSize", getItemsByCategoryWithPagination);
router.get("/", getAllCategoriesHandler);

export default router;