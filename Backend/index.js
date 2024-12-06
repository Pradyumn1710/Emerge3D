const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Endpoint to process and save the image
app.post("/images", (req, res) => {
  try {
    const { image, filename } = req.body; // Get both image and filename from the request

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const base64Image = image.split(";base64,").pop();
    const filepath = path.join(__dirname, "images", filename); // Use the provided filename

    // Ensure the images directory exists
    if (!fs.existsSync(path.join(__dirname, "images"))) {
      fs.mkdirSync(path.join(__dirname, "images"));
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
  console.log(`Server is running on http://localhost:${port}`);
});
