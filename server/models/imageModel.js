// models/imageModel.js
import db from '../config/db.js';

export const storeImageMetadata = async (filename, fileType, imgURL, databaseName) => {
    const query = `
        INSERT INTO images (filename, file_type, img_url, upload_date)
        VALUES ($1, $2, $3, NOW())
    `;
    const values = [filename, fileType, imgURL];

    await db.query(query, values);
};
