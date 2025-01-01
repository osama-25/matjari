const { handleFavorite, getFavorites, getFavoriteListingIds, checkIfFavorited } = require('../controllers/favoritesController');
const { checkFavorite, addFavorite, removeFavorite, getFavoritesByUserId, getFavoriteListingIdsByUserId, isListingFavorited } = require('../models/favoritesModel');

jest.mock('../models/favoritesModel');

describe('Favorites Controller', () => {
  const mockReq = (body = {}, params = {}) => ({
    body,
    params
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

  describe('handleFavorite', () => {
    it('should add a favorite if not already favorited', async () => {
      const req = mockReq({ userId: 1, listingId: 1 });
      const res = mockRes();
      checkFavorite.mockResolvedValue(false);

      await handleFavorite(req, res);

      expect(checkFavorite).toHaveBeenCalledWith(1, 1);
      expect(addFavorite).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Listing favorited successfully' });
    });

    it('should remove a favorite if already favorited', async () => {
      const req = mockReq({ userId: 1, listingId: 1 });
      const res = mockRes();
      checkFavorite.mockResolvedValue(true);

      await handleFavorite(req, res);

      expect(checkFavorite).toHaveBeenCalledWith(1, 1);
      expect(removeFavorite).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Listing unfavorited successfully' });
    });

    it('should handle errors', async () => {
      const req = mockReq({ userId: 1, listingId: 1 });
      const res = mockRes();
      checkFavorite.mockRejectedValue(new Error('Error handling favorite action'));

      await handleFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error handling favorite action' });
    });
  });

  describe('getFavorites', () => {
    it('should return favorites by user ID', async () => {
      const req = mockReq({}, { userId: 1 });
      const res = mockRes();
      const mockFavorites = [{ id: 1, title: 'Item 1' }];
      getFavoritesByUserId.mockResolvedValue(mockFavorites);

      await getFavorites(req, res);

      expect(getFavoritesByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ favorites: mockFavorites });
    });

    it('should handle errors', async () => {
      const req = mockReq({}, { userId: 1 });
      const res = mockRes();
      getFavoritesByUserId.mockRejectedValue(new Error('Error retrieving favorites'));

      await getFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving favorites' });
    });
  });

  describe('getFavoriteListingIds', () => {
    it('should return favorite listing IDs by user ID', async () => {
      const req = mockReq({}, { userId: 1 });
      const res = mockRes();
      const mockIds = [1];
      getFavoriteListingIdsByUserId.mockResolvedValue(mockIds);

      await getFavoriteListingIds(req, res);

      expect(getFavoriteListingIdsByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ favorites: mockIds });
    });

    it('should handle errors', async () => {
      const req = mockReq({}, { userId: 1 });
      const res = mockRes();
      getFavoriteListingIdsByUserId.mockRejectedValue(new Error('Error retrieving favorites'));

      await getFavoriteListingIds(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving favorites' });
    });
  });

  describe('checkIfFavorited', () => {
    it('should return true if listing is favorited', async () => {
      const req = mockReq({}, { listingId: 1, userId: 1 });
      const res = mockRes();
      isListingFavorited.mockResolvedValue(true);

      await checkIfFavorited(req, res);

      expect(isListingFavorited).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ favorited: true });
    });

    it('should return false if listing is not favorited', async () => {
      const req = mockReq({}, { listingId: 1, userId: 1 });
      const res = mockRes();
      isListingFavorited.mockResolvedValue(false);

      await checkIfFavorited(req, res);

      expect(isListingFavorited).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ favorited: false });
    });

    it('should handle errors', async () => {
      const req = mockReq({}, { listingId: 1, userId: 1 });
      const res = mockRes();
      isListingFavorited.mockRejectedValue(new Error('Error retrieving favorites'));

      await checkIfFavorited(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving favorites' });
    });
  });
});