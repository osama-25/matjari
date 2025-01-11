import express from 'express';
import {verifyToken} from '../middleware/middleware.js';
import { getUser, modifyUser } from '../controllers/userController.js';

const router = express.Router();

// GET user data
router.get("/get", verifyToken, getUser);

// PUT modify user data
router.put("/modify", verifyToken, modifyUser);

export default router;
