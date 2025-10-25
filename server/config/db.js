const mysql = require('mysql2/promise'); // 1. Import 'mysql2/promise'
const dotenv = require('dotenv');

dotenv.config();

// 2. Use 'createPool' instead of 'createConnection'
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// 3. (Optional but good) Add a function to test the connection
const testConnection = async () => {
  try {
    await pool.execute('SELECT 1');
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

// 4. Call the test function
testConnection();

// 5. Export the pool. The pool object HAS the .execute() method.
module.exports = pool;