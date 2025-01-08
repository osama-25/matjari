import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth';
import { googleLogin, login, register, requestPasswordReset, resetPassword } from '../controllers/authController';
import verifyToken from '../middleware/middleware';

jest.mock('../controllers/authController');
jest.mock('../middleware/middleware');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      register.mockImplementation((req, res) => res.status(200).json({ success: true, message: 'User registered successfully' }));

      const response = await request(app)
        .post('/auth/register')
        .send({ info: { firstName: 'John', lastName: 'Doe', email: 'test@example.com', password: 'password', confirmPassword: 'password', userName: 'johndoe' } });

      expect(register).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: 'User registered successfully' });
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      login.mockImplementation((req, res) => res.status(200).json({ success: true, message: 'Login successful!' }));

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(login).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: 'Login successful!' });
    });
  });

  describe('POST /auth/request-password-reset', () => {
    it('should request a password reset', async () => {
      requestPasswordReset.mockImplementation((req, res) => res.status(200).json({ success: true, message: 'Password reset email sent' }));

      const response = await request(app)
        .post('/auth/request-password-reset')
        .send({ email: 'test@example.com' });

      expect(requestPasswordReset).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: 'Password reset email sent' });
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset the password', async () => {
      resetPassword.mockImplementation((req, res) => res.status(200).json({ success: true, message: 'Password has been reset successfully' }));

      const response = await request(app)
        .post('/auth/reset-password')
        .send({ token: 'validToken', newPassword: 'newPassword' });

      expect(resetPassword).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: 'Password has been reset successfully' });
    });
  });

  describe('GET /auth/google', () => {
    it('should login with Google', async () => {
      googleLogin.mockImplementation((req, res) => res.redirect(`${process.env.FRONTEND_URL}/home?token=token`));

      const response = await request(app).get('/auth/google');

      expect(googleLogin).toHaveBeenCalled();
      expect(response.status).toBe(302);
    });
  });

  describe('GET /auth/home', () => {
    it('should return 200 for authenticated user', async () => {
      verifyToken.mockImplementation((req, res, next) => {
        req.user = { id: 1, email: 'test@example.com' };
        next();
      });

      const response = await request(app).get('/auth/home');

      expect(verifyToken).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  
});