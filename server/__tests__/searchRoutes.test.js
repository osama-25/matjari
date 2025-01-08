import request from 'supertest';
import express from 'express';
import searchRoutes from '../routes/search';
import { searchItems, filterItems, getSuggestions } from '../controllers/searchController';

jest.mock('../controllers/searchController');

const app = express();
app.use(express.json());
app.use('/search', searchRoutes);

describe('Search Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /search', () => {
    it('should fetch search items with pagination', async () => {
      searchItems.mockImplementation((req, res) => res.status(200).json({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 }));

      const response = await request(app).get('/search').query({ term: 'test', page: '1', pageSize: '10' });

      expect(searchItems).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
    });
  });

  describe('POST /search/filter/:page/:pageSize', () => {
    it('should filter search items with pagination', async () => {
      filterItems.mockImplementation((req, res) => res.status(200).json({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 }));

      const response = await request(app)
        .post('/search/filter/1/10')
        .send({ searchTerm: 'test', minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new', order: 'lowtohigh' });

      expect(filterItems).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
    });
  });

  describe('GET /search/suggestions', () => {
    it('should fetch search suggestions', async () => {
      getSuggestions.mockImplementation((req, res) => res.status(200).json({ suggestions: ['Item 1'] }));

      const response = await request(app).get('/search/suggestions').query({ term: 'test' });

      expect(getSuggestions).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ suggestions: ['Item 1'] });
    });
  });
});