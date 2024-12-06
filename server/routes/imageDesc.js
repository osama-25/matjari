// routes/imageDesc.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

const router = express.Router();

// Azure API Configuration
const ApiKey = process.env.APIKEY;
const AzureEndpoint = `${process.env.AZUREENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags,Description`;

router.post('/describe', async (req, res) => {
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
});

const IMAGE_DESCRIPTION_API = 'http://localhost:8080/imageDesc/describe';
router.post('/search-by-image', async (req, res) => {
    const { image } = req.body;

    try {
        // Extract tags for the uploaded image
        const response = await axios.post(IMAGE_DESCRIPTION_API, { image });
        const extractedTags = response.data.data?.tags.slice(0, 10).map(tag => tag.name) || [];

        if (extractedTags.length === 0) {
            return res.status(404).json({ message: 'No tags found for the image' });
        }
        
        console.log(extractedTags);
        // Search for listings with matching tags
        const result = await db.query(
            `SELECT DISTINCT  l.* 
             FROM listing_photos lp
             JOIN listings l ON lp.listing_id = l.id
             WHERE EXISTS (
                 SELECT 1
                 FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                 WHERE tag = ANY ($1)
             )`,
            [extractedTags]
        );

        const listings = result.rows;

        res.status(200).json({ listings });
    } catch (error) {
        console.error('Error searching by image:', error);
        res.status(500).json({ message: 'Error searching by image' });
    }
});

export default router;
