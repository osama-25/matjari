import request from 'supertest';
import express from 'express';
import categoriesRoutes from '../routes/categories';
import { filterItemsByCategory, getSubcategories, getItemsByCategoryWithPagination, getAllCategoriesHandler } from '../controllers/categoriesController';

jest.mock('../controllers/categoriesController');

const app = express();
app.use(express.json());
app.use('/categories', categoriesRoutes);

describe('Categories Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /categories/filter/:category', () => {
    it('should filter items by category', async () => {
      filterItemsByCategory.mockImplementation((req, res) => res.status(200).json({ items: [{ id: 1, title: 'Item 1' }], page: 1, pageSize: 10, totalItems: 10, totalPages: 1 }));

      const response = await request(app)
        .post('/categories/filter/Electronics')
        .send({ order: 'lowtohigh' });

      expect(filterItemsByCategory).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [{ id: 1, title: 'Item 1' }], page: 1, pageSize: 10, totalItems: 10, totalPages: 1 });
    });
  });

  describe('GET /categories/:name', () => {
    it('should get subcategories by name', async () => {
      const mockSubcategories = [{ id: 1, name: 'Mobile Phones' }];
      getSubcategories.mockImplementation((req, res) => res.status(200).json(mockSubcategories));

      const response = await request(app).get('/categories/Electronics');

      expect(getSubcategories).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSubcategories);
    });
  });

  describe('GET /categories/:category/:page/:pageSize', () => {
    it('should get items by category with pagination', async () => {
      getItemsByCategoryWithPagination.mockImplementation((req, res) => res.status(200).json({ items: [{ id: 1, title: 'Item 1' }], page: 1, pageSize: 10, totalItems: 10, totalPages: 1 }));

      const response = await request(app).get('/categories/Electronics/1/10');

      expect(getItemsByCategoryWithPagination).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [{ id: 1, title: 'Item 1' }], page: 1, pageSize: 10, totalItems: 10, totalPages: 1 });
    });
  });

  describe('GET /categories', () => {
    it('should get all top-level categories', async () => {
      const mockCategories = [{ name: 'Electronics' }];
      getAllCategoriesHandler.mockImplementation((req, res) => res.status(200).json(mockCategories));

      const response = await request(app).get('/categories');

      expect(getAllCategoriesHandler).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
    });
  });
});