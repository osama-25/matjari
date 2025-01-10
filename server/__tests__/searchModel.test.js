import { getSearchResults, getTotalItemsCount, fetchFilteredItems, fetchItemSuggestions, buildFilterQuery } from '../models/searchModel';
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

  describe('buildFilterQuery', () => {
    it('should build query with all filters', () => {
      const result = buildFilterQuery('test', 10, 100, 'NY', 'Yes', 'New');
      expect(result.queryParams).toHaveLength(6);
      expect(result.query).toContain('price >= $2');
      expect(result.query).toContain('price <= $3');
    });
  });

  describe('fetchFilteredItems', () => {
    it('should return filtered items with pagination', async () => {
      const mockItems = [{ id: 1, title: 'Test Item', price: 50 }];
      const mockCount = { rows: [{ total: '5' }] };

      // Mock the database queries
      db.query
        .mockResolvedValueOnce({ rows: mockItems }) // For filtered items
        .mockResolvedValueOnce(mockCount); // For total count

      const filters = {
        minPrice: 10,
        maxPrice: 100,
        location: 'NY',
        delivery: 'Yes',
        condition: 'New',
        order: 'lowtohigh'
      };

      const result = await fetchFilteredItems('test', filters, 1, 5);

      expect(result).toEqual({
        items: mockItems,
        totalItems: 5,
        totalPages: 1
      });

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[0][1]).toEqual(
        expect.arrayContaining(['%test%', 10, 100, 'NY', 'Yes', 'New', 5, 0])
      );
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