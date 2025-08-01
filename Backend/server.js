const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Read JSON file and send it as response
app.get('/api/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send({ error: 'Failed to read file' });
    } else {
      res.send(JSON.parse(data));
    }
  });
});

// Run server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
