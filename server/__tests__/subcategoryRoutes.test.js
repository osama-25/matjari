import request from 'supertest';
import express from 'express';
import subcategoryRoutes from '../routes/subcategory';
import { filterItems, getItemsBySubcategory } from '../controllers/subcategoryController';

jest.mock('../controllers/subcategoryController');

const app = express();
app.use(express.json());
app.use('/subcategory', subcategoryRoutes);

describe('Subcategory Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /subcategory/filter/:subcategory/:page/:pageSize', () => {
    it('should filter search items with pagination', async () => {
      filterItems.mockImplementation((req, res) => res.status(200).json({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 }));

      const response = await request(app)
        .post('/subcategory/filter/subcategory/1/10')
        .send({ minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new', order: 'lowtohigh' });

      expect(filterItems).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
    });
  });

  describe('GET /subcategory/:subcategory/:page/:pageSize', () => {
    it('should fetch items by subcategory with pagination', async () => {
      getItemsBySubcategory.mockImplementation((req, res) => res.status(200).json({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 }));

      const response = await request(app).get('/subcategory/subcategory/1/10');

      expect(getItemsBySubcategory).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
    });
  });
});