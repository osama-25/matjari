import { filterItemsByCategory, getSubcategories, getItemsByCategoryWithPagination, getAllCategoriesHandler } from '../controllers/categoriesController';
import { getCategoryIdByName, getTotalItemsByCategory, getItemsByCategory, getSubcategoriesByName, getAllCategories } from '../models/categoriesModel';

jest.mock('../models/categoriesModel');

describe('Categories Controller', () => {
  const mockReq = (params = {}, body = {}, query = {}) => ({
    params,
    body,
    query
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('filterItemsByCategory', () => {
    it('should filter items by category', async () => {
      const req = mockReq({ category: 'Electronics' }, { order: 'lowtohigh' }, { page: '1', pageSize: '10' });
      const res = mockRes();
      getCategoryIdByName.mockResolvedValue(1);
      getTotalItemsByCategory.mockResolvedValue(10);
      getItemsByCategory.mockResolvedValue([{ id: 1, title: 'Item 1' }]);

      await filterItemsByCategory(req, res);

      expect(getCategoryIdByName).toHaveBeenCalledWith('Electronics');
      expect(getTotalItemsByCategory).toHaveBeenCalledWith('Electronics');
      expect(getItemsByCategory).toHaveBeenCalledWith('Electronics', 10, 0, 'lowtohigh');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        items: [{ id: 1, title: 'Item 1' }],
        page: 1,
        pageSize: 10,
        totalItems: 10,
        totalPages: 1
      });
    });

    it('should return 404 if category not found', async () => {
      const req = mockReq({ category: 'NonExistentCategory' }, {}, {});
      const res = mockRes();
      getCategoryIdByName.mockResolvedValue(null);

      await filterItemsByCategory(req, res);

      expect(getCategoryIdByName).toHaveBeenCalledWith('NonExistentCategory');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    it('should handle errors', async () => {
      const req = mockReq({ category: 'Electronics' }, {}, {});
      const res = mockRes();
      getCategoryIdByName.mockRejectedValue(new Error('Error fetching category'));

      await filterItemsByCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getSubcategories', () => {
    it('should return subcategories for a given category name', async () => {
      const req = mockReq({ name: 'Electronics' });
      const res = mockRes();
      const mockSubcategories = [{ id: 1, name: 'Mobile Phones' }];
      getSubcategoriesByName.mockResolvedValue(mockSubcategories);

      await getSubcategories(req, res);

      expect(getSubcategoriesByName).toHaveBeenCalledWith('Electronics');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSubcategories);
    });

    it('should return 404 if no subcategories found', async () => {
      const req = mockReq({ name: 'NonExistentCategory' });
      const res = mockRes();
      getSubcategoriesByName.mockResolvedValue([]);

      await getSubcategories(req, res);

      expect(getSubcategoriesByName).toHaveBeenCalledWith('NonExistentCategory');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    it('should handle errors', async () => {
      const req = mockReq({ name: 'Electronics' });
      const res = mockRes();
      getSubcategoriesByName.mockRejectedValue(new Error('Error fetching subcategories'));

      await getSubcategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving subcategories', message: 'Error fetching subcategories' });
    });
  });

  describe('getItemsByCategoryWithPagination', () => {
    it('should return items by category with pagination', async () => {
      const req = mockReq({ category: 'Electronics', page: '1', pageSize: '10' });
      const res = mockRes();
      getCategoryIdByName.mockResolvedValue(1);
      getTotalItemsByCategory.mockResolvedValue(10);
      getItemsByCategory.mockResolvedValue([{ id: 1, title: 'Item 1' }]);

      await getItemsByCategoryWithPagination(req, res);

      expect(getCategoryIdByName).toHaveBeenCalledWith('Electronics');
      expect(getTotalItemsByCategory).toHaveBeenCalledWith('Electronics');
      expect(getItemsByCategory).toHaveBeenCalledWith('Electronics', 10, 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        items: [{ id: 1, title: 'Item 1' }],
        page: 1,
        pageSize: 10,
        totalItems: 10,
        totalPages: 1
      });
    });

    it('should return 404 if category not found', async () => {
      const req = mockReq({ category: 'NonExistentCategory', page: '1', pageSize: '10' });
      const res = mockRes();
      getCategoryIdByName.mockResolvedValue(null);

      await getItemsByCategoryWithPagination(req, res);

      expect(getCategoryIdByName).toHaveBeenCalledWith('NonExistentCategory');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const req = mockReq({ category: 'Electronics', page: 'invalid', pageSize: '10' });
      const res = mockRes();

      await getItemsByCategoryWithPagination(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid pagination parameters' });
    });

    it('should handle errors', async () => {
      const req = mockReq({ category: 'Electronics', page: '1', pageSize: '10' });
      const res = mockRes();
      getCategoryIdByName.mockRejectedValue(new Error('Error fetching category'));

      await getItemsByCategoryWithPagination(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getAllCategoriesHandler', () => {
    it('should return all top-level categories', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockCategories = [{ name: 'Electronics' }];
      getAllCategories.mockResolvedValue(mockCategories);

      await getAllCategoriesHandler(req, res);

      expect(getAllCategories).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors', async () => {
      const req = mockReq();
      const res = mockRes();
      getAllCategories.mockRejectedValue(new Error('Error fetching categories'));

      await getAllCategoriesHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});