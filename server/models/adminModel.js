import db from '../config/db.js';

export const getAllUsers = async () => {
    try {
        const result = await db.query('SELECT id, fname, lname, email, user_name ,phone_number, banned FROM users Order By Id ASC');
        return result.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const getReports = async () => {
    try {
        const query = `
            SELECT id, type, date, user_id, status ,description
            FROM reports 
            ORDER BY date DESC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export const banUserById = async (userId) => {
    try {
        await db.query('UPDATE users SET banned = true WHERE id = $1', [userId]);
    } catch (error) {
        console.error('Error banning user:', error);
        throw error;
    }
};
