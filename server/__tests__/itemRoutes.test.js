import request from 'supertest';
import express from 'express';
import itemRoutes from '../routes/item';
import { createItem, getAllItems, getItemById, deleteItem, updateItemById, getItemsByUserId } from '../controllers/itemController';

jest.mock('../controllers/itemController');

const app = express();
app.use(express.json());
app.use('/items', itemRoutes);

describe('Item Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      createItem.mockImplementation((req, res) => res.status(201).json({ message: 'Listing created successfully', itemId: 1 }));

      const response = await request(app)
        .post('/items')
        .send({ title: 'New Item' });

      expect(createItem).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Listing created successfully', itemId: 1 });
    });
  });

  describe('GET /items/fetch-all-items', () => {
    it('should fetch all items', async () => {
      const mockItems = [{ id: 1, title: 'Item 1' }];
      getAllItems.mockImplementation((req, res) => res.status(200).json(mockItems));

      const response = await request(app).get('/items/fetch-all-items');

      expect(getAllItems).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItems);
    });
  });

  describe('GET /items/:id', () => {
    it('should fetch item by ID', async () => {
      const mockItem = { id: 1, title: 'Item 1' };
      getItemById.mockImplementation((req, res) => res.status(200).json(mockItem));

      const response = await request(app).get('/items/1');

      expect(getItemById).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItem);
    });
  });

  describe('DELETE /items/delete/:id', () => {
    it('should delete item by ID', async () => {
      deleteItem.mockImplementation((req, res) => res.status(200).json({ message: 'Listing deleted successfully' }));

      const response = await request(app).delete('/items/delete/1');

      expect(deleteItem).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Listing deleted successfully' });
    });
  });

  describe('POST /items/update/:listingId', () => {
    it('should update item by ID', async () => {
      updateItemById.mockImplementation((req, res) => res.status(201).json({ message: 'Listing updated successfully' }));

      const response = await request(app)
        .post('/items/update/1')
        .send({ title: 'Updated Item' });

      expect(updateItemById).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Listing updated successfully' });
    });
  });

  describe('GET /items/store/:userId', () => {
    it('should fetch items by user ID', async () => {
      const mockItems = [{ id: 1, title: 'Item 1' }];
      getItemsByUserId.mockImplementation((req, res) => res.status(200).json({ listings: mockItems }));

      const response = await request(app).get('/items/store/1');

      expect(getItemsByUserId).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ listings: mockItems });
    });
  });
});