import express from 'express';
import { fetchUsers, fetchReports, banUser, unbanUser, submitReport, updateReport } from '../controllers/adminController.js';
import { isAdmin } from '../middleware/middleware.js'; // Import the middleware
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', isAdmin); 

router.get('/get-users', fetchUsers);

router.get('/get-reports', fetchReports);

router.post('/ban-user/:id', banUser);

router.post('/unban-user/:id', unbanUser);

router.post('/submit-report', submitReport);

router.put('/update-report-status/:id', updateReport);

export default router;