import { getUserById, updateUser, getListingPhoto, getListingsByUserId } from '../models/userModel.js';

export const getUser = async (req, res) => {
    const id = parseInt(req.user.id, 10); // Ensure id is an integer
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const modifyUser = async (req, res) => {
    const id = req.user.id;
    const { email, user_name, fname, lname, phone_number, photo } = req.body;

    // Validate the incoming data
    if (!email || !user_name || !fname || !lname) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const updatedUser = await updateUser(id, { email, user_name, fname, lname, phone_number, photo });
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error("Error updating user data:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Controller function to get user details along with their listings
export const getUserDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch user data
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch user listings
        const listings = await getListingsByUserId(userId);

        // Fetch one photo for each listing
        const listingsWithPhotos = await Promise.all(listings.map(async (listing) => {
            const photo = await getListingPhoto(listing.id);
            listing.image = photo;
            return listing;
        }));

        // Add listings with photos to the user object
        user.listings = listingsWithPhotos;

        // Return user data along with listings
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
