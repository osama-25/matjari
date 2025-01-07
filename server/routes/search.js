import express from 'express';
import { searchItems, filterItems, getSuggestions } from '../controllers/searchController.js';

const router = express.Router();

// GET search items with pagination
router.get('/', searchItems);

// POST filter search items with pagination
router.post('/filter/:page/:pageSize', filterItems);

// GET search suggestions
router.get('/suggestions', getSuggestions);

export default router;
