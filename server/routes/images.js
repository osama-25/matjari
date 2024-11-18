import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/images/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the image data from the database
        const result = await db.query('SELECT * FROM images WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const image = result.rows[0];

        res.json({
            filename: image.filename,
            fileType: image.file_type,
            url: image.img_url,  // URL to the image in Azure Blob Storage
            uploadDate: image.upload_date
        });

        console.log("got here");

    } catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).json({ error: 'Error retrieving image' });
    }
});


router.get('/images', async (req, res) => {

    try {
        const query = "Select * from images;"; //"Select count(id) from images";
        const result = await db.query(query);
        const data = result.rows
        console.log(data);

        res.status(200).send(data);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving images " })

    }

})
export default router;
