import express from 'express';
import { getUserDetails } from '../controllers/userController.js';

const router = express.Router();

// Route to get user details by userId
router.get('/:userId', getUserDetails);

export default router;
