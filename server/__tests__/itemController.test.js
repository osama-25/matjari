const { createItem, getAllItems, getItemById, deleteItem, updateItemById, getItemsByUserId } = require('../controllers/itemController');
const { addItem, fetchAllItems, fetchItemById, deleteItemById, updateItem, fetchItemsByUserId } = require('../models/itemModel');

jest.mock('../models/itemModel');

describe('Item Controller', () => {
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

  describe('createItem', () => {
    it('should create a new item', async () => {
      const req = mockReq({ title: 'New Item' });
      const res = mockRes();
      addItem.mockResolvedValue(1);

      await createItem(req, res);

      expect(addItem).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Listing created successfully', itemId: 1 });
    });

    it('should handle errors', async () => {
      const req = mockReq({ title: 'New Item' });
      const res = mockRes();
      addItem.mockRejectedValue(new Error('Error saving listing'));

      await createItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error saving listing' });
    });
  });

  describe('getAllItems', () => {
    it('should fetch all items', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockItems = [{ id: 1, title: 'Item 1' }];
      fetchAllItems.mockResolvedValue(mockItems);

      await getAllItems(req, res);

      expect(fetchAllItems).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    it('should handle errors', async () => {
      const req = mockReq();
      const res = mockRes();
      fetchAllItems.mockRejectedValue(new Error('Error fetching items'));

      await getAllItems(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching items' });
    });
  });

  describe('getItemById', () => {
    it('should fetch item by ID', async () => {
      const req = mockReq({}, { id: 1 });
      const res = mockRes();
      const mockItem = { id: 1, title: 'Item 1' };
      fetchItemById.mockResolvedValue(mockItem);

      await getItemById(req, res);

      expect(fetchItemById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItem);
    });

    it('should handle errors', async () => {
      const req = mockReq({}, { id: 1 });
      const res = mockRes();
      fetchItemById.mockRejectedValue(new Error('Error fetching item'));

      await getItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('deleteItem', () => {
    it('should delete item by ID', async () => {
      const req = mockReq({}, { id: 1 });
      const res = mockRes();
      deleteItemById.mockResolvedValue();

      await deleteItem(req, res);

      expect(deleteItemById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Listing deleted successfully' });
    });

    it('should handle errors', async () => {
      const req = mockReq({}, { id: 1 });
      const res = mockRes();
      deleteItemById.mockRejectedValue(new Error('Error deleting listing'));

      await deleteItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('updateItemById', () => {
    it('should update item by ID', async () => {
      const req = mockReq({ title: 'Updated Item' }, { listingId: 1 });
      const res = mockRes();
      updateItem.mockResolvedValue();

      await updateItemById(req, res);

      expect(updateItem).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Listing updated successfully' });
    });

    it('should handle errors', async () => {
      const req = mockReq({ title: 'Updated Item' }, { listingId: 1 });
      const res = mockRes();
      updateItem.mockRejectedValue(new Error('Error updating listing'));

      await updateItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating listing' });
    });
  });

  describe('getItemsByUserId', () => {
    it('should fetch items by user ID', async () => {
      const req = mockReq({}, { userId: 1 });
      const res = mockRes();
      const mockItems = [{ id: 1, title: 'Item 1' }];
      fetchItemsByUserId.mockResolvedValue(mockItems);

      await getItemsByUserId(req, res);

      expect(fetchItemsByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ listings: mockItems });
    });

    it('should handle errors', async () => {
      const req = mockReq({}, { userId: 1 });
      const res = mockRes();
      fetchItemsByUserId.mockRejectedValue(new Error('Error fetching listings'));

      await getItemsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching listings' });
    });
  });
});