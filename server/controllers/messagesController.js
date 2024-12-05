// controllers/messageController.js

import { saveMessage, getMessagesByRoom } from '../models/messagesModel.js';
export const createMessage = async (req, res) => {
    const { content, room, sentByUser, files } = req.body;

    try {
        if (Array.isArray(files) && files.length > 0) {
            // Handle multiple files
            for (const file of files) {
                const { url, type } = file;
                await saveMessage({ content, room, sentByUser, blobData: url, blobType: type });
            }
        } else if (files && typeof files === 'object') {
            // Handle single file
            const { url, type } = files;
            await saveMessage({ content, room, sentByUser, blobData: url, blobType: type });
        } else {
            // Handle no files
            await saveMessage({ content, room, sentByUser });
        }

        res.status(201).json({ message: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
};

export const fetchMessagesByRoom = async (req, res) => {
    const room = req.params.room;

    try {
        const result = await getMessagesByRoom(room);
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};
