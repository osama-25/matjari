// controllers/imageController.js
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';
import { storeImageMetadata } from '../models/imageModel.js';

const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Function to convert buffer to stream
function bufferToStream(buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}

// Function to upload image stream to Azure Blob Storage
const uploadImageStream = async (blobName, dataStream) => {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadStream(dataStream);
    return blobClient.url;
};

export const uploadImage = async (req, res) => {
    try {
        const { filename, fileType, imageBase64, storeInDataBase } = req.body;

        if (!filename || !fileType || !imageBase64) {
            return res.status(400).json({ error: "Missing 'filename', 'fileType', or 'imageBase64' in JSON body" });
        }

        // Decode base64 image data
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const imageStream = bufferToStream(imageBuffer);

        // Upload the image to Azure Blob Storage
        const imgURL = await uploadImageStream(filename, imageStream);

        // Store metadata in the database (if required)
        if (storeInDataBase) {
            await storeImageMetadata(filename, fileType, imgURL, storeInDataBase);
        }

        res.status(201).json({ message: "Image Uploaded", imgURL });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Error with uploading image" });
    }
};
