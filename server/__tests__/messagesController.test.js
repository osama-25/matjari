import { createMessage, fetchMessagesByRoom, getRoomsForUser, findOrCreateRoom, markMessageAsSeen, hasNewMessages } from '../controllers/messagesController';
import { saveMessage, getMessagesByRoom, createRoom, findRoom, getUserRooms, markSeen, isUserAllow } from '../models/messagesModel';

jest.mock('../models/messagesModel');

describe('Messages Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should create a message', async () => {
      const req = { body: { content: 'Hello', room: 'room1', sentByUser: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockResult = { rows: [{ id: 1, content: 'Hello' }] };
      saveMessage.mockResolvedValue(mockResult);

      await createMessage(req, res);

      expect(saveMessage).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, message: 'Message saved successfully' });
    });

    it('should handle errors', async () => {
      const req = { body: { content: 'Hello', room: 'room1', sentByUser: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      saveMessage.mockRejectedValue(new Error('Database error'));

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save message' });
    });
  });

  describe('fetchMessagesByRoom', () => {
    it('should fetch messages by room', async () => {
      const req = { params: { room: 'room1', userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockResult = { rows: [{ id: 1, content: 'Hello' }] };
      isUserAllow.mockResolvedValue(1);
      getMessagesByRoom.mockResolvedValue(mockResult);

      await fetchMessagesByRoom(req, res);

      expect(isUserAllow).toHaveBeenCalledWith('room1', 1);
      expect(getMessagesByRoom).toHaveBeenCalledWith('room1');
      expect(res.json).toHaveBeenCalledWith(mockResult.rows);
    });

    it('should handle errors', async () => {
      const req = { params: { room: 'room1', userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      isUserAllow.mockRejectedValue(new Error('Database error'));

      await fetchMessagesByRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve messages' });
    });
  });

  describe('getRoomsForUser', () => {
    it('should fetch rooms for a user', async () => {
      const req = { params: { userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockRooms = [{ id: 1, room_id: 'room1' }];
      getUserRooms.mockResolvedValue(mockRooms);

      await getRoomsForUser(req, res);

      expect(getUserRooms).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRooms);
    });

    it('should handle errors', async () => {
      const req = { params: { userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      getUserRooms.mockRejectedValue(new Error('Database error'));

      await getRoomsForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get user rooms' });
    });
  });

  describe('findOrCreateRoom', () => {
    it('should find or create a room', async () => {
      const req = { body: { userId1: 1, userId2: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockRoom = { id: 1, room_id: '1-2' };
      findRoom.mockResolvedValue({ rowCount: 0 });
      createRoom.mockResolvedValue({ rows: [mockRoom] });

      await findOrCreateRoom(req, res);

      expect(findRoom).toHaveBeenCalledWith('1-2');
      expect(createRoom).toHaveBeenCalledWith(1, 2, '1-2');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ messages: 'Create a new room', room: mockRoom });
    });

    it('should handle errors', async () => {
      const req = { body: { userId1: 1, userId2: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      findRoom.mockRejectedValue(new Error('Database error'));

      await findOrCreateRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('markMessageAsSeen', () => {
    it('should mark a message as seen', async () => {
      const req = { params: { messageId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      markSeen.mockResolvedValue({ rowCount: 1 });

      await markMessageAsSeen(req, res);

      expect(markSeen).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ok: true, message: 'Message marked as seen' });
    });

    it('should handle errors', async () => {
      const req = { params: { messageId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      markSeen.mockRejectedValue(new Error('Database error'));

      await markMessageAsSeen(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to mark message as seen' });
    });
  });

  describe('hasNewMessages', () => {
    it('should check for new messages', async () => {
      const req = { params: { userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockRooms = [{ id: 1, room_id: 'room1' }];
      const mockMessages = [{ id: 1, content: 'Hello', seen: false, sent_by_user: 2 }];
      getUserRooms.mockResolvedValue(mockRooms);
      getMessagesByRoom.mockResolvedValue({ rows: mockMessages });

      await hasNewMessages(req, res);

      expect(getUserRooms).toHaveBeenCalledWith(1);
      expect(getMessagesByRoom).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ hasNewMessages: true, rooms: [1] });
    });

    it('should handle errors', async () => {
      const req = { params: { userId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      getUserRooms.mockRejectedValue(new Error('Database error'));

      await hasNewMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to check for new messages' });
    });
  });
});