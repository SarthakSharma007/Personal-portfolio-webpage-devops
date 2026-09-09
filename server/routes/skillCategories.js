const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// ---------------------------
// GET all skill categories
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

// ---------------------------
// POST a new skill category (protected)
// ---------------------------
router.post('/', auth, async (req, res) => {
  const { category_id, label, gradient, glow, textColor, span } = req.body;
  if (!label) {
    return res.status(400).json({ success: false, error: 'Label is required' });
  }
  try {
    const [result] = await promisePool.execute(
      'INSERT INTO skill_categories (category_id, label, gradient, glow, textColor, span) VALUES (?, ?, ?, ?, ?, ?)',
      [category_id || null, label, gradient || null, glow || null, textColor || null, span || 'half']
    );
    res.status(201).json({
      success: true,
      data: { id: result.insertId, category_id, label, gradient, glow, textColor, span: span || 'half' }
    });
  } catch (err) {
    console.error('Error creating skill category:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---------------------------
// PUT (update) a skill category (protected)
// ---------------------------
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { category_id, label, gradient, glow, textColor, span } = req.body;
  if (!label) {
    return res.status(400).json({ success: false, error: 'Label is required' });
  }
  try {
    const [result] = await promisePool.execute(
      'UPDATE skill_categories SET category_id=?, label=?, gradient=?, glow=?, textColor=?, span=? WHERE id=?',
      [category_id || null, label, gradient || null, glow || null, textColor || null, span || 'half', id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Skill category not found' });
    }
    res.json({ success: true, data: { id, category_id, label, gradient, glow, textColor, span: span || 'half' } });
  } catch (err) {
    console.error('Error updating skill category:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ---------------------------
// DELETE a skill category (protected)
// ---------------------------
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.execute('DELETE FROM skill_categories WHERE id=?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Skill category not found' });
    }
    res.json({ success: true, message: 'Skill category deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill category:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
