import { getCategoryIdByName, getTotalItemsCount, getItemsForSubcategory } from '../models/SubcategoryModel';
import db from '../config/db';

jest.mock('../config/db');

describe('Subcategory Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategoryIdByName', () => {
    it('should return category ID for a given subcategory name', async () => {
      const mockResult = { rows: [{ id: 1 }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getCategoryIdByName('subcategory');

      expect(db.query).toHaveBeenCalledWith("SELECT id FROM categories WHERE name = $1", ['subcategory']);
      expect(result).toBe(1);
    });

    it('should return null if subcategory is not found', async () => {
      db.query.mockResolvedValue({ rowCount: 0 });

      const result = await getCategoryIdByName('nonexistent');

      expect(db.query).toHaveBeenCalledWith("SELECT id FROM categories WHERE name = $1", ['nonexistent']);
      expect(result).toBeNull();
    });
  });

  describe('getTotalItemsCount', () => {
    it('should return the total item count for a subcategory with filters', async () => {
      const mockResult = { rows: [{ total: '5' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getTotalItemsCount('subcategory', { minPrice: 10, maxPrice: 100 });

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['subcategory', 10, 100]);
      expect(result).toBe('5');
    });
  });

  describe('getItemsForSubcategory', () => {
    it('should return paginated items for a subcategory with filters and ordering', async () => {
      const mockResult = { rows: [{ id: 1, title: 'Item 1' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getItemsForSubcategory('subcategory', { minPrice: 10, maxPrice: 100 }, 10, 0, 'lowtohigh');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['subcategory', 10, 100, 10, 0]);
      expect(result).toEqual(mockResult.rows);
    });
  });
});