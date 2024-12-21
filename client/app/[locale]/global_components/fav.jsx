'use client';
import { getInfo } from './dataInfo';

const FetchUserAndFavorite = async (itemID) => {
    try {
        const info = await getInfo(); // Replace this with your API call
        if (!info) {
            return;
        }
        const response = await fetch('http://localhost:8080/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: info.id, listingId: itemID }),
        });

        if (!response.ok) {
            throw new Error(`Failed to toggle favorite: ${response.text}`);
        }

        const result = await response.json();
        console.log(result.message);
        return;
    } catch (error) {
        throw new Error(`Failed to fetch favourited state: ${error.message}`);
    }
};

export default FetchUserAndFavorite;
