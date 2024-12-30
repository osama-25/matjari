import axios from 'axios';
import dotenv from 'dotenv';
import { getTotalItems, getPaginatedResults } from '../models/imageDescModel.js';

dotenv.config();

// Azure API Configuration
const ApiKey = process.env.APIKEY;
const AzureEndpoint = `${process.env.AZUREENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags,Description`;

const IMAGE_DESCRIPTION_API = 'http://localhost:8080/imageDesc/describe';

export const describeImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).send({ error: 'Image URL is required' });
        }

        const instance = axios.create({
            baseURL: AzureEndpoint,
            headers: {
                'Ocp-Apim-Subscription-Key': ApiKey,
                'Content-Type': 'application/json',
            },
        });

        const response = await instance.post('', { url: image });
        const data = response.data;

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
    console.log("Search by image route: " + image);
    try {
        // Extract tags for the uploaded image
        const response = await axios.post(IMAGE_DESCRIPTION_API, { image });
        const extractedTags = response.data.data?.tags.slice(0, 10).map(tag => tag.name) || [];

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