import express from 'express';
import db from '../config/db.js';
import multer from 'multer';

const router = express.Router();
// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, Date.now() + '-' + file.originalname);

    }
})

const upload = multer({ storage: storage })

// POST route to save a message to the database
// POST route to save a message to the database
router.post('/messages', upload.array('files'), async (req, res) => {
    const { content, room, sentByUser } = req.body;

    // Gather file details if any files were uploaded
    const files = req.files ? req.files.map(file => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`, // File URL relative to the server
        type: file.mimetype
    })) : [];

    try {
        // Insert the message and file details into the database
        await db.query(
            'INSERT INTO messages (content, room, sent_by_user, files) VALUES ($1, $2, $3, $4)',
            [content, room, sentByUser, JSON.stringify(files)] // Store files as a JSON string
        );
        res.status(201).json({ message: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// router.post('/messages', async (req, res) => {

//     console.log("InUP");

//     console.log(req.body);

//     const { content, room, sentByUser, files } = req.body;  // Include sentByUser in the request body
//     try {
//         await db.query(
//             'INSERT INTO messages (content, room, sent_by_user , files) VALUES ($1, $2, $3, $4)',
//             [content, room, sentByUser , files]
//         );
//         res.status(201).json({ message: 'Message saved successfully' });
//     } catch (error) {
//         console.error('Error saving message:', error);
//         res.status(500).json({ error: 'Failed to save message' });
//     }
// });

// GET route to retrieve messages by room
router.get('/messages/:room', async (req, res) => {
    // console.log("InDown");
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

router.post('/file', upload.single('file'), (req, res) => {
    return res.send(req.file);
})

export default router;

