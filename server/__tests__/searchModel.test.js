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



  describe('fetchFilteredItems', () => {
    it('should return filtered items with pagination', async () => {
      // Mock data
      const mockItems = [{
        id: 1,
        title: 'Test Item',
        price: 50,
        image: 'test.jpg'
      }];
      const mockTotalCount = { rows: [{ total: '5' }] };

      // Setup mocks in correct order
      db.query
        .mockResolvedValueOnce(mockTotalCount) 
        .mockResolvedValueOnce({ rows: mockItems }); 

      const filters = {
        minPrice: 10,
        maxPrice: 100,
        location: 'NY',
        delivery: 'Yes',
        condition: 'New',
        order: 'lowtohigh'
      };

      const result = await fetchFilteredItems('test', filters, 1, 5);

      // Verify result structure
      expect(result).toEqual({
        items: mockItems,
        totalItems: '5',
        totalPages: 1
      });

      // Verify queries
      expect(db.query).toHaveBeenCalledTimes(2);

      // Verify first query (COUNT)
      expect(db.query.mock.calls[0][1]).toEqual(
        expect.arrayContaining(['%test%', 10, 100, 'NY', 'Yes', 'New'])
      );

      // Verify second query (SELECT)
      expect(db.query.mock.calls[1][1]).toEqual(
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