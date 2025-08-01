const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static HTML for file upload
app.use(express.static('public'));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('excelFile'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.originalname);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  res.json(data);
});

// Root endpoint: simple upload form
app.get('/', (req, res) => {
  res.send(`
    <h2>Upload Excel File</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="excelFile" />
      <button type="submit">Upload</button>
    </form>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
