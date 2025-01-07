import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from './db.js';
import GoogleStrategy from 'passport-google-oauth2';
import { createUser } from '../models/userModel.js';
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

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.Backend_URL}/auth/google`,
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
            scope: ['profile', 'email'] // إضافة النطاقات المطلوبة هنا

        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const photo = profile.photos[0].value;
                const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

                if (result.rowCount > 0) {
                    // User exists, log them in
                    return done(null, result.rows[0]);
                } else {
                    // User does not exist, create a new user
                    const newUser = {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: email,
                        password: "google", // No password for Google-authenticated users
                        userName: profile.displayName,
                        photo: photo
                    };
                    const user = await createUser(newUser);
                    return done(null, user);
                }
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

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