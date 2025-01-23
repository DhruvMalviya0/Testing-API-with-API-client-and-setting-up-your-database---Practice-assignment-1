// Import necessary modules
const express = require('express');
const fs = require('fs');
const { resolve } = require('path');

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware to parse JSON request body
app.use(express.json());

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to the Educational Analytics Platform API');
});

// API: Retrieve Students Above Threshold
app.post('/students/above-threshold', (req, res) => {
  const { threshold } = req.body;

  // Validate input
  if (typeof threshold !== 'number' || threshold < 0) {
    return res.status(400).json({ error: 'Invalid or missing threshold value. It must be a positive number.' });
  }

  // Read student data from a JSON file
  const dataPath = resolve(__dirname, 'data.json'); // Path to your data.json file
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).json({ error: 'Failed to retrieve student data.' });
    }

    try {
      const students = JSON.parse(data); // Parse the JSON data
      const filteredStudents = students.filter(student => student.total > threshold);

      // Respond with filtered students
      res.json({
        count: filteredStudents.length,
        students: filteredStudents.map(student => ({
          name: student.name,
          total: student.total,
        })),
      });
    } catch (parseErr) {
      console.error('Error parsing data.json:', parseErr);
      res.status(500).json({ error: 'Failed to process student data.' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
