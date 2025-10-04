const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/certifications - Get all certifications
router.get('/', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM certifications ORDER BY issue_date DESC'
    );
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certifications',
      error: error.message
    });
  }
});

// GET /api/certifications/:id - Get single certification
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await promisePool.execute(
      'SELECT * FROM certifications WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certification',
      error: error.message
    });
  }
});

// POST /api/certifications - Create new certification (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { 
      cert_name, 
      issuing_organization, 
      issue_date, 
      expiry_date, 
      credential_id, 
      credential_url, 
      image_url 
    } = req.body;
    
    if (!cert_name || !issuing_organization) {
      return res.status(400).json({
        success: false,
        message: 'Certification name and issuing organization are required'
      });
    }
    
    const [result] = await promisePool.execute(
      'INSERT INTO certifications (cert_name, issuing_organization, issue_date, expiry_date, credential_id, credential_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cert_name, issuing_organization, issue_date || null, expiry_date || null, credential_id || null, credential_url || null, image_url || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Certification created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error creating certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create certification',
      error: error.message
    });
  }
});

// PUT /api/certifications/:id - Update certification (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      cert_name, 
      issuing_organization, 
      issue_date, 
      expiry_date, 
      credential_id, 
      credential_url, 
      image_url 
    } = req.body;
    
    const [result] = await promisePool.execute(
      'UPDATE certifications SET cert_name = ?, issuing_organization = ?, issue_date = ?, expiry_date = ?, credential_id = ?, credential_url = ?, image_url = ? WHERE id = ?',
      [cert_name, issuing_organization, issue_date, expiry_date, credential_id, credential_url, image_url, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Certification updated successfully'
    });
  } catch (error) {
    console.error('Error updating certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update certification',
      error: error.message
    });
  }
});

// DELETE /api/certifications/:id - Delete certification (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await promisePool.execute(
      'DELETE FROM certifications WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete certification',
      error: error.message
    });
  }
});

module.exports = router;
