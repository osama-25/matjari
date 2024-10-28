import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// POST route to save a message to the database
router.post('/messages', async (req, res) => {
    const { content, room, sentByUser } = req.body;  // Include sentByUser in the request body
    try {
        await db.query(
            'INSERT INTO messages (content, room, sent_by_user) VALUES ($1, $2, $3)',
            [content, room, sentByUser]
        );
        res.status(201).json({ message: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// GET route to retrieve messages by room
router.get('/messages/:room', async (req, res) => {
    const room = req.params.room;
    try {
        const result = await db.query(
            'SELECT * FROM messages WHERE room = $1 ORDER BY timestamp ASC',
            [room]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

export default router;
