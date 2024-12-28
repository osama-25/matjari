import db from '../config/db.js';
import bcrypt from 'bcrypt';

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

export const unbanUserById = async (userId) => {
    try {
        await db.query('UPDATE users SET banned = false WHERE id = $1', [userId]);
    } catch (error) {
        console.error('Error unbanning user:', error);
        throw error;
    }
};

export const saveReport = async ({ description, errorType, userId }) => {
    try {
        console.log("#_##_#");
        console.log(userId);
        console.log(errorType);
        console.log(description);




        const query = `
            INSERT INTO reports (description, type, date, status, user_id)
            VALUES ($1, $2, NOW(), 'Pending', $3)
            RETURNING id;
        `;
        const values = [description, errorType, userId];
        const result = await db.query(query, values);
        return result.rows[0].id;
    } catch (error) {
        console.error('Error saving report:', error);
        throw error;
    }
};

export const updateReportStatus = async (reportId, status) => {
    try {
        const query = 'UPDATE reports SET status = $1 WHERE id = $2 RETURNING *';
        const values = [status, reportId];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error updating report status:', error);
        throw error;
    }
};

// export const getAdminByUserAndPass = async (username, password) => {
//     try {
//         const query = 'SELECT * FROM admins WHERE username = $1 AND password = $2';
//         const values = [username, password];
//         const result = await db.query(query, values);
//         console.log(result.rows);

//         return result.rows.length > 0;
//     } catch (error) {
//         console.error('Error fetching admin:', error);
//         throw error;
//     }
// };
// // export const createAdmin = async (username, password) => {
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10); // Ensure the number of rounds is an integer
//         const query = 'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id';
//         const values = [username, hashedPassword];
//         const result = await db.query(query, values);
//         return result.rows[0].id;
//     } catch (error) {
//         console.error('Error creating admin:', error);
//         throw error;
//     }
// };

export const verifyAdminPassword = async (username, password) => {
    try {
        const query = 'SELECT password FROM admins WHERE username = $1';
        const values = [username];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return false;
        }
        const hashedPassword = result.rows[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error verifying admin password:', error);
        throw error;
    }
};