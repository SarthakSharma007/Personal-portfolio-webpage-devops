const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET all certifications
router.get('/', async (req, res) => {
    try {
        // THE FIX: Changed from db.promise().query() to db.execute()
        const [rows] = await db.execute('SELECT * FROM certifications');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching certifications:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// (The rest of your file is protected by auth, so it's correct)
// POST a new certification
router.post('/', auth, async (req, res) => {
    const { name, issuing_organization, issue_date, credential_id } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO certifications (name, issuing_organization, issue_date, credential_id) VALUES (?, ?, ?, ?)',
            [name, issuing_organization, issue_date, credential_id]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ... (PUT and DELETE routes)
module.exports = router;