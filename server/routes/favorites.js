import express from 'express';
import { handleFavorite, getFavorites, getFavoriteListingIds, checkIfFavorited } from '../controllers/favoritesController.js';

const router = express.Router();

router.post('/', handleFavorite);
router.get('/:userId', getFavorites);
router.get('/batch/:userId', getFavoriteListingIds);
router.get('/:listingId/:userId', checkIfFavorited);

export default router;