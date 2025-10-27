// config/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const promisePool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // If you need SSL, set DB_SSL=true in .env and configure correctly
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

const testConnection = async () => {
  try {
    await promisePool.execute('SELECT 1');
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
};

module.exports = { promisePool, testConnection };
