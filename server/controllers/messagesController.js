// controllers/messageController.js

import { saveMessage, getMessagesByRoom, createRoom, findRoom, getUserRooms, isUserAllow } from '../models/messagesModel.js';

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


export const getRoomsForUser = async (req, res) => {

    const { userId } = req.params;

    if (!userId)
        return res.status(400).json({ message: 'user ID is required' });




    try {
        const getRooms = await getUserRooms(userId);
        console.log(getRooms);

        // console.log("#");
        // console.log(userId);
        // console.log(getRooms.user1_id);
        // console.log(getRooms.user2_id);
        // console.log("#");



        // if (userId == getRooms.user1_id || userId == getRooms.user2_id)
        res.status(200).json(getRooms)
        // else res.status(400).json({
        //     Error: "user can't acess others rooms",
        // })

    } catch (error) {
        res.status(500).json({ error: "Failed to get user rooms" });
        console.error(errro);
    }
}



