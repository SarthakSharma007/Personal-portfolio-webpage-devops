const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM projects ORDER BY featured DESC, created_at DESC'
    );
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// GET /api/projects/:id - Get single project
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
    
    const [result] = await promisePool.execute(
      'INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, tech_stack, github_link || null, demo_link || null, image_url || null, featured || false]
    );
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { id: result.insertId, ...req.body }
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
    
    const [result] = await promisePool.execute(
      'UPDATE projects SET title = ?, description = ?, tech_stack = ?, github_link = ?, demo_link = ?, image_url = ?, featured = ? WHERE id = ?',
      [title, description, tech_stack, github_link, demo_link, image_url, featured, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project updated successfully'
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
      message: 'Project deleted successfully'
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
