import express from 'express';
import { describeImage, searchByImage, searchByImageFilter } from '../controllers/imageDescController.js';

const router = express.Router();

router.post('/describe', describeImage);
router.post('/search-by-image', searchByImage);
router.post('/search-by-image/filter/:page/:pageSize', searchByImageFilter);

export default router;