// models/imageModel.js
import db from '../config/db.js';

export const getImageById = async (id) => {
    const result = await db.query('SELECT * FROM images WHERE id = $1', [id]);
    return result.rows[0];
};

export const getAllImages = async () => {
    const result = await db.query('SELECT * FROM images');
    return result.rows;
};

export const storeImageMetadata = async (filename, fileType, imgURL) => {
    const query = `
        INSERT INTO images (filename, file_type, img_url, upload_date)
        VALUES ($1, $2, $3, NOW())
    `;
    const values = [filename, fileType, imgURL];
    await db.query(query, values);
};