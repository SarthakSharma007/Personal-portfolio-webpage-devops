const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/skills - Get all skills
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM skills ORDER BY category, proficiency_level DESC, skill_name ASC'
    );
    
    // Group skills by category
    const skills = {
      primary: rows.filter(skill => skill.category === 'Primary'),
      other: rows.filter(skill => skill.category === 'Other')
    };
    
    res.json({
      success: true,
      data: skills,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
      error: error.message
    });
  }
});

// GET /api/skills/:id - Get single skill
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await promisePool.execute(
      'SELECT * FROM skills WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill',
      error: error.message
    });
  }
});

// POST /api/skills - Create new skill (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { skill_name, proficiency_level, category, icon } = req.body;
    
    if (!skill_name) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }
    
    const [result] = await promisePool.execute(
      'INSERT INTO skills (skill_name, proficiency_level, category, icon) VALUES (?, ?, ?, ?)',
      [skill_name, proficiency_level || 'Intermediate', category || 'Other', icon || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create skill',
      error: error.message
    });
  }
});

// PUT /api/skills/:id - Update skill (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { skill_name, proficiency_level, category, icon } = req.body;
    
    const [result] = await promisePool.execute(
      'UPDATE skills SET skill_name = ?, proficiency_level = ?, category = ?, icon = ? WHERE id = ?',
      [skill_name, proficiency_level, category, icon, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Skill updated successfully'
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skill',
      error: error.message
    });
  }
});

// DELETE /api/skills/:id - Delete skill (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await promisePool.execute(
      'DELETE FROM skills WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete skill',
      error: error.message
    });
  }
});

module.exports = router;
