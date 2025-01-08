import { requestPasswordReset, resetPassword, register, login, googleLogin } from '../controllers/authController';
import { createUser, getUserByEmail, hashPassword } from '../models/userModel';
import db from '../config/db';
import passport from '../middleware/passport';
import { generateToken } from '../middleware/middleware';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from '../controllers/emailService';

jest.mock('../models/userModel');
jest.mock('../config/db');
jest.mock('../middleware/passport');
jest.mock('../middleware/middleware');
jest.mock('jsonwebtoken');
jest.mock('../controllers/emailService');

describe('Auth Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('requestPasswordReset', () => {
        it('should send a password reset email if user exists', async () => {
            const req = { body: { email: 'test@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            getUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });
            jwt.sign.mockReturnValue('resetToken');
            sendResetEmail.mockResolvedValue();

            await requestPasswordReset(req, res);

            expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET, { expiresIn: '15m' });
            expect(sendResetEmail).toHaveBeenCalledWith('test@example.com', 'resetToken');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Password reset email sent' });
        });

        it('should return 404 if user does not exist', async () => {
            const req = { body: { email: 'test@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            getUserByEmail.mockResolvedValue(null);

            await requestPasswordReset(req, res);

            expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Email not found' });
        });

        it('should handle errors', async () => {
            const req = { body: { email: 'test@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            getUserByEmail.mockRejectedValue(new Error('Database error'));

            await requestPasswordReset(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Server error' });
        });
    });

    describe('resetPassword', () => {
        it('should reset the password if token is valid', async () => {
            const req = { body: { token: 'validToken', newPassword: 'newPassword' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
            hashPassword.mockResolvedValue('hashedPassword');
            db.query.mockResolvedValue();

            await resetPassword(req, res);

            expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
            expect(hashPassword).toHaveBeenCalledWith('newPassword');
            expect(db.query).toHaveBeenCalledWith('UPDATE users SET password = $1 WHERE id = $2', ['hashedPassword', 1]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Password has been reset successfully' });
        });

        it('should return 400 if token is invalid', async () => {
            const req = { body: { token: 'invalidToken', newPassword: 'newPassword' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await resetPassword(req, res);

            expect(jwt.verify).toHaveBeenCalledWith('invalidToken', process.env.JWT_SECRET);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired token' });
        });
    });

    
});

describe('register', () => {
    it('should register a new user', async () => {
        const req = { body: { info: { firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password', confirmPassword: 'password', userName: 'johndoe' } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        getUserByEmail.mockResolvedValue(null);
        createUser.mockResolvedValue({ id: 1 });
        generateToken.mockReturnValue('token');

        await register(req, res);

        expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(createUser).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password', userName: 'johndoe' });
        expect(generateToken).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, token: 'token', message: 'User registered successfully', user: { id: 1 } });
    });

    it('should return 400 if email is already registered', async () => {
        const req = { body: { info: { firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password', confirmPassword: 'password', userName: 'johndoe' } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        getUserByEmail.mockResolvedValue({ id: 1 });

        await register(req, res);

        expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Email already registered' });
    });

    it('should return 400 if passwords do not match', async () => {
        const req = {
            body: {
                info: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'test@example.com',
                    password: 'password',
                    confirmPassword: 'differentPassword',
                    userName: 'johndoe'
                }
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        getUserByEmail.mockResolvedValue(null);

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Passwords don't match!" });
    });

    it('should handle errors', async () => {
        const req = { body: { info: { firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password', confirmPassword: 'password', userName: 'johndoe' } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        getUserByEmail.mockRejectedValue(new Error('Database error'));

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Error registering user' });
    });
});

describe('login', () => {
    it('should login an existing user', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        passport.authenticate.mockImplementation((strategy, callback) => (req, res, next) => {
            callback(null, { id: 1, email: 'test@example.com' });
        });
        generateToken.mockReturnValue('token');

        await login(req, res, next);

        expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
        expect(generateToken).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, token: 'token', message: 'Login successful!', user: { id: 1, email: 'test@example.com' } });
    });

    it('should return 401 if authentication fails', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        passport.authenticate.mockImplementation((strategy, callback) => (req, res, next) => {
            callback(null, false, { message: 'Invalid credentials' });
        });

        await login(req, res, next);

        expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
    });

    it('should handle errors', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        passport.authenticate.mockImplementation((strategy, callback) => (req, res, next) => {
            callback(new Error('Authentication error'));
        });

        await login(req, res, next);

        expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Authentication error' });
    });
});

describe('googleLogin', () => {
    it('should login with Google', async () => {
        const req = {};
        const res = { redirect: jest.fn() };
        const next = jest.fn();
        passport.authenticate.mockImplementation((strategy, options, callback) => (req, res, next) => {
            callback(null, { id: 1, email: 'test@example.com' });
        });
        generateToken.mockReturnValue('token');

        await googleLogin(req, res, next);

        expect(passport.authenticate).toHaveBeenCalledWith('google', { scope: ['profile', 'email'] }, expect.any(Function));
        expect(generateToken).toHaveBeenCalledWith({ id: 1, email: 'test@example.com' });
        expect(res.redirect).toHaveBeenCalledWith(`${process.env.FRONTEND_URL}/home?token=token`);
    });

    it('should handle authentication errors', async () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), redirect: jest.fn() };
        const next = jest.fn();

        passport.authenticate.mockImplementation((strategy, options, callback) => (req, res, next) => {
            const error = new Error('Authentication error');
            callback(error);
        });
        generateToken.mockReturnValue('token');

        await googleLogin(req, res, next);

        expect(passport.authenticate).toHaveBeenCalledWith('google', { scope: ['profile', 'email'] }, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Authentication error' });
    });
});
