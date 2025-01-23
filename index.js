const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3010;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Sample student data
const students = Array.from({ length: 100 }, (_, i) => ({
  name: `Student${i + 1}`,
  total: (i * 10) % 501
}));

// Endpoint to retrieve students above a threshold
app.post('/students/above-threshold', (req, res) => {
  const { threshold } = req.body;

  // Validate input
  if (threshold === undefined || typeof threshold !== 'number' || threshold < 0) {
    return res.status(400).json({ error: "'threshold' must be a positive number." });
  }

  // Filter students based on the threshold
  const filteredStudents = students.filter(student => student.total > threshold);

  // Prepare response
  res.json({
    count: filteredStudents.length,
    students: filteredStudents
  });
});

// Serve static files
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.send("Server is running!");
});


// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
