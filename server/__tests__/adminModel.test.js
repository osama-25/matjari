import { getAllUsers, getReports, banUserById, unbanUserById, saveReport, updateReportStatus, verifyAdminPassword } from '../models/adminModel';
import db from '../config/db';

jest.mock('../config/db');

describe('Admin Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1, name: 'John Doe' }];
      db.query.mockResolvedValue({ rows: mockUsers });

      const result = await getAllUsers();

      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getReports', () => {
    it('should return all reports', async () => {
      const mockReports = [{ id: 1, description: 'Report 1' }];
      db.query.mockResolvedValue({ rows: mockReports });

      const result = await getReports();

      expect(db.query).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockReports);
    });
  });

  describe('banUserById', () => {
    it('should ban a user by ID', async () => {
      const userId = 1;
      db.query.mockResolvedValue();

      await banUserById(userId);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [userId]);
    });
  });

  describe('unbanUserById', () => {
    it('should unban a user by ID', async () => {
      const userId = 1;
      db.query.mockResolvedValue();

      await unbanUserById(userId);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [userId]);
    });
  });

  

  describe('updateReportStatus', () => {
    it('should update the status of a report', async () => {
      const reportId = 1;
      const status = 'resolved';
      const mockUpdatedReport = { id: reportId, status };
      db.query.mockResolvedValue({ rows: [mockUpdatedReport] });

      const result = await updateReportStatus(reportId, status);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [status, reportId]);
      expect(result).toEqual(mockUpdatedReport);
    });
  });

  
});