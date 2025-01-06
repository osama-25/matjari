import request from 'supertest';
import express from 'express';
import favoritesRoutes from '../routes/favorites';
import { handleFavorite, getFavorites, getFavoriteListingIds, checkIfFavorited } from '../controllers/favoritesController';

jest.mock('../controllers/favoritesController');

const app = express();
app.use(express.json());
app.use('/favorites', favoritesRoutes);

describe('Favorites Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /favorites', () => {
    it('should handle favorite action', async () => {
      handleFavorite.mockImplementation((req, res) => res.status(200).json({ message: 'Listing favorited successfully' }));

      const response = await request(app)
        .post('/favorites')
        .send({ userId: 1, listingId: 1 });

      expect(handleFavorite).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Listing favorited successfully' });
    });
  });

  describe('GET /favorites/:userId', () => {
    it('should get favorites by user ID', async () => {
      const mockFavorites = [{ id: 1, title: 'Item 1' }];
      getFavorites.mockImplementation((req, res) => res.status(200).json({ favorites: mockFavorites }));

      const response = await request(app).get('/favorites/1');

      expect(getFavorites).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ favorites: mockFavorites });
    });
  });

  describe('GET /favorites/batch/:userId', () => {
    it('should get favorite listing IDs by user ID', async () => {
      const mockIds = [1];
      getFavoriteListingIds.mockImplementation((req, res) => res.status(200).json({ favorites: mockIds }));

      const response = await request(app).get('/favorites/batch/1');

      expect(getFavoriteListingIds).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ favorites: mockIds });
    });
  });

  describe('GET /favorites/:listingId/:userId', () => {
    it('should check if listing is favorited', async () => {
      checkIfFavorited.mockImplementation((req, res) => res.status(200).json({ favorited: true }));

      const response = await request(app).get('/favorites/1/1');

      expect(checkIfFavorited).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ favorited: true });
    });
  });
});