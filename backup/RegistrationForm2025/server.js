// Import required modules
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());

// Serve static files (HTML, CSS, JS) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to 'uploads/' folder
  },
  filename: function (req, file, cb) {
    // Save file with original name and timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Path to data file
const DATA_FILE = path.join(__dirname, 'data.json');

// Helper: Read registrations from file
function readRegistrations() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

// Helper: Write registrations to file
function writeRegistrations(registrations) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(registrations, null, 2));
}

// Handle registration form submission
app.post('/register', upload.single('payment'), (req, res) => {
  // Get form fields
  const { name, email, event } = req.body;
  // Get uploaded file info
  const paymentScreenshot = req.file ? req.file.filename : null;

  // Basic validation
  if (!name || !email || !event || !paymentScreenshot) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  // Create registration object
  const registration = {
    name,
    email,
    event,
    paymentScreenshot,
    timestamp: new Date().toISOString()
  };

  // Read existing registrations, add new one, and save
  const registrations = readRegistrations();
  registrations.push(registration);
  writeRegistrations(registrations);

  // Respond with success
  res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
