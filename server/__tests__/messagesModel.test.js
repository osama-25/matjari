import { saveMessage, getMessagesByRoom, createRoom, findRoom, getUserRooms, markSeen, isUserAllow } from '../models/messagesModel';
import db from '../config/db';

jest.mock('../config/db');

describe('Messages Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveMessage', () => {
    it('should save a message', async () => {
      const mockMessage = { content: 'Hello', room: 'room1', sentByUser: 1, blobData: null, blobType: null };
      const mockResult = { rows: [{ id: 1, content: 'Hello' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await saveMessage(mockMessage);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), Object.values(mockMessage));
      expect(result).toEqual(mockResult);
    });
  });

  describe('getMessagesByRoom', () => {
    it('should return messages for a room', async () => {
      const mockResult = { rows: [{ id: 1, content: 'Hello' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getMessagesByRoom('room1');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['room1']);
      expect(result).toEqual(mockResult);
    });
  });

  describe('createRoom', () => {
    it('should create a new room', async () => {
      const mockResult = { rows: [{ id: 1, room_id: 'room1' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await createRoom(1, 2, 'room1');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['room1', 1, 2]);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findRoom', () => {
    it('should find a room by ID', async () => {
      const mockResult = { rows: [{ id: 1, room_id: 'room1' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await findRoom('room1');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['room1']);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserRooms', () => {
    it('should return rooms for a user', async () => {
      const mockResult = { rows: [{ id: 1, room_id: 'room1' }] };
      db.query.mockResolvedValue(mockResult);

      const result = await getUserRooms(1);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual(mockResult.rows);
    });
  });

  describe('markSeen', () => {
    it('should mark a message as seen', async () => {
      const mockResult = { rowCount: 1 };
      db.query.mockResolvedValue(mockResult);

      const result = await markSeen(1);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual(mockResult);
    });
  });

  describe('isUserAllow', () => {
    it('should check if a user is allowed in a room', async () => {
      const mockResult = { rowCount: 1 };
      db.query.mockResolvedValue(mockResult);

      const result = await isUserAllow('room1', 1);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['room1', 1]);
      expect(result).toEqual(mockResult.rowCount);
    });
  });
});