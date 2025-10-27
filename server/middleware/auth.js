const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();

// --- NEW DIAGNOSTIC LINE ---
// You should see this message in your server terminal when it restarts.
// Added comment - October 27, 2025
console.log('>>> auth.js (v3) is running. Ready to debug login attempts. <<<');
// --- END DIAGNOSTIC LINE ---


// [LOGIN]
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // --- START NEW DIAGNOSTIC ---
  // We will now log exactly what the server receives and what's in the .env file.
  // The | pipes will show any extra spaces.
  // Added comment - October 27, 2025
  console.log('\n--- LOGIN ATTEMPT RECEIVED ---');
  console.log(`[FROM BROWSER] Email: |${email}|`);
  console.log(`[FROM BROWSER] Pass:  |${password}|`);
  console.log('---------------------------------');
  console.log(`[.ENV FILE]   Email: |${process.env.ADMIN_EMAIL}|`);
  console.log(`[.ENV FILE]   Pass:  |${process.env.ADMIN_PASSWORD}|`);
  console.log('---------------------------------');
  // --- END NEW DIAGNOSTIC ---

  // --- START FIX ---
  // Added fallback check for default admin credentials from .env file
  const defaultAdminEmail = process.env.ADMIN_EMAIL;
  const defaultAdminPassword = process.env.ADMIN_PASSWORD;

  if (email === defaultAdminEmail && password === defaultAdminPassword) {
    console.log('>>> SUCCESS: .env credentials matched.');
    // Generate a token for the default admin
    const token = jwt.sign(
      { id: 'default-admin', role: 'admin' }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    // Successfully logged in as default admin
    return res.json({ success: true, token });
  }
  // --- END FIX ---


  try {
    // If default admin login failed, proceed to check the database
    console.log('>>> INFO: .env credentials did not match. Checking database...');
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      // User not found in DB, and didn't match default admin
      console.log(`>>> DB_CHECK: User not found for email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // User found in DB, check their hashed password
    console.log(`>>> DB_CHECK: User found. Comparing password for ${email}...`);
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      // Password doesn't match DB hash
      console.log('>>> DB_CHECK: Password does not match.');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Password IS a match for the DB user, generate token
    console.log('>>> DB_CHECK: Password matched. Logging in.');
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.json({ success: true, token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

