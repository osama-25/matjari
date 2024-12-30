import { getTotalItems, getPaginatedResults } from '../models/imageDescModel';
import db from '../config/db';

jest.mock('../config/db');

describe('ImageDesc Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalItems', () => {
    it('should return total count of items', async () => {
      const mockTags = ['tag1', 'tag2'];
      const mockCount = { rows: [{ total: '5' }] };
      
      db.query.mockResolvedValue(mockCount);

      const result = await getTotalItems(mockTags);
      
      expect(result).toBe(5);
    });
  });

  describe('getPaginatedResults', () => {
    it('should return paginated results', async () => {
      const mockTags = ['tag1', 'tag2'];
      const pageSize = 10;
      const offset = 0;
      const mockResults = {
        rows: [
          { id: 1, title: 'Item 1' },
          { id: 2, title: 'Item 2' }
        ]
      };

      db.query.mockResolvedValue(mockResults);

      const result = await getPaginatedResults(mockTags, pageSize, offset);
      
      expect(result).toEqual(mockResults.rows);
    });
  });
});