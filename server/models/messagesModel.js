// models/messageModel.js
import db from '../config/db.js';

export const saveMessage = async ({ content, room, sentByUser, blobData = null, blobType = null }) => {
    const query = `
        INSERT INTO messages (content, room, sent_by_user, blob_data, blob_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [content, room, sentByUser, blobData, blobType];
    return await db.query(query, values);
};

export const getMessagesByRoom = async (room) => {
    const query = `
        SELECT * FROM messages
        WHERE room = $1
        ORDER BY timestamp ASC
    `;
    return db.query(query, [room]);
};

// export const findOrCreateRoom = async (userId1, userId2) => {


export const findRoom = async (roomId) => {


    const roomQuery = await db.query(`SELECT * FROM rooms WHERE room_id = $1`, [roomId]);
    // console.log("THIS??");
    return roomQuery;
}

export const createRoom = async (userId1, userId2, roomId) => {
    const newRoomQuery = await db.query(
        `INSERT INTO rooms (room_id, user1_id, user2_id) VALUES ($1, $2, $3) RETURNING *`,
        [roomId, userId1, userId2]
    );
    return newRoomQuery;
}


export const isUserAllow = async (roomId, userId) => {
    try {
        const query = `SELECT * from rooms
     Where id = $1 
     and (user1_id = $2 or user2_id = $2);
    `;

        const result = await db.query(query, [roomId, userId]);

        return result.rowCount;
    } catch (error) {
        console.log("Error is isUserAllow ");
        throw error;
    }
}
export const getUserRooms = async (userId) => {


    try {
        const query = `SELECT r.user1_id , r.user2_id, r.id, r.room_id, u.user_name
            FROM rooms r , users u
            WHERE (r.user1_id = u.id or r.user2_id = u.id) 
            and  (r.user1_id = $1 or r.user2_id = $1) 
            and (u.id != $1)
`;
        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.log("Error in getUserRooms");
        throw error;

    }
}

export const markSeen = async (messageId) => {
    const query = `
        UPDATE messages
        SET seen = true
        WHERE id = $1
    `;
    return db.query(query, [messageId]);
};

