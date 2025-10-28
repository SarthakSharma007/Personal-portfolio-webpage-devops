const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// --- Multer Setup for File Uploads ---
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Correctly resolve the path to 'client/public/uploads'
    // This assumes the server is running from the 'server' directory
    const uploadPath = path.join(__dirname, '..', '..', 'client', 'public', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Allow only images
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    }
});
// --- End Multer Setup ---


// GET /api/personal-info - Fetch personal information
// FIX: Removed async and replaced db.execute with db.query callback
router.get('/', (req, res) => {
  try {
    // Assuming there is only one row (or you want the first) with id = 1
    db.query('SELECT * FROM personal_info WHERE id = 1', (err, rows) => {
      if (err) {
        console.error('Error fetching personal info:', err);
        return res.status(500).json({ success: false, message: 'Server Error' });
      }
      if (rows.length > 0) {
        res.json({ success: true, data: rows[0] });
      } else {
        res.status(404).json({ success: false, message: 'Personal info not found' });
      }
    });
  } catch (err) {
    // Catch synchronous errors, if any
    console.error('Error in GET /personal-info route:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PUT /api/personal-info - Update personal information
// Use multer to handle multipart/form-data, expecting a single file named 'profile_image'
// FIX: Removed async and replaced db.execute with db.query callbacks
router.put('/', auth, upload.single('profile_image'), (req, res) => {
  // We remove the top-level try...catch as errors will be handled in the callbacks
  const {
    full_name, title, email, phone, location,
    bio, github_url, linkedin_url, resume_url
  } = req.body;

  // --- FIX: Helper to clean incoming form data ---
  // Converts "null", "undefined", or actual undefined to JS null for the database
  const cleanValue = (val) => (val === 'null' || val === 'undefined' || val === undefined) ? null : val;

  // Build array of values for the SQL query
  const updateFields = [
    cleanValue(full_name),
    cleanValue(title),
    cleanValue(bio),
    cleanValue(email),
    cleanValue(phone),
    cleanValue(location),
    cleanValue(github_url),
    cleanValue(linkedin_url),
    cleanValue(resume_url)
  ];

  // Start building the SQL query
  let sql = `
    UPDATE personal_info SET
      full_name = ?,
      title = ?,
      bio = ?,
      email = ?,
      phone = ?,
      location = ?,
      github_url = ?,
      linkedin_url = ?,
      resume_url = ?
  `;

  // --- FIX: Only add profile_image to the SQL query if a new file was uploaded ---
  if (req.file) {
    // Get the web-accessible path for the new image
    const profileImagePath = '/uploads/' + req.file.filename;
    sql += `, profile_image = ?`; // Add to SQL query
    updateFields.push(profileImagePath); // Add to values array
  }

  // Add the WHERE clause to complete the query
  sql += ` WHERE id = 1`;

  // --- First query: UPDATE the database ---
  db.query(sql, updateFields, (err, result) => {
    if (err) {
      console.error('Error updating personal info:', err);
      // Send back the specific error message
      return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }

    if (result.affectedRows > 0) {
      // --- Second query: SELECT the updated row ---
      // We nest this query to run it only after the update is successful
      db.query('SELECT * FROM personal_info WHERE id = 1', (errSelect, rows) => {
        if (errSelect) {
          console.error('Error fetching updated info:', errSelect);
          // Still a success, but we couldn't return the new data
          return res.status(200).json({ success: true, message: 'Personal info updated, but failed to fetch new data.' });
        }
        // Successfully updated and fetched new data
        res.json({ success: true, message: 'Personal info updated', data: rows[0] });
      });
    } else {
      res.status(404).json({ success: false, message: 'Personal info not found to update' });
    }
  });
});

module.exports = router;

