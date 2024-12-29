import { getInfo } from './dataInfo';

const FetchUserAndFavorite = async (itemID) => {
    let info;
    try {
        info = await getInfo(); // Replace this with your API call
    } catch (error) {
        return 'User not logged in';
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: info.id, listingId: itemID }),
        });

        if (!response.ok) {
            throw new Error(`Failed to toggle favorite: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Failed to toggle favorite:', error);
    }
};

export default FetchUserAndFavorite;