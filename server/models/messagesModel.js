// models/messageModel.js
import db from '../config/db.js';

export const saveMessage = async ({ content, room, sentByUser, blobData = null, blobType = null }) => {
    const query = `
        INSERT INTO messages (content, room, sent_by_user, blob_data, blob_type)
        VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [content, room, sentByUser, blobData, blobType];
    return db.query(query, values);
};

export const getMessagesByRoom = async (room) => {
    const query = `
        SELECT * FROM messages
        WHERE room = $1
        ORDER BY timestamp ASC
    `;
    return db.query(query, [room]);
};


