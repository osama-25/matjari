// controllers/messageController.js

import { saveMessage, getMessagesByRoom, createRoom, findRoom, getUserRooms, markSeen, isUserAllow, updateRoom } from '../models/messagesModel.js';

export const createMessage = async (req, res) => {
    const { content, room, sentByUser, files } = req.body;

    try {
        let response;
        if (Array.isArray(files) && files.length > 0) {
            // Handle multiple files
            for (const file of files) {
                const { url, type } = file;
                response = await saveMessage({ content, room, sentByUser, blobData: url, blobType: type });
            }
        } else if (files && typeof files === 'object') {
            // Handle single file
            const { url, type } = files;
            response = await saveMessage({ content, room, sentByUser, blobData: url, blobType: type });
        } else {
            // Handle no files
            response = await saveMessage({ content, room, sentByUser });
        }
        
        const updateResponse = await updateRoom({ room, content });

        res.status(201).json({ id: response.rows[0].id, message: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
};

export const fetchMessagesByRoom = async (req, res) => {
    const room = req.params.room;
    const userId = req.params.userId;
    console.log("CHK");
    console.log(room, userId);



    try {

        const check = await isUserAllow(room, userId);
        console.log(check);

        if (check == 0) {
            res.status(400).json({
                error: "Not allow"
            })
        } else {
            const result = await getMessagesByRoom(room);

            res.json(result.rows);
        }
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};


// 6 / 2    2-6
export const getRoomsForUser = async (req, res) => {

    const { userId } = req.params;

    if (!userId)
        return res.status(400).json({ message: 'user ID is required' });



    try {
        const getRooms = await getUserRooms(userId);

        console.log(getRooms);


        res.status(200).json(getRooms)
    } catch (error) {
        res.status(500).json({ error: "Failed to get user rooms" });
        console.error(error);
    }
}


export const findOrCreateRoom = async (req, res) => {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
        return res.status(400).json({ message: 'Both user IDs are required' });
    }

    console.log(typeof userId1);
    console.log(typeof userId2);

    // const roomId = [userId1, userId2].sort().join('_');

    const roomId = [Number(userId1), Number(userId2)].sort((a, b) => a - b).join('-');

    console.log(roomId);

    try {
        // Check if room exists
        const roomQuery = await findRoom(roomId)

        if (roomQuery.rowCount > 0) {
            // Room already exists
            return res.status(200).json({ messages: "Room already exists", room: roomQuery.rows[0] });
        } else {
            // Create a new room
            const newRoomQuery = await createRoom(userId1, userId2, roomId);

            return res.status(201).json({ messages: "Create a new room", room: newRoomQuery.rows[0] });
        }
    } catch (error) {
        console.error('Error finding or creating room:', error);
        res.status(500).json({ message: 'Server error' });
    }



}


export const markMessageAsSeen = async (req, res) => {
    const { messageId } = req.params;

    if (!messageId) {
        return res.status(400).json({ message: 'Message ID is required' });
    }

    try {
        const response = await markSeen(messageId);
        if (response.rowCount === 0) {
            throw new Error('Failed to mark message as seen');
        }

        res.status(200).json({ ok: true, message: 'Message marked as seen' });
    } catch (error) {
        console.error('Error marking message as seen:', error);
        res.status(500).json({ error: 'Failed to mark message as seen' });
    }
};

export const hasNewMessages = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const datarooms = await getUserRooms(userId);
        const rooms = [];
        for (const room of datarooms) {
            const result = await getMessagesByRoom(room.id);
            const messages = result.rows;
            for (const message of messages) {
                if (!message.seen && parseInt(message.sent_by_user) != parseInt(userId)) {
                    console.log(message);
                    console.log('me' + userId);
                    console.log(room);
                    rooms.push(room.id);
                    break;
                }
            }
        }
        res.status(200).json({ hasNewMessages: rooms.length > 0, rooms });
    } catch (error) {
        console.error('Error checking for new messages:', error);
        res.status(500).json({ error: 'Failed to check for new messages' });
    }
}

