const { describeImage, searchByImage } = require('../controllers/imageDescController');
const axios = require('axios');
const { getTotalItems, getPaginatedResults } = require('../models/imageDescModel');

jest.mock('axios');
jest.mock('../models/imageDescModel');

describe('ImageDesc Controller', () => {
  const mockReq = () => ({
    body: { image: 'http://example.com/image.jpg' },
    query: { page: '1', pageSize: '10' }
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('describeImage', () => {
    it('should return image description', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockAzureResponse = {
        data: {
          tags: [{ name: 'tag1' }, { name: 'tag2' }]
        }
      };

      axios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockAzureResponse)
      });

      await describeImage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        response: 'ok',
        data: mockAzureResponse.data
      });
    });

    it('should return 400 if image URL is not provided', async () => {
      const req = { body: {} };
      const res = mockRes();

      await describeImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Image URL is required' });
    });

    it('should return 500 if there is an error', async () => {
      const req = mockReq();
      const res = mockRes();

      axios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('Azure API error'))
      });

      await describeImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        response: 'not ok',
        error: 'Azure API error'
      });
    });
  });

  describe('searchByImage', () => {
    it('should return search results', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockItems = [{ id: 1, title: 'Item 1' }];

      axios.post.mockResolvedValue({
        data: {
          data: {
            tags: [{ name: 'tag1' }, { name: 'tag2' }]
          }
        }
      });

      getTotalItems.mockResolvedValue(5);
      getPaginatedResults.mockResolvedValue(mockItems);

      await searchByImage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        items: mockItems,
        page: 1,
        pageSize: 10,
        totalItems: 5,
        totalPages: 1
      });
    });

    it('should return 404 if no tags are found', async () => {
      const req = mockReq();
      const res = mockRes();

      axios.post.mockResolvedValue({
        data: {
          data: {
            tags: []
          }
        }
      });

      await searchByImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No tags found for the image' });
    });

    it('should return 500 if there is an error', async () => {
      const req = mockReq();
      const res = mockRes();

      axios.post.mockRejectedValue(new Error('Error searching by image'));

      await searchByImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error searching by image' });
    });
  });
});