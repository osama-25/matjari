// import bcrypt from 'bcrypt';
// import db from '../config/db.js';
// // const saltRounds = 10;


// class User {
//     constructor(firstName, lastName, email, password, userName) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.email = email;
//         this.password = password;
//         this.userName = userName;
//         this.id = 0;
//     }

//     async save() {
//         try {
//             const hash = await this.hashPassword(this.password);
//             const query = `
//                 INSERT INTO users (fname, lname, email, password, user_name)
//                 VALUES ($1, $2, $3, $4, $5)
//                 RETURNING id;
//             `;
//             const values = [
//                 this.firstName,
//                 this.lastName,
//                 this.email,
//                 hash,
//                 this.userName
//             ];

//             const result = await db.query(query, values);
//             this.id = result.rows[0].id;
//             return result.rows[0].id;
//         } catch (error) {
//             console.error('Error saving user:', error);
//             throw error;
//         }
//     }

//     async hashPassword(password) {
//         const saltRounds = parseInt(process.env.SALTROUNDS);
//         return await bcrypt.hash(password, saltRounds);
//     }
// }





// export default User

// models/userModel.js
import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const createUser = async ({ firstName, lastName, email, password, userName }) => {
    try {
        const hash = await hashPassword(password);
        const query = `
            INSERT INTO users (fname, lname, email, password, user_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const values = [firstName, lastName, email, hash, userName];
        const result = await db.query(query, values);
        return result.rows[0].id;
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
