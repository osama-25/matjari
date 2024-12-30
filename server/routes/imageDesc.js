import express from 'express';
import { describeImage, searchByImage } from '../controllers/imageDescController.js';

const router = express.Router();

router.post('/describe', describeImage);
router.post('/search-by-image', searchByImage);

export default router;