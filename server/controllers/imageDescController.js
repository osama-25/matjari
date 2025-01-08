import axios from 'axios';
import dotenv from 'dotenv';
import { getTotalItems, getPaginatedResults, getFilteredResults } from '../models/imageDescModel.js';
import db from '../config/db.js';

dotenv.config();

// Azure API Configuration
const ApiKey = process.env.APIKEY;
const AzureEndpoint = `${process.env.AZUREENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags,Description`;


const getImageDescription = async (imageUrl) => {
    if (!imageUrl) {
        throw new Error('Image URL is required');
    }

    const instance = axios.create({
        baseURL: AzureEndpoint,
        headers: {
            'Ocp-Apim-Subscription-Key': ApiKey,
            'Content-Type': 'application/json',
        },
    });

    const response = await instance.post('', { url: imageUrl });
    return response.data;
};

export const describeImage = async (req, res) => {
    try {
        const data = await getImageDescription(req.body.image);
        res.status(200).send({ response: 'ok', data });
    } catch (error) {
        console.error('Azure API error:', error.response?.data || error.message);
        res.status(500).send({ response: 'not ok', error: error.response?.data || error.message });
    }
};

export const searchByImage = async (req, res) => {
    const { image } = req.body;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    
    try {
        const imageData = await getImageDescription(image);
        const extractedTags = imageData.tags.slice(0, 10).map(tag => tag.name) || [];
        if (extractedTags.length === 0) {
            return res.status(404).json({ message: 'No tags found for the image' });
        }

        console.log(extractedTags);

        // Get total items count
        const totalItems = await getTotalItems(extractedTags);
        const totalPages = Math.ceil(totalItems / pageSize);

        // Get paginated results
        const items = await getPaginatedResults(extractedTags, pageSize, offset);

        res.status(200).json({
            items,
            page,
            pageSize,
            totalItems,
            totalPages
        });
    } catch (error) {
        console.error('Error searching by image:', error);
        res.status(500).json({ message: 'Error searching by image' });
    }
};


export const searchByImageFilter = async (req, res) => {
    const { page, pageSize } = req.params;
    const { image } = req.body;
    const { minPrice, maxPrice, location, delivery, condition, order } = req.body;
    const parsedPage = parseInt(page) || 1;
    const parsedPageSize = parseInt(pageSize) || 10;
    const offset = (parsedPage - 1) * parsedPageSize;

    try {
        // Extract tags for the uploaded image
        const imageData = await getImageDescription(image);
        const extractedTags = imageData.tags.slice(0, 10).map(tag => tag.name) || [];

        if (extractedTags.length === 0) {
            return res.status(404).json({ message: 'No tags found for the image' });
        }

        const filters = { minPrice, maxPrice, location, delivery, condition };
        const { items, totalItems, totalPages } = await getFilteredResults(extractedTags, filters, parsedPageSize, offset, order);

        res.status(200).json({
            items,
            parsedPage,
            parsedPageSize,
            totalItems,
            totalPages,
        });
    } catch (error) {
        console.error('Error searching by image with filter:', error);
        res.status(500).json({ message: 'Error searching by image with filter' });
    }
};