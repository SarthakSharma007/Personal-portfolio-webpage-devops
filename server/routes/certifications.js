const express = require('express');
const router = express.Router();
// THE FIX: Import promisePool directly, not the entire db object
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// GET all certifications
router.get('/', async (req, res) => {
    try {
        // THE FIX: Use promisePool.execute instead of db.execute
        const [rows] = await promisePool.execute('SELECT * FROM certifications ORDER BY issue_date DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error('Error fetching certifications:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch certifications',
            error: err.message 
        });
    }
});

// POST a new certification
router.post('/', auth, async (req, res) => {
    const { name, issuing_organization, issue_date, credential_id } = req.body;
    try {
        // THE FIX: Use promisePool.execute instead of db.execute
        const [result] = await promisePool.execute(
            'INSERT INTO certifications (name, issuing_organization, issue_date, credential_id) VALUES (?, ?, ?, ?)',
            [name, issuing_organization, issue_date, credential_id]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ... (PUT and DELETE routes should also be updated to use promisePool)
module.exports = router;