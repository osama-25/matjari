import request from 'supertest';
import express from 'express';
import imageDescRoutes from '../routes/imageDesc';
import { describeImage, searchByImage, searchByImageFilter } from '../controllers/imageDescController';

jest.mock('../controllers/imageDescController');

const app = express();
app.use(express.json());
app.use('/image-desc', imageDescRoutes);

describe('Image Description Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /image-desc/describe', () => {
    it('should describe an image', async () => {
      describeImage.mockImplementation((req, res) => res.status(200).send({ response: 'ok', data: 'Image description' }));

      const response = await request(app)
        .post('/image-desc/describe')
        .send({ image: 'http://example.com/image.jpg' });

      expect(describeImage).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ response: 'ok', data: 'Image description' });
    });
  });

  describe('POST /image-desc/search-by-image', () => {
    it('should search by image', async () => {
      searchByImage.mockImplementation((req, res) => res.status(200).json({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 }));

      const response = await request(app)
        .post('/image-desc/search-by-image')
        .send({ image: 'http://example.com/image.jpg' });

      expect(searchByImage).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
    });
  });

  describe('POST /image-desc/search-by-image/filter/:page/:pageSize', () => {
    it('should search by image with filter', async () => {
      searchByImageFilter.mockImplementation((req, res) => res.status(200).json({ items: [], parsedPage: 1, parsedPageSize: 10, totalItems: 0, totalPages: 0 }));

      const response = await request(app)
        .post('/image-desc/search-by-image/filter/1/10')
        .send({ image: 'http://example.com/image.jpg', minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new', order: 'lowtohigh' });

      expect(searchByImageFilter).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], parsedPage: 1, parsedPageSize: 10, totalItems: 0, totalPages: 0 });
    });
  });
});