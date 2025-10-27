// routes/skills.js
const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// ---------------------------
// ✅ GET all skills
// ---------------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM skills');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------------
// ✅ POST a new skill (protected)
// ---------------------------
router.post('/', auth, async (req, res) => {
  const { name, level, category } = req.body;

  if (!name || !level || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await promisePool.execute(
      'INSERT INTO skills (name, level, category) VALUES (?, ?, ?)',
      [name, level, category]
    );
    res.status(201).json({ id: result.insertId, name, level, category });
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------------
// ✅ PUT (Update a skill)
// ---------------------------
router.put('/:id', auth, async (req, res) => {
  const { name, level, category } = req.body;
  const { id } = req.params;

  try {
    const [result] = await promisePool.execute(
      'UPDATE skills SET name=?, level=?, category=? WHERE id=?',
      [name, level, category, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json({ id, name, level, category });
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------------
// ✅ DELETE a skill
// ---------------------------
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.execute('DELETE FROM skills WHERE id=?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
