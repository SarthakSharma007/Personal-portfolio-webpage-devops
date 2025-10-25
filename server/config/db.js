// STEP 1: Make absolutely sure this line imports 'mysql2/promise'
const mysql = require('mysql2/promise'); 
const dotenv = require('dotenv');

dotenv.config();

// STEP 2: Make absolutely sure this uses 'createPool'
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Keep this if needed for your setup
  }
});

// STEP 3: Optional connection test (uses the pool)
const testConnection = async () => {
  try {
    // Test using the pool's execute method
    await pool.execute('SELECT 1'); 
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    // Exit if connection fails on startup
    process.exit(1); 
  }
};

// Run the test
testConnection();

// STEP 4: Make absolutely sure you export the 'pool' object
module.exports = pool;