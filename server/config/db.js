const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Create MySQL connection pool
const promisePool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// ✅ Optional function to test DB connection
const testConnection = async () => {
  try {
    await promisePool.execute('SELECT 1');
    console.log('✅ Successfully connected to the database.');
  } catch (error) {
    console.error('❌ Error connecting to the database:', error.message);
    process.exit(1);
  }
};

// ✅ Export the pool and testConnection function
module.exports = { promisePool, testConnection };
