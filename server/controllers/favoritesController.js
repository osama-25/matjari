import { checkFavorite, addFavorite, removeFavorite, getFavoritesByUserId, getFavoriteListingIdsByUserId, isListingFavorited } from '../models/favoritesModel.js';

export const handleFavorite = async (req, res) => {
    const { userId, listingId } = req.body;

    try {
        const isFavorited = await checkFavorite(userId, listingId);

        if (isFavorited) {
            await removeFavorite(userId, listingId);
            return res.status(200).json({ message: 'Listing unfavorited successfully' });
        }

        await addFavorite(userId, listingId);
        res.status(200).json({ message: 'Listing favorited successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error handling favorite action' });
    }
};

export const getFavorites = async (req, res) => {
    const { userId } = req.params;
    console.log("User id is: " + userId);
    try {
        const favorites = await getFavoritesByUserId(userId);
        res.status(200).json({ favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving favorites' });
    }
};

export const getFavoriteListingIds = async (req, res) => {
    const { userId } = req.params;
    try {
        const favoriteListingIds = await getFavoriteListingIdsByUserId(userId);
        res.status(200).json({ favorites: favoriteListingIds });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error retrieving favorites' });
    }
};

export const checkIfFavorited = async (req, res) => {
    const { listingId, userId } = req.params;
    try {
        const favorited = await isListingFavorited(userId, listingId);
        res.status(200).json({ favorited });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving favorites' });
    }
};