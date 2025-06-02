# Cloudinary Integration Documentation

## Overview
This document outlines the integration of Cloudinary for image uploads in the backend, replacing local storage.

## Environment Variables
Ensure the following variables are set in the `.env` file:

```
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

## Configuration
The Cloudinary configuration is located in `backend/config/cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

## Middleware
The `upload.js` middleware uses `multer-storage-cloudinary` for handling image uploads:

```javascript
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

module.exports = upload;
```

## Routes
### Product Routes
The `routes/products.js` file handles image uploads and saves the Cloudinary URL:

```javascript
if (req.file) {
  productData.imageUrl = req.file.path; // Cloudinary URL
}
```

## Testing
Use the `test-upload.js` script to test the integration:

```bash
node backend/test/test-upload.js
```

## Migration
Run the `migrateImagesToCloudinary.js` script to migrate existing images:

```bash
node backend/scripts/migrateImagesToCloudinary.js
```

## Error Handling
Ensure proper error handling for failed uploads in `upload.js`.

## Enhancements
- Support for multiple images per product.
- Improved error handling and logging.

## References
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Storage Cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
