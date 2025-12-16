const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

// ---------------------------
// ✅ GET all skill categories
// ---------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT id, category_id, label, gradient, glow, textColor, span FROM skill_categories ORDER BY id ASC'
    );
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('Error fetching skill categories:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
