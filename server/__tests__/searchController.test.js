import { searchItems, filterItems, getSuggestions } from '../controllers/searchController';
import { getSearchResults, getTotalItemsCount, fetchFilteredItems, fetchItemSuggestions } from '../models/searchModel';

jest.mock('../models/searchModel');

describe('Search Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchItems', () => {
    it('should fetch search results with pagination', async () => {
      const req = { query: { term: 'test', page: '1', pageSize: '10' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockItems = [{ id: 1, title: 'Item 1' }];
      getTotalItemsCount.mockResolvedValue(5);
      getSearchResults.mockResolvedValue(mockItems);

      await searchItems(req, res);

      expect(getTotalItemsCount).toHaveBeenCalledWith('test');
      expect(getSearchResults).toHaveBeenCalledWith('test', 10, 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        items: mockItems,
        page: 1,
        pageSize: 10,
        totalItems: 5,
        totalPages: 1,
      });
    });

    it('should handle errors', async () => {
      const req = { query: { term: 'test', page: '1', pageSize: '10' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      getTotalItemsCount.mockRejectedValue(new Error('Database error'));

      await searchItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('filterItems', () => {
    it('should return filtered items', async () => {
      const mockResult = {
        items: [{ id: 1, title: 'Test Item' }],
        totalItems: 5,
        totalPages: 1
      };

      fetchFilteredItems.mockResolvedValue(mockResult);

      const req = {
        params: { page: '1', pageSize: '5' },
        body: {
          searchTerm: 'test',
          minPrice: 10,
          maxPrice: 100,
          location: 'NY',
          delivery: 'Yes',
          condition: 'New',
          order: 'lowtohigh'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await filterItems(req, res);

      expect(fetchFilteredItems).toHaveBeenCalledWith(
        'test',
        {
          minPrice: 10,
          maxPrice: 100,
          location: 'NY',
          delivery: 'Yes',
          condition: 'New',
          order: 'lowtohigh'
        },
        1,
        5
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        items: mockResult.items,
        page: 1,
        pageSize: 5,
        totalItems: mockResult.totalItems,
        totalPages: mockResult.totalPages
      });
    });

    it('should handle errors', async () => {
      fetchFilteredItems.mockRejectedValue(new Error('Database error'));

      const req = {
        params: { page: '1', pageSize: '5' },
        body: { searchTerm: 'test' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await filterItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getSuggestions', () => {
    it('should fetch search suggestions', async () => {
      const req = { query: { term: 'test' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockSuggestions = ['Item 1'];
      fetchItemSuggestions.mockResolvedValue(mockSuggestions);

      await getSuggestions(req, res);

      expect(fetchItemSuggestions).toHaveBeenCalledWith('test');
      expect(res.json).toHaveBeenCalledWith({ suggestions: mockSuggestions });
    });

    it('should handle errors', async () => {
      const req = { query: { term: 'test' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      fetchItemSuggestions.mockRejectedValue(new Error('Database error'));

      await getSuggestions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});