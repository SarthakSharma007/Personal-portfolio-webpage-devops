const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all certifications
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM certifications');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching certifications:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch certifications' });
  }
});

module.exports = router;