import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const createUser = async ({ firstName, lastName, email, password, userName, photo }) => {
    if (!photo)
        photo = null;

    try {
        const hash = await hashPassword(password);
        const query = `
            INSERT INTO users (fname, lname, email, password, user_name, photo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [firstName, lastName, email, hash, userName, photo];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.SALTROUNDS || 10); // Default to 10 if not set
    return await bcrypt.hash(password, saltRounds);
};

export const getUserByEmail = async (email) => {
    try {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await db.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};


export const getUserById = async (id) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0]; // Return the first row (user)
    } catch (error) {
        throw new Error("Error fetching user data");
    }
};

export const updateUser = async (id, { email, user_name, fname, lname, phone_number, photo }) => {
    try {
        const result = await db.query(
            "UPDATE users SET email = $1, user_name = $2, fname = $3, lname = $4, phone_number = $5, photo = $6 WHERE id = $7 RETURNING *",
            [email, user_name, fname, lname, phone_number, photo, id]
        );
        return result.rows[0]; // Return updated user data
    } catch (error) {
        throw new Error("Error updating user data");
    }
};



// // Get user details by ID
// export const getUserById = async (userId) => {
//     const result = await db.query(
//         "SELECT user_name, photo FROM users WHERE id = $1",
//         [userId]
//     );
//     return result.rowCount === 0 ? null : result.rows[0];
// };

// Get listings by user ID
export const getListingsByUserId = async (userId) => {
    const result = await db.query(
        `SELECT * FROM listings WHERE user_id = $1`,
        [userId]
    );
    return result.rows;
};

// Get the first photo for a listing
export const getListingPhoto = async (listingId) => {
    const result = await db.query(
        `SELECT photo_url FROM listing_photos WHERE listing_id = $1 LIMIT 1`,
        [listingId]
    );
    return result.rows[0]?.photo_url || null;
};

