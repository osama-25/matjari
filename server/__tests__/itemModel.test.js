import { addItem, fetchAllItems, fetchItemById, deleteItemById, updateItem, fetchItemsByUserId } from '../models/itemModel';
import db from '../config/db';
import axios from 'axios';

jest.mock('../config/db');
jest.mock('axios');

describe('Item Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addItem', () => {
    it('should add a new item and return its ID', async () => {
      const mockItemData = {
        category: 'Electronics',
        subCategory: 'Mobile',
        title: 'iPhone 12',
        description: 'Brand new iPhone 12',
        condition: 'New',
        delivery: 'Yes',
        price: 999,
        location: 'New York',
        photos: ['http://example.com/photo1.jpg'],
        customDetails: { color: 'Black' },
        userID: 1
      };

      const mockListingResult = { rows: [{ id: 1 }] };
      db.query.mockResolvedValueOnce(mockListingResult);

      const mockAzureResponse = {
        data: {
          data: {
            tags: [{ name: 'tag1' }, { name: 'tag2' }]
          }
        }
      };
      axios.post.mockResolvedValue(mockAzureResponse);

      const result = await addItem(mockItemData);

      expect(result).toBe(1);
      expect(db.query).toHaveBeenCalledTimes(3); // One for listing, one for photo, one for custom details
    });
  });

  describe('fetchAllItems', () => {
    it('should fetch all items', async () => {
      const mockItems = [{ id: 1, title: 'Item 1' }, { id: 2, title: 'Item 2' }];
      db.query.mockResolvedValue({ rows: mockItems });

      const result = await fetchAllItems();

      expect(result).toEqual(mockItems);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM listings');
    });
  });

  describe('fetchItemById', () => {
    it('should fetch item by ID', async () => {
      const mockItem = { id: 1, title: 'Item 1', user_id: 1 };
      const mockPhotos = [{ photo_url: 'http://example.com/photo1.jpg' }];
      const mockDetails = [{ detail_key: 'color', detail_value: 'Black' }];
      const mockUser = { user_name: 'John Doe', phone_number: '1234567890', email: 'john@example.com' };

      db.query
        .mockResolvedValueOnce({ rows: [mockItem] })
        .mockResolvedValueOnce({ rows: mockPhotos })
        .mockResolvedValueOnce({ rows: mockDetails })
        .mockResolvedValueOnce({ rows: [mockUser] });

      const result = await fetchItemById(1);

      expect(result).toEqual({
        ...mockItem,
        photos: mockPhotos.map(photo => photo.photo_url),
        customDetails: [{ title: 'color', description: 'Black' }],
        username: mockUser.user_name,
        phone_number: mockUser.phone_number,
        email: mockUser.email
      });
      expect(db.query).toHaveBeenCalledTimes(4);
    });

    it('should throw an error if item not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(fetchItemById(1)).rejects.toThrow('Item not found');
    });
  });

  describe('deleteItemById', () => {
    it('should delete item by ID', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 1 });

      await deleteItemById(1);

      expect(db.query).toHaveBeenCalledTimes(3); // One for listing, one for photos, one for details
    });

    it('should throw an error if listing not found', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });

      await expect(deleteItemById(1)).rejects.toThrow('Listing not found');
    });
  });

  describe('updateItem', () => {
    it('should update item by ID', async () => {
      const mockItemData = {
        category: 'Electronics',
        sub_category: 'Mobile',
        title: 'iPhone 12',
        description: 'Brand new iPhone 12',
        condition: 'New',
        delivery: 'Yes',
        price: 999,
        location: 'New York',
        photos: ['http://example.com/photo1.jpg'],
        customDetails: { color: 'Black' }
      };

      db.query.mockResolvedValueOnce({ rowCount: 1 });

      const mockAzureResponse = {
        data: {
          data: {
            tags: [{ name: 'tag1' }, { name: 'tag2' }]
          }
        }
      };
      axios.post.mockResolvedValue(mockAzureResponse);

      await updateItem(1, mockItemData);

      expect(db.query).toHaveBeenCalledTimes(5); // One for listing, one for deleting photos, one for inserting photo, one for deleting details, one for inserting details
    });

    it('should throw an error if listing not found', async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 });

      await expect(updateItem(1, {})).rejects.toThrow('Listing not found');
    });
  });

  describe('fetchItemsByUserId', () => {
    it('should fetch items by user ID', async () => {
      const mockListings = [{ id: 1, title: 'Item 1' }];
      const mockPhotos = [{ photo_url: 'http://example.com/photo1.jpg' }];

      db.query
        .mockResolvedValueOnce({ rows: mockListings })
        .mockResolvedValueOnce({ rows: mockPhotos });

      const result = await fetchItemsByUserId(1);

      expect(result).toEqual([{ ...mockListings[0], image: mockPhotos[0].photo_url }]);
      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });
});