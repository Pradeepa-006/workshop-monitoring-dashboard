// const cors = require("cors");
// const path = require("path");

// app.use(cors());

// const jsonPath = path.join(__dirname, "data.json");
// let workshopData = [];

// Read JSON data safely
// try {
//   if (fs.existsSync(jsonPath)) {
//     console.log(`📂 Found data.json at ${jsonPath}`);
//     const rawData = fs.readFileSync(jsonPath, "utf-8");
//     workshopData = JSON.parse(rawData);
//     console.log(`✅ Loaded ${workshopData.length} records.`);
//   } else {
//     console.warn("⚠️ data.json file not found. Starting with empty data.");
//   }
// } catch (error) {
//   console.error("❌ Failed to read or parse data.json:", error.message);
// }

// Routes
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;

app.get("/api/data", (req, res) => {
  fs.readFile("data.json", "utf-8", (err, data) => {
    res.send(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(`🚀 Workshop-Watch Backend running on port ${PORT}`);
});

// app.get("/api/data/:machine", (req, res) => {
//   const machine = req.params.machine;
//   const filtered = workshopData.filter((d) => d.machine_type === machine);
//   res.json(filtered);
// });

// app.get("/", (req, res) => {
//   res.send("Workshop-Watch Backend is running!");
// });

// Start server
