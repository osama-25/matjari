import pg from 'pg';
import env from 'dotenv';

env.config(); // Load environment variables from .env file

const { Pool } = pg;

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: 'postgresql://postgres.jkdfxmtesleasbpagpyp:@Ff12345_12345@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false, // Supabase often requires this setting for SSL
  }
});

// Query function with error handling
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', err.message);
    throw new Error('Database query failed'); // Throw the error again if needed
  }
};

// Optionally, handle pool connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
  process.exit(-1); // Exit the process if there's a serious connection error
});

export default { query };
