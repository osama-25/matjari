import axios from 'axios';
import dotenv from 'dotenv';
import { getTotalItems, getPaginatedResults } from '../models/imageDescModel.js';
import db from '../config/db.js';

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

export const searchByImageFilter = async (req, res) => {
    const { page, pageSize } = req.params;
    const { image } = req.body;
    const { minPrice, maxPrice, location, delivery, condition, order } = req.body;
    const parsedPage = parseInt(page) || 1;
    const parsedPageSize = parseInt(pageSize) || 10;
    const offset = (page - 1) * parsedPageSize;

    try {
        // Extract tags for the uploaded image
        const response = await axios.post(IMAGE_DESCRIPTION_API, { image });
        const extractedTags = response.data.data?.tags.slice(0, 10).map(tag => tag.name) || [];

        if (extractedTags.length === 0) {
            return res.status(404).json({ message: 'No tags found for the image' });
        }

        let query = `
            SELECT COUNT(DISTINCT l.id) as total
            FROM listings l
            JOIN listing_photos lp ON lp.listing_id = l.id
            WHERE (
                SELECT COUNT(*)
                FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                WHERE tag = ANY ($1)
            ) > 2`;
        const queryParams = [extractedTags];

        if (minPrice) {
            queryParams.push(minPrice);
            query += ` AND l.price >= $${queryParams.length}`;
        }

        if (maxPrice) {
            queryParams.push(maxPrice);
            query += ` AND l.price <= $${queryParams.length}`;
        }

        if (location) {
            queryParams.push(location);
            query += ` AND l.location = $${queryParams.length}`;
        }

        if (delivery) {
            queryParams.push(delivery);
            query += ` AND l.delivery = $${queryParams.length}`;
        }

        if (condition) {
            queryParams.push(condition);
            query += ` AND l.condition = $${queryParams.length}`;
        }

        const countResult = await db.query(query, queryParams);
        const totalItems = countResult.rows[0].total;
        const totalPages = Math.ceil(totalItems / parsedPageSize);

        let filterQuery = `
        SELECT * FROM ( 
            SELECT DISTINCT ON (l.id) l.*, 
                   (SELECT photo_url 
                    FROM listing_photos lp2 
                    WHERE lp2.listing_id = l.id 
                    ORDER BY lp2.id ASC 
                    LIMIT 1) as image,
                   (
                      SELECT COUNT(*)
                      FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                      WHERE tag = ANY ($1)
                   ) as matching_tags_count
            FROM listing_photos lp
            JOIN listings l ON lp.listing_id = l.id
            WHERE (
                SELECT COUNT(*)
                FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                WHERE tag = ANY ($1)
            ) >= 2`;

        filterQuery += query.replace(`SELECT COUNT(DISTINCT l.id) as total
            FROM listings l
            JOIN listing_photos lp ON lp.listing_id = l.id
            WHERE (
                SELECT COUNT(*)
                FROM jsonb_array_elements_text(lp.tags::jsonb) AS tag
                WHERE tag = ANY ($1)
            ) > 2`, '');
        
        filterQuery += ` ORDER BY l.id, matching_tags_count DESC) as listings ORDER BY`

        if (order === 'lowtohigh') {
            filterQuery += ` price ASC,`;
        } else if (order === 'hightolow') {
            filterQuery += ` price DESC,`;
        }

        filterQuery += ` matching_tags_count DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(parsedPageSize, offset);

        console.log(filterQuery);

        const itemsResult = await db.query(filterQuery, queryParams);

        res.status(200).json({
            items: itemsResult.rows,
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