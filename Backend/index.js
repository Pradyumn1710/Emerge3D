const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 4000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON data
app.use(bodyParser.json({ limit: "10mb" }));

// Endpoint to handle image upload
app.post("/images", async (req, res) => {
  try {
    const base64Image = req.body.image.split(";base64,").pop();

    const dir = path.join(__dirname, "images");
    const filename = `image-${Date.now()}.jpeg`;
    const filepath = path.join(dir, filename);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // Write the image file
    fs.writeFileSync(filepath, base64Image, { encoding: "base64" });

    res.status(200).json({ message: `Image saved as ${filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save image" });
  }
});

// Serve static files from the "images" directory
app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});