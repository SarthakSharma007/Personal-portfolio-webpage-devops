const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

router.get('/:section', async (req, res) => {
  const { section } = req.params;
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM section_settings WHERE section_name = ?',
      [section]
    );
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Section settings not found' });
    }
  } catch (err) {
    console.error('Error fetching section settings:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
