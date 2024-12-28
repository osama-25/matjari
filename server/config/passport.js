import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from './db.js';

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        if (user.banned) {
            // return done(null, false, { message: 'User is banned.' });
            return done(null, false, { message: 'You have been banned from the Mickey Mouse Club for inappropriate behavior.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
});

export default passport;