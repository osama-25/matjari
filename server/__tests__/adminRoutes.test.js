import request from 'supertest';
import express from 'express';
import adminRoutes from '../routes/admin';
import { fetchUsers, fetchReports, banUser, unbanUser, submitReport, updateReport, adminLogin } from '../controllers/adminController';


jest.mock('../controllers/adminController');

const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin/get-users', () => {
    it('should fetch all users', async () => {
      fetchUsers.mockImplementation((req, res) => res.status(200).json([{ id: 1, name: 'John Doe' }]));

      const response = await request(app).get('/admin/get-users');

      expect(fetchUsers).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, name: 'John Doe' }]);
    });
  });

  describe('GET /admin/get-reports', () => {
    it('should fetch all reports', async () => {
      fetchReports.mockImplementation((req, res) => res.status(200).json([{ id: 1, description: 'Report 1' }]));

      const response = await request(app).get('/admin/get-reports');

      expect(fetchReports).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, description: 'Report 1' }]);
    });
  });

  describe('POST /admin/ban-user/:id', () => {
    it('should ban a user', async () => {
      banUser.mockImplementation((req, res) => res.status(200).json({ message: 'User banned successfully' }));

      const response = await request(app).post('/admin/ban-user/1');

      expect(banUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User banned successfully' });
    });
  });

  describe('POST /admin/unban-user/:id', () => {
    it('should unban a user', async () => {
      unbanUser.mockImplementation((req, res) => res.status(200).json({ message: 'User unbanned successfully' }));

      const response = await request(app).post('/admin/unban-user/1');

      expect(unbanUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User unbanned successfully' });
    });
  });

  describe('POST /admin/submit-report', () => {
    it('should submit a report', async () => {
      submitReport.mockImplementation((req, res) => res.status(200).json({ message: 'Report submitted successfully' }));

      const response = await request(app)
        .post('/admin/submit-report')
        .send({ description: 'Test report', errorType: 'Error', userId: 1 });

      expect(submitReport).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Report submitted successfully' });
    });
  });

  describe('PUT /admin/update-report-status/:id', () => {
    it('should update a report', async () => {
      updateReport.mockImplementation((req, res) => res.status(200).json({ report: { id: 1, status: 'resolved' } }));

      const response = await request(app)
        .put('/admin/update-report-status/1')
        .send({ status: 'resolved' });

      expect(updateReport).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ report: { id: 1, status: 'resolved' } });
    });
  });

});