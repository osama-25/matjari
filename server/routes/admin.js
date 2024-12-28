import express from 'express';
import { fetchUsers, fetchReports, banUser, unbanUser, submitReport, updateReport } from '../controllers/adminController.js';
// import { createAdmin } from '../models/adminModel.js';
import { isAdmin } from '../middleware/authMiddleware.js'; // Import the middleware
import { login } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', isAdmin); // Apply the middleware to all admin routes

// router.post('/create', async (req, res) => {
//     const { username, password } = req.query; // Use query parameters
//     try {
//         const adminId = await createAdmin(username, password);
//         res.status(201).json({ success: true, message: 'Admin created successfully', adminId });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error creating admin' });
//     }
// });

router.get('/get-users', fetchUsers);

router.get('/get-reports', fetchReports);

router.post('/ban-user/:id', banUser);

router.post('/unban-user/:id', unbanUser);

router.post('/submit-report', submitReport);

router.put('/update-report-status/:id', updateReport);

export default router;