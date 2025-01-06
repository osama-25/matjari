import { checkFavorite, addFavorite, removeFavorite, getFavoritesByUserId, getFavoriteListingIdsByUserId, isListingFavorited } from '../models/favoritesModel';
import db from '../config/db';

jest.mock('../config/db');

describe('Favorites Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkFavorite', () => {
    it('should return true if favorite exists', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });
      const result = await checkFavorite(1, 1);
      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2', [1, 1]);
    });

    it('should return false if favorite does not exist', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const result = await checkFavorite(1, 1);
      expect(result).toBe(false);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM favorites WHERE user_id = $1 AND listing_id = $2', [1, 1]);
    });
  });

  describe('addFavorite', () => {
    it('should add a favorite', async () => {
      await addFavorite(1, 1);
      expect(db.query).toHaveBeenCalledWith('INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2)', [1, 1]);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite', async () => {
      await removeFavorite(1, 1);
      expect(db.query).toHaveBeenCalledWith('DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2', [1, 1]);
    });
  });

  describe('getFavoritesByUserId', () => {
    it('should return favorites by user ID', async () => {
      const mockFavorites = [{ id: 1, title: 'Item 1' }];
      db.query.mockResolvedValue({ rows: mockFavorites });
      const result = await getFavoritesByUserId(1);
      expect(result).toEqual(mockFavorites);
      expect(db.query).toHaveBeenCalledWith(
        `SELECT DISTINCT ON (l.id) l.id, l.title, l.price, l.location, lp.photo_url
         FROM favorites f
         JOIN listings l ON f.listing_id = l.id
         LEFT JOIN listing_photos lp ON l.id = lp.listing_id
         WHERE f.user_id = $1
         ORDER BY l.id`,
        [1]
      );
    });
  });

  describe('getFavoriteListingIdsByUserId', () => {
    it('should return favorite listing IDs by user ID', async () => {
      const mockIds = [{ listing_id: 1 }];
      db.query.mockResolvedValue({ rows: mockIds });
      const result = await getFavoriteListingIdsByUserId(1);
      expect(result).toEqual([1]);
      expect(db.query).toHaveBeenCalledWith('SELECT listing_id FROM favorites WHERE user_id = $1', [1]);
    });
  });

  describe('isListingFavorited', () => {
    it('should return true if listing is favorited', async () => {
      db.query.mockResolvedValue({ rowCount: 1 });
      const result = await isListingFavorited(1, 1);
      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledWith(`SELECT * FROM favorites
         WHERE user_id = $1 AND listing_id = $2`, [1, 1]);
    });

    it('should return false if listing is not favorited', async () => {
      db.query.mockResolvedValue({ rowCount: 0 });
      const result = await isListingFavorited(1, 1);
      expect(result).toBe(false);
      expect(db.query).toHaveBeenCalledWith(`SELECT * FROM favorites
         WHERE user_id = $1 AND listing_id = $2`, [1, 1]);
    });
  });
});