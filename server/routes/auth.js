import express from 'express';
import { login, register } from '../controllers/authController.js';


import  verifyToken  from '../middleware/middleware.js';
import { requestPasswordReset, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.get('/home', verifyToken, (req, res) => {
    console.log(req.user);
    res.status(200).send("");

});
router.get('/test', verifyToken, (req, res) => {
    console.log(req.user.id);
    res.status(200);

});

router.post('/register', register);
router.post('/login', login);

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Password reset confirmation route
// router.delete('/logout', logout);


export default router;
