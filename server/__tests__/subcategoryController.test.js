import { filterItems, getItemsBySubcategory } from '../controllers/subcategoryController';
import { getCategoryIdByName, getTotalItemsCount, getItemsForSubcategory } from '../models/SubcategoryModel';

jest.mock('../models/SubcategoryModel');

describe('Subcategory Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('filterItems', () => {
    it('should filter items based on various criteria', async () => {
      const req = { params: { subcategory: 'subcategory', page: '1', pageSize: '10' }, body: { minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new', order: 'lowtohigh' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockItems = [{ id: 1, title: 'Item 1' }];
      getCategoryIdByName.mockResolvedValue(1);
      getTotalItemsCount.mockResolvedValue(5);
      getItemsForSubcategory.mockResolvedValue(mockItems);

      await filterItems(req, res);

      expect(getCategoryIdByName).toHaveBeenCalledWith('subcategory');
      expect(getTotalItemsCount).toHaveBeenCalledWith('subcategory', { minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new' });
      expect(getItemsForSubcategory).toHaveBeenCalledWith('subcategory', { minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new' }, '10', 0, 'lowtohigh');
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
      const req = { params: { subcategory: 'subcategory', page: '1', pageSize: '10' }, body: { minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new', order: 'lowtohigh' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      getCategoryIdByName.mockRejectedValue(new Error('Database error'));

      await filterItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getItemsBySubcategory', () => {
    it('should fetch items by subcategory without filters', async () => {
      const req = { params: { subcategory: 'subcategory', page: '1', pageSize: '10' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockItems = [{ id: 1, title: 'Item 1' }];
      getCategoryIdByName.mockResolvedValue(1);
      getTotalItemsCount.mockResolvedValue(5);
      getItemsForSubcategory.mockResolvedValue(mockItems);

      await getItemsBySubcategory(req, res);

      expect(getCategoryIdByName).toHaveBeenCalledWith('subcategory');
      expect(getTotalItemsCount).toHaveBeenCalledWith('subcategory');
      expect(getItemsForSubcategory).toHaveBeenCalledWith('subcategory', {}, 10, 0, '');
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
      const req = { params: { subcategory: 'subcategory', page: '1', pageSize: '10' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      getCategoryIdByName.mockRejectedValue(new Error('Database error'));

      await getItemsBySubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});