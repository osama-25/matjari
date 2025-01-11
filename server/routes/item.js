import express from 'express';
import { createItem, getItemById, deleteItem, updateItemById, getItemsByUserId } from '../controllers/itemController.js';
import { verifyToken } from '../middleware/middleware.js';


const router = express.Router();

router.post('/', verifyToken ,createItem);
router.get('/:id', getItemById);
router.delete('/delete/:id', verifyToken, deleteItem);
router.post('/update/:listingId', verifyToken ,updateItemById);
router.get('/store/:userId', getItemsByUserId);

export default router;