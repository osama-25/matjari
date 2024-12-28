import express from 'express';
import db from '../config/db.js';
import { createMessage, fetchMessagesByRoom, findOrCreateRoom, getRoomsForUser, hasNewMessages, markMessageAsSeen } from '../controllers/messagesController.js';

const router = express.Router();
// const upload = multer({ dest: 'uploads/' })

router.post('/messages', createMessage);
router.get('/messages/:room', fetchMessagesByRoom);
router.post('/find-or-create-room', findOrCreateRoom);
router.get('/get-rooms/:userId', getRoomsForUser);
router.get('/mark-seen/:messageId', markMessageAsSeen);
router.get('/newmessages/:userId', hasNewMessages);
// router.post('/messages', async (req, res) => {
//     const { content, room, sentByUser, files } = req.body;

//     try {
//         if (Array.isArray(files) && files.length > 0) {
//             // Multiple files
//             for (const file of files) {
//                 const { url, type } = file;

//                 await db.query(
//                     'INSERT INTO messages (content, room, sent_by_user, blob_data, blob_type) VALUES ($1, $2, $3, $4, $5)',
//                     [content, room, sentByUser, url, type]
//                 );
//             }
//         } else if (files && typeof files === 'object') {
//             // Single file
//             const { url, type } = files;

//             await db.query(
//                 'INSERT INTO messages (content, room, sent_by_user, blob_data, blob_type) VALUES ($1, $2, $3, $4, $5)',
//                 [content, room, sentByUser, url, type]
//             );
//         } else {
//             // No files
//             await db.query(
//                 'INSERT INTO messages (content, room, sent_by_user, blob_data, blob_type) VALUES ($1, $2, $3, $4, $5)',
//                 [content, room, sentByUser, null, null]
//             );
//         }

//         res.status(201).json({ message: 'Message saved successfully' });
//     } catch (error) {
//         console.error('Error saving message:', error);
//         res.status(500).json({ error: 'Failed to save message' });
//     }
// });



// // GET route to retrieve messages by room
// router.get('/messages/:room', async (req, res) => {
//     // console.log("InDown");
//     const room = req.params.room;
//     try {
//         const result = await db.query(
//             'SELECT * FROM messages WHERE room = $1 ORDER BY timestamp ASC',
//             [room]
//         );
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error retrieving messages:', error);
//         res.status(500).json({ error: 'Failed to retrieve messages' });
//     }
// });



export default router;

