import express from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
import db from '../config/db.js';
import { Readable } from 'stream';

const router = express.Router();

const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
// console.log(accountName);
// console.log(sasToken);
// console.log(containerName);


const containerClient = blobServiceClient.getContainerClient(containerName);

const uploadOptions = {
    blobHTTPHeaders: {
        blobContentType: "image/png",
    },
};
// Function to convert base64 to stream
function bufferToStream(buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}

async function uploadImageStream(blobName, dataStream) {
    console.log('un');

    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadStream(dataStream);
    return blobClient.url;
}

async function storeMetaData(filename, fileType, imgURL, databaseName) {
    if (databaseName == 'chatting') {
        await db.query(
            'INSERT INTO images (filename, file_type, img_url, upload_date) VALUES ($1, $2, $3, NOW())',
            [filename, fileType, imgURL]
        );
    }
    else {
        // other : profile pictures, items .... 
    }
}

router.post('/upload', async (req, res) => {
    console.log("Hit");

    try {
        const { filename, fileType, imageBase64, storeInDataBase } = req.body;

        console.log(filename);
        console.log(fileType);
        // console.log(imageBase64);

        if (!filename || !fileType || !imageBase64) {
            return res.status(400).send({ error: "Missing 'filename', 'fileType', or 'imageBase64' in JSON body" });
        }
        console.log("pass");


        // Decode base64 image data
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const imageStream = bufferToStream(imageBuffer);

        // Upload the image to Azure Blob Storage
        console.log('error');

        const imgURL = await uploadImageStream(filename, imageStream);
        console.log('erro1');
        // Store metadata in the database
        if (storeInDataBase)
            await storeMetaData(filename, fileType, imgURL, storeInDataBase);

        console.log('DONE');

        res.status(201).send({ message: "Image Uploaded", imgURL });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).send({ error: "Error with uploading image" });
    }
});

export default router;
