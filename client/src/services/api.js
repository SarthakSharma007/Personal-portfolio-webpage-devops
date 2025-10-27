const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/projects - Get all FEATURED projects (for public portfolio)
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM projects WHERE featured = 1 ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured projects',
      error: error.message
    });
  }
});

// --- NEW ROUTE ---
// GET /api/projects/all-admin - Get ALL projects (for admin panel)
router.get('/all-admin', auth, async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM projects ORDER BY created_at DESC' // No featured filter
    );
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching all projects for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all projects',
      error: error.message
    });
  }
});
// --- END NEW ROUTE ---


// GET /api/projects/:id - Get single project (accessible to both public and admin)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await promisePool.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
});

// POST /api/projects - Create new project (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, tech_stack, github_link, demo_link, image_url, featured } = req.body;

    if (!title || !description || !tech_stack) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and tech_stack are required'
      });
    }

    // Ensure featured is boolean or defaults to false
    const isFeatured = typeof featured === 'boolean' ? featured : false;

    const [result] = await promisePool.execute(
      'INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, tech_stack, github_link || null, demo_link || null, image_url || null, isFeatured]
    );

    // Return the newly created project data including the ID
    const [newProjectRows] = await promisePool.execute('SELECT * FROM projects WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProjectRows[0] // Send back the complete new project object
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});


// PUT /api/projects/:id - Update project (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech_stack, github_link, demo_link, image_url, featured } = req.body;

    // Ensure featured is boolean or defaults to false
    const isFeatured = typeof featured === 'boolean' ? featured : false;

    const [result] = await promisePool.execute(
      'UPDATE projects SET title = ?, description = ?, tech_stack = ?, github_link = ?, demo_link = ?, image_url = ?, featured = ? WHERE id = ?',
      [title, description, tech_stack, github_link || null, demo_link || null, image_url || null, isFeatured, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Fetch the updated project data to send back
    const [updatedProjectRows] = await promisePool.execute('SELECT * FROM projects WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProjectRows[0] // Send back the complete updated project object
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});


// DELETE /api/projects/:id - Delete project (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM projects WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
      deletedId: id // Optionally send back the ID of the deleted item
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

module.exports = router;

