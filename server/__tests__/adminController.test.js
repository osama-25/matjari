import { fetchUsers, fetchReports, banUser, unbanUser, submitReport, updateReport, adminLogin } from '../controllers/adminController';
import { getAllUsers, getReports, banUserById, unbanUserById, saveReport, updateReportStatus, verifyAdminPassword } from '../models/adminModel';

jest.mock('../models/adminModel');

describe('Admin Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should fetch all users', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockUsers = [{ id: 1, name: 'John Doe' }];
      getAllUsers.mockResolvedValue(mockUsers);

      await fetchUsers(req, res);

      expect(getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      getAllUsers.mockRejectedValue(new Error('Database error'));

      await fetchUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch users' });
    });
  });

  describe('fetchReports', () => {
    it('should fetch all reports', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockReports = [{ id: 1, description: 'Report 1' }];
      getReports.mockResolvedValue(mockReports);

      await fetchReports(req, res);

      expect(getReports).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockReports);
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      getReports.mockRejectedValue(new Error('Database error'));

      await fetchReports(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch reports' });
    });
  });

  describe('banUser', () => {
    it('should ban a user', async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      banUserById.mockResolvedValue();

      await banUser(req, res);

      expect(banUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User banned successfully' });
    });

    it('should handle errors', async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      banUserById.mockRejectedValue(new Error('Database error'));

      await banUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to ban user' });
    });
  });

  describe('unbanUser', () => {
    it('should unban a user', async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      unbanUserById.mockResolvedValue();

      await unbanUser(req, res);

      expect(unbanUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User unbanned successfully' });
    });

    it('should handle errors', async () => {
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      unbanUserById.mockRejectedValue(new Error('Database error'));

      await unbanUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to unban user' });
    });
  });

  describe('submitReport', () => {
    it('should submit a report', async () => {
      const req = { body: { description: 'Test report', errorType: 'Error', userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      saveReport.mockResolvedValue();

      await submitReport(req, res);

      expect(saveReport).toHaveBeenCalledWith({ description: 'Test report', errorType: 'Error', userId: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report submitted successfully' });
    });

    it('should handle errors', async () => {
      const req = { body: { description: 'Test report', errorType: 'Error', userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      saveReport.mockRejectedValue(new Error('Database error'));

      await submitReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to submit report' });
    });
  });

  describe('updateReport', () => {
    it('should update a report', async () => {
      const req = { params: { id: 1 }, body: { status: 'resolved' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockUpdatedReport = { id: 1, status: 'resolved' };
      updateReportStatus.mockResolvedValue(mockUpdatedReport);

      await updateReport(req, res);

      expect(updateReportStatus).toHaveBeenCalledWith(1, 'resolved');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ report: mockUpdatedReport });
    });

    it('should handle errors', async () => {
      const req = { params: { id: 1 }, body: { status: 'resolved' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      updateReportStatus.mockRejectedValue(new Error('Database error'));

      await updateReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update report status' });
    });
  });

  describe('adminLogin', () => {
    it('should login an admin', async () => {
      const req = { body: { username: 'admin', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      verifyAdminPassword.mockResolvedValue(true);

      await adminLogin(req, res);

      expect(verifyAdminPassword).toHaveBeenCalledWith('admin', 'password');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', success: true });
    });

    it('should return 401 for invalid credentials', async () => {
      const req = { body: { username: 'admin', password: 'wrongpassword' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      verifyAdminPassword.mockResolvedValue(false);

      await adminLogin(req, res);

      expect(verifyAdminPassword).toHaveBeenCalledWith('admin', 'wrongpassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials', success: false });
    });

    it('should handle errors', async () => {
      const req = { body: { username: 'admin', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      verifyAdminPassword.mockRejectedValue(new Error('Database error'));

      await adminLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', success: false });
    });
  });
});