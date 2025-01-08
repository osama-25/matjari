import { getTotalItems, getPaginatedResults, getFilteredResults } from '../models/imageDescModel';
import db from '../config/db';

jest.mock('../config/db');

describe('Image Description Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalItems', () => {
    it('should return the total number of items matching the tags', async () => {
      const mockTags = ['tag1', 'tag2'];
      const mockResult = { rows: [{ total: '5' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getTotalItems(mockTags);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockTags]);
      expect(result).toBe(5);
    });
  });

  describe('getPaginatedResults', () => {
    it('should return paginated results matching the tags', async () => {
      const mockTags = ['tag1', 'tag2'];
      const mockPageSize = 10;
      const mockOffset = 0;
      const mockResult = { rows: [{ id: 1, title: 'Item 1' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getPaginatedResults(mockTags, mockPageSize, mockOffset);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [mockTags, mockPageSize, mockOffset]);
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('getFilteredResults', () => {
    it('should return filtered results matching the tags and filters', async () => {
      const mockTags = ['tag1', 'tag2'];
      const mockFilters = { minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new' };
      const mockPageSize = 10;
      const mockOffset = 0;
      const mockOrder = 'lowtohigh';
      const mockResult = { rows: [{ id: 1, title: 'Item 1' }] };
      db.query.mockResolvedValueOnce({ rows: [{ total: '5' }] });
      db.query.mockResolvedValueOnce(mockResult);

      const result = await getFilteredResults(mockTags, mockFilters, mockPageSize, mockOffset, mockOrder);

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        items: mockResult.rows,
        totalItems: '5',
        totalPages: 1
      });
    });
  });
});