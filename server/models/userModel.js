import bcrypt from 'bcrypt';
import db from '../config/db.js';
const saltRounds = 10;


class User {
    constructor(firstName, lastName, email, password, userName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.id = 0;
    }

    async save() {
        try {
            const hash = await this.hashPassword(this.password);
            const query = `
                INSERT INTO users (fname, lname, email, password, user_name)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            const values = [
                this.firstName,
                this.lastName,
                this.email,
                hash,
                this.userName
            ];

            const result = await db.query(query, values);
            this.id = result.rows[0].id;
            return result.rows[0].id;
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, saltRounds);
    }
}


// const generateToken = (user) => {
//     return jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//     );
// };


export default User