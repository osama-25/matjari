import express from 'express';
import { fetchUsers, fetchReports, banUser } from '../controllers/adminController.js';
const router = express.Router();

router.get('/get-users', fetchUsers)

router.get('/get-reports', fetchReports);

router.post('/ban-user/:id', banUser);

export default router;