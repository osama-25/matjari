import request from 'supertest';
import express from 'express';
import chatRoutes from '../routes/chat';
import { createMessage, fetchMessagesByRoom, findOrCreateRoom, getRoomsForUser, markMessageAsSeen, hasNewMessages } from '../controllers/messagesController';

jest.mock('../controllers/messagesController');

const app = express();
app.use(express.json());
app.use('/chat', chatRoutes);

describe('Chat Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /chat/messages', () => {
    it('should create a message', async () => {
      createMessage.mockImplementation((req, res) => res.status(201).json({ id: 1, message: 'Message saved successfully' }));

      const response = await request(app)
        .post('/chat/messages')
        .send({ content: 'Hello', room: 'room1', sentByUser: 1 });

      expect(createMessage).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 1, message: 'Message saved successfully' });
    });
  });

  describe('GET /chat/messages/:room/:userId', () => {
    it('should fetch messages by room', async () => {
      fetchMessagesByRoom.mockImplementation((req, res) => res.json([{ id: 1, content: 'Hello' }]));

      const response = await request(app).get('/chat/messages/room1/1');

      expect(fetchMessagesByRoom).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, content: 'Hello' }]);
    });
  });

  describe('POST /chat/find-or-create-room', () => {
    it('should find or create a room', async () => {
      findOrCreateRoom.mockImplementation((req, res) => res.status(201).json({ messages: 'Create a new room', room: { id: 1, room_id: '1-2' } }));

      const response = await request(app)
        .post('/chat/find-or-create-room')
        .send({ userId1: 1, userId2: 2 });

      expect(findOrCreateRoom).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ messages: 'Create a new room', room: { id: 1, room_id: '1-2' } });
    });
  });

  describe('GET /chat/get-rooms/:userId', () => {
    it('should fetch rooms for a user', async () => {
      getRoomsForUser.mockImplementation((req, res) => res.status(200).json([{ id: 1, room_id: 'room1' }]));

      const response = await request(app).get('/chat/get-rooms/1');

      expect(getRoomsForUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, room_id: 'room1' }]);
    });
  });

  describe('GET /chat/mark-seen/:messageId', () => {
    it('should mark a message as seen', async () => {
      markMessageAsSeen.mockImplementation((req, res) => res.status(200).json({ ok: true, message: 'Message marked as seen' }));

      const response = await request(app).get('/chat/mark-seen/1');

      expect(markMessageAsSeen).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ok: true, message: 'Message marked as seen' });
    });
  });

  describe('GET /chat/newmessages/:userId', () => {
    it('should check for new messages', async () => {
      hasNewMessages.mockImplementation((req, res) => res.status(200).json({ hasNewMessages: true, rooms: [1] }));

      const response = await request(app).get('/chat/newmessages/1');

      expect(hasNewMessages).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ hasNewMessages: true, rooms: [1] });
    });
  });
});