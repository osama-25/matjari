import { getSearchResults, getTotalItemsCount, fetchFilteredItems, fetchItemSuggestions } from '../models/searchModel';
import db from '../config/db';

jest.mock('../config/db');

describe('Search Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSearchResults', () => {
    it('should return search results with pagination', async () => {
      const mockResults = [{ id: 1, title: 'Item 1' }];
      db.query.mockResolvedValue({ rows: mockResults });

      const result = await getSearchResults('test', 10, 0);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['%test%', 10, 0]);
      expect(result).toEqual(mockResults);
    });
  });

  describe('getTotalItemsCount', () => {
    it('should return the total item count for search', async () => {
      const mockResult = { rows: [{ total: '5' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getTotalItemsCount('test');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['%test%']);
      expect(result).toBe(5);
    });
  });

  describe('fetchFilteredItems', () => {
    it('should return filtered search results', async () => {
      const mockResults = [{ id: 1, title: 'Item 1' }];
      db.query.mockResolvedValue({ rows: mockResults });

      const result = await fetchFilteredItems(' AND price >= $2', ['%test%', 10], 10, 0);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['%test%', 10, 10, 0]);
      expect(result).toEqual(mockResults);
    });
  });

  describe('fetchItemSuggestions', () => {
    it('should return item suggestions based on search term', async () => {
      const mockResults = [{ title: 'Item 1' }];
      db.query.mockResolvedValue({ rows: mockResults });

      const result = await fetchItemSuggestions('test');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['test%', '%test%']);
      expect(result).toEqual(['Item 1']);
    });
  });
});