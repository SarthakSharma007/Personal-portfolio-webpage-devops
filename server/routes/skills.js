const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET all skills
router.get('/', async (req, res) => {
    try {
        // THE FIX: Changed from db.promise().query() to db.execute()
        const [rows] = await db.execute('SELECT * FROM skills');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching skills:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// (The rest of your file is protected by auth, so it's correct)
// POST a new skill
router.post('/', auth, async (req, res) => {
    const { name, level, category } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO skills (name, level, category) VALUES (?, ?, ?)',
            [name, level, category]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ... (PUT and DELETE routes)
module.exports = router;