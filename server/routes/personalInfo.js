const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/personal-info - Get personal information
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM personal_info LIMIT 1'
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personal information not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching personal info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personal information',
      error: error.message
    });
  }
});

// PUT /api/personal-info - Update personal information (Admin only)
router.put('/', auth, async (req, res) => {
  try {
    const { 
      full_name, 
      title, 
      email, 
      phone, 
      location, 
      bio, 
      github_url, 
      linkedin_url, 
      resume_url, 
      profile_image 
    } = req.body;
    
    const [result] = await promisePool.execute(
      'UPDATE personal_info SET full_name = ?, title = ?, email = ?, phone = ?, location = ?, bio = ?, github_url = ?, linkedin_url = ?, resume_url = ?, profile_image = ? WHERE id = 1',
      [full_name, title, email, phone, location, bio, github_url, linkedin_url, resume_url, profile_image]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personal information not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Personal information updated successfully'
    });
  } catch (error) {
    console.error('Error updating personal info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update personal information',
      error: error.message
    });
  }
});

module.exports = router;
