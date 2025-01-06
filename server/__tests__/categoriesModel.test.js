import { getCategoryIdByName, getTotalItemsByCategory, getItemsByCategory, getSubcategoriesByName, getAllCategories } from '../models/categoriesModel';
import db from '../config/db';

jest.mock('../config/db');

describe('Categories Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategoryIdByName', () => {
    it('should return category ID if category exists', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });
      const result = await getCategoryIdByName('Electronics');
      expect(result).toBe(1);
      expect(db.query).toHaveBeenCalledWith('SELECT id FROM categories WHERE name = $1', ['Electronics']);
    });

    it('should return null if category does not exist', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await getCategoryIdByName('NonExistentCategory');
      expect(result).toBeNull();
      expect(db.query).toHaveBeenCalledWith('SELECT id FROM categories WHERE name = $1', ['NonExistentCategory']);
    });
  });

  describe('getTotalItemsByCategory', () => {
    it('should return total items count for a category', async () => {
      db.query.mockResolvedValue({ rows: [{ total: '10' }] });
      const result = await getTotalItemsByCategory('Electronics');
      expect(result).toBe(10);
      expect(db.query).toHaveBeenCalledWith('SELECT COUNT(*) AS total FROM listings WHERE category = $1', ['Electronics']);
    });
  });

  describe('getItemsByCategory', () => {
    it('should return items for a category with pagination and order', async () => {
      const mockItems = [{ id: 1, title: 'Item 1' }];
      db.query.mockResolvedValue({ rows: mockItems });
      const result = await getItemsByCategory('Electronics', 10, 0, 'lowtohigh');
      expect(result).toEqual(mockItems);

      let filterQuery = `
        SELECT l.*, 
               (SELECT photo_url 
                FROM listing_photos lp 
                WHERE lp.listing_id = l.id  
                LIMIT 1) as image
        FROM listings l 
        WHERE l.category = $1 ORDER BY price ASC LIMIT $2 OFFSET $3`;
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining(filterQuery), ['Electronics', 10, 0]);
    });
  });

  describe('getSubcategoriesByName', () => {
    it('should return subcategories for a given category name', async () => {
      const mockSubcategories = [{ id: 1, name: 'Mobile Phones' }];
      db.query.mockResolvedValue({ rows: mockSubcategories });
      const result = await getSubcategoriesByName('Electronics');
      expect(result).toEqual(mockSubcategories);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM categories WHERE parent_cat = $1', ['Electronics']);
    });
  });

  describe('getAllCategories', () => {
    it('should return all top-level categories', async () => {
      const mockCategories = [{ name: 'Electronics' }];
      db.query.mockResolvedValue({ rows: mockCategories });
      const result = await getAllCategories();
      expect(result).toEqual(mockCategories);
      expect(db.query).toHaveBeenCalledWith('SELECT name FROM categories WHERE parent_cat is NULL');
    });
  });
});