// import pg from 'pg';
// import env from 'dotenv';

// env.config();

// const db = new pg.Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
// });

// db.connect()
//     .then(() => console.log('Connected to the database'))
//     .catch(err => console.error('Database connection error:', err));

// export default db;
import pg from 'pg';
import env from 'dotenv';

env.config(); // Load environment variables from .env file

const { Pool } = pg;

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.jkdfxmtesleasbpagpyp:@Ff12345_12345@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false, // Supabase often requires this setting for SSL
  }
});

// Export query function for database interactions
const query = (text, params) => pool.query(text, params);

export default { query };
