import request from 'supertest';
import express from 'express';
import imageDescRoutes from '../routes/imageDesc';
import { describeImage, searchByImage } from '../controllers/imageDescController';

jest.mock('../controllers/imageDescController');

const app = express();
app.use(express.json());
app.use('/imageDesc', imageDescRoutes);

describe('ImageDesc Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /imageDesc/describe', () => {
    it('should describe an image', async () => {
      describeImage.mockImplementation((req, res) => res.status(200).json({ response: 'ok', data: { tags: ['tag1', 'tag2'] } }));

      const response = await request(app)
        .post('/imageDesc/describe')
        .send({ image: 'http://example.com/image.jpg' });

      expect(describeImage).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ response: 'ok', data: { tags: ['tag1', 'tag2'] } });
    });

    it('should handle errors', async () => {
      describeImage.mockImplementation((req, res) => res.status(500).json({ response: 'not ok', error: 'Azure API error' }));

      const response = await request(app)
        .post('/imageDesc/describe')
        .send({ image: 'http://example.com/image.jpg' });

      expect(describeImage).toHaveBeenCalled();
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ response: 'not ok', error: 'Azure API error' });
    });
  });

  describe('POST /imageDesc/search-by-image', () => {
    it('should search by image', async () => {
      searchByImage.mockImplementation((req, res) => res.status(200).json({ items: [{ id: 1, title: 'Item 1' }], page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }));

      const response = await request(app)
        .post('/imageDesc/search-by-image')
        .send({ image: 'http://example.com/image.jpg' });

      expect(searchByImage).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [{ id: 1, title: 'Item 1' }], page: 1, pageSize: 10, totalItems: 1, totalPages: 1 });
    });

    it('should handle errors', async () => {
      searchByImage.mockImplementation((req, res) => res.status(500).json({ message: 'Error searching by image' }));

      const response = await request(app)
        .post('/imageDesc/search-by-image')
        .send({ image: 'http://example.com/image.jpg' });

      expect(searchByImage).toHaveBeenCalled();
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Error searching by image' });
    });
  });
});