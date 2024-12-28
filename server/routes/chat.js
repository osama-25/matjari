import express from 'express';
import db from '../config/db.js';
import { createMessage, fetchMessagesByRoom, findOrCreateRoom, getRoomsForUser, hasNewMessages, markMessageAsSeen } from '../controllers/messagesController.js';

const router = express.Router();
// const upload = multer({ dest: 'uploads/' })

router.post('/messages', createMessage);
router.get('/messages/:room/:userId', fetchMessagesByRoom);
router.post('/find-or-create-room', findOrCreateRoom);
router.get('/get-rooms/:userId', getRoomsForUser);

router.get('/mark-seen/:messageId', markMessageAsSeen);
router.get('/newmessages/:userId', hasNewMessages);



export default router;

