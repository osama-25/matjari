import express from 'express';
import { googleLogin, login, register } from '../controllers/authController.js';


import verifyToken from '../middleware/middleware.js';
import { requestPasswordReset, resetPassword } from '../controllers/authController.js';
import passport from 'passport';

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
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google', googleLogin);
// router.get(
//     '/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         // Generate token and send to the client
//         const token = generateToken({ id: req.user.id, email: req.user.email });
//         res.redirect(`http://localhost:3000/home/?token=${token}`);
//     }
// );

// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//     // Successful authentication, redirect home.
//     res.redirect('http://localhost:3000/en/home');
// });

// router.delete('/logout', logout);


export default router;