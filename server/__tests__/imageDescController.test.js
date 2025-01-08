import axios from 'axios';
import { describeImage, searchByImage, searchByImageFilter } from '../controllers/imageDescController';
import { getTotalItems, getPaginatedResults, getFilteredResults } from '../models/imageDescModel';

jest.mock('axios');
jest.mock('../models/imageDescModel');

describe('Image Description Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('describeImage', () => {
    it('should return image description', async () => {
      const req = { body: { image: 'http://example.com/image.jpg' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const mockResponse = { data: { description: 'Image description' } };
      axios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse)
      });

      await describeImage(req, res);

      expect(axios.create().post).toHaveBeenCalledWith('', { url: 'http://example.com/image.jpg' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ response: 'ok', data: mockResponse.data });
    });

    it('should handle errors', async () => {
      const req = { body: { image: 'http://example.com/image.jpg' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      axios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('Azure API error'))
      });

      await describeImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ response: 'not ok', error: 'Azure API error' });
    });
  });

  describe('searchByImage', () => {
    it('should return search results', async () => {
      const req = { 
        body: { image: 'http://example.com/image.jpg' }, 
        query: { page: '1', pageSize: '10' } 
      };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };
      
      const mockImageData = { 
        tags: [{ name: 'tag1' }, { name: 'tag2' }] 
      };
      const mockItems = [{ id: 1, title: 'Item 1' }];
      
      axios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockImageData })
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
      const req = { 
        body: { image: 'http://example.com/image.jpg' }, 
        query: { page: '1', pageSize: '10' } 
      };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };
      
      const mockImageData = { tags: [] };
      axios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockImageData })
      });

      await searchByImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'No tags found for the image' 
      });
    });

    it('should handle errors', async () => {
      const req = { body: { image: 'http://example.com/image.jpg' }, query: { page: '1', pageSize: '10' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      axios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('Azure API error'))
      });

      await searchByImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error searching by image' });
    });
  });

  describe('searchByImageFilter', () => {
    it('should return filtered search results for image', async () => {
      const req = {
        body: { image: 'http://example.com/image.jpg', minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new', order: 'lowtohigh' },
        params: { page: '1', pageSize: '10' }
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockImageData = { tags: [{ name: 'tag1' }, { name: 'tag2' }] };
      const mockTotalItems = 5;
      const mockPaginatedResults = [{ id: 1, title: 'Item 1' }];
      axios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockImageData })
      });
      getFilteredResults.mockResolvedValue({
        items: mockPaginatedResults,
        totalItems: mockTotalItems,
        totalPages: 1
      });

      await searchByImageFilter(req, res);

      expect(axios.create().post).toHaveBeenCalledWith('', { url: 'http://example.com/image.jpg' });
      expect(getFilteredResults).toHaveBeenCalledWith(['tag1', 'tag2'], {
        minPrice: 10,
        maxPrice: 100,
        location: 'NY',
        delivery: 'yes',
        condition: 'new'
      }, 10, 0, 'lowtohigh');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        items: mockPaginatedResults,
        parsedPage: 1,
        parsedPageSize: 10,
        totalItems: mockTotalItems,
        totalPages: 1
      });
    });

    it('should handle errors', async () => {
      const req = {
        body: { image: 'http://example.com/image.jpg', minPrice: 10, maxPrice: 100, location: 'NY', delivery: 'yes', condition: 'new', order: 'lowtohigh' },
        params: { page: '1', pageSize: '10' }
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      axios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(new Error('Azure API error'))
      });

      await searchByImageFilter(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error searching by image with filter' });
    });
  });
});