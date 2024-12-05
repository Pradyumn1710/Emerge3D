const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware to parse JSON data
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large images

// Endpoint to receive and store the image
app.post('/images', (req, res) => {
  const { image } = req.body; // Expecting 'image' in Base64 format

  if (!image) {
    return res.status(400).json({ error: 'Image data is required' });
  }

  // Decode Base64 string to binary data
  const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
  const fileName = `image_${Date.now()}.jpg`; // Unique file name
  const filePath = path.join(__dirname, 'uploads', fileName); // Save in 'uploads' directory

  // Save the file to the directory
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving the image:', err);
      return res.status(500).json({ error: 'Failed to save the image' });
    }

    console.log(`Image saved at: ${filePath}`);
    res.status(200).json({ message: 'Image saved successfully', filePath });
  });
});

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
