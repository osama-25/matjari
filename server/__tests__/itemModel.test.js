import { addItem, fetchItemById, deleteItemById, updateItem, fetchItemsByUserId } from '../models/itemModel';
import db from '../config/db';
import axios from 'axios';

jest.mock('../config/db');
jest.mock('axios');

describe('Item Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addItem', () => {
    it('should add a new item with photos and details', async () => {
      const mockItemData = {
        category: 'Electronics',
        subCategory: 'Mobile',
        title: 'iPhone 12',
        description: 'Brand new iPhone',
        condition: 'New',
        delivery: 'Yes',
        price: 999,
        location: 'NY',
        photos: ['photo1.jpg'],
        customDetails: { color: 'Black' },
        userID: 1
      };

      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rowCount: 1 }); 

      axios.post.mockResolvedValueOnce({
        data: {
          data: {
            tags: [{ name: 'phone' }]
          }
        }
      });

      const result = await addItem(mockItemData);

      expect(result).toBe(1);
      expect(db.query).toHaveBeenCalledTimes(3);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchItemById', () => {
    it('should fetch item with photos and details', async () => {
      const mockItem = {
        id: 1,
        title: 'iPhone 12',
        user_id: 1
      };

      db.query
        .mockResolvedValueOnce({ rows: [mockItem] }) // item
        .mockResolvedValueOnce({ rows: [{ photo_url: 'photo1.jpg' }] }) // photos
        .mockResolvedValueOnce({ rows: [{ detail_key: 'color', detail_value: 'Black' }] }) // details
        .mockResolvedValueOnce({ rows: [{ user_name: 'John', phone_number: '123', email: 'john@test.com' }] }); // user

      const result = await fetchItemById(1);

      expect(result).toMatchObject({
        ...mockItem,
        photos: ['photo1.jpg'],
        customDetails: [{ title: 'color', description: 'Black' }]
      });
      expect(db.query).toHaveBeenCalledTimes(4);
    });

    it('should throw error if item not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(fetchItemById(999)).rejects.toThrow('Item not found');
    });
  });

  describe('deleteItemById', () => {
    it('should delete item and related data', async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 1 }) // listing delete
        .mockResolvedValueOnce({ rowCount: 1 }) // photos delete
        .mockResolvedValueOnce({ rowCount: 1 }); // details delete

      await deleteItemById(1);

      expect(db.query).toHaveBeenCalledTimes(3);
    });

    it('should throw error if item not found', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });

      await expect(deleteItemById(999)).rejects.toThrow('Listing not found');
    });
  });

  describe('updateItem', () => {
    it('should update item with new photos and details', async () => {
      const mockItemData = {
        category: 'Electronics',
        sub_category: 'Mobile',
        title: 'iPhone 12',
        description: 'Updated iPhone',
        condition: 'New',
        delivery: 'Yes',
        price: 899,
        location: 'NY',
        photos: ['newphoto1.jpg'],
        customDetails: { color: 'Red' }
      };

      db.query
        .mockResolvedValueOnce({ rowCount: 1 }) // update listing
        .mockResolvedValueOnce({ rowCount: 1 }) // delete old photos
        .mockResolvedValueOnce({ rows: [] }) // check existing photo
        .mockResolvedValueOnce({ rowCount: 1 }) // insert new photo
        .mockResolvedValueOnce({ rowCount: 1 }) // delete old details
        .mockResolvedValueOnce({ rowCount: 1 }); // insert new details

      axios.post.mockResolvedValueOnce({
        data: {
          data: {
            tags: [{ name: 'phone' }]
          }
        }
      });

      await updateItem(1, mockItemData);

      expect(db.query).toHaveBeenCalledTimes(6);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('should throw error if item not found', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });

      await expect(updateItem(999, {})).rejects.toThrow('Listing not found');
    });
  });

  describe('fetchItemsByUserId', () => {
    it('should fetch all items for user with first photo', async () => {
      const mockItems = [
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' }
      ];

      db.query
        .mockResolvedValueOnce({ rows: mockItems }) // items
        .mockResolvedValueOnce({ rows: [{ photo_url: 'photo1.jpg' }] }) // photo for item 1
        .mockResolvedValueOnce({ rows: [{ photo_url: 'photo2.jpg' }] }); // photo for item 2

      const result = await fetchItemsByUserId(1);

      expect(result).toEqual([
        { id: 1, title: 'Item 1', image: 'photo1.jpg' },
        { id: 2, title: 'Item 2', image: 'photo2.jpg' }
      ]);
      expect(db.query).toHaveBeenCalledTimes(3);
    });
  });
});