import express from 'express';
import { fetchImageById, fetchAllImages, uploadImage } from '../controllers/imageController.js';

const router = express.Router();

// JUST FOR TESTING
router.get('/images/:id', fetchImageById);

router.get('/images', fetchAllImages);

router.post('/upload', uploadImage);

export default router;