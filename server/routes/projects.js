const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

const parseProject = (row) => {
  try { row.tech_stack_json = row.tech_stack_json ? JSON.parse(row.tech_stack_json) : []; } catch { row.tech_stack_json = []; }
  try { row.timeline_json  = row.timeline_json  ? JSON.parse(row.timeline_json)  : []; } catch { row.timeline_json  = []; }
  try { row.learnings_json = row.learnings_json ? JSON.parse(row.learnings_json) : []; } catch { row.learnings_json = []; }
  return row;
};

// GET /api/projects — public featured projects
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM projects WHERE featured = 1 ORDER BY created_at ASC');
    res.json({ success: true, data: rows.map(parseProject), count: rows.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects', error: error.message });
  }
});

// GET /api/projects/slug/:slug — detail page by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM projects WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: parseProject(rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project', error: error.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: parseProject(rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project', error: error.message });
  }
});

module.exports = router;