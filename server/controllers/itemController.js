import { addItem, fetchAllItems, fetchItemById, deleteItemById, updateItem, fetchItemsByUserId } from '../models/itemModel.js';

export const createItem = async (req, res) => {
    try {
        const listingId = await addItem(req.body);
        res.status(201).json({ message: 'Listing created successfully', itemId: listingId });
    } catch (error) {
        console.error('Error saving listing:', error);
        res.status(500).json({ message: 'Error saving listing' });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await fetchAllItems();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
};

export const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await fetchItemById(id);
        res.status(200).json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteItemById(id);
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateItemById = async (req, res) => {
    const { listingId } = req.params;
    try {
        await updateItem(listingId, req.body);
        res.status(201).json({ message: 'Listing updated successfully' });
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ message: 'Error updating listing' });
    }
};

export const getItemsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const listings = await fetchItemsByUserId(userId);
        res.status(200).json({ listings });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ message: 'Error fetching listings' });
    }
};