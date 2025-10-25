const mysql = require('mysql2/promise'); // Import the 'promise' version
const dotenv = require('dotenv');

dotenv.config();

// Use 'createPool' for modern async/await
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await pool.execute('SELECT 1');
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

testConnection();

// Export the pool
module.exports = pool;