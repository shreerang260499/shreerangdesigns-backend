const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testImageUpload() {
  try {
    // Create test image
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a simple test product data
    const formData = new FormData();
    formData.append('name', 'Test Product');
    formData.append('description', 'Test product description');
    formData.append('price', '999');
    formData.append('category', 'modern');
    formData.append('productType', 'cnc');
    formData.append('downloadFormat', 'DXF, DWG');
    formData.append('dimensions', '2100mm x 900mm');
    formData.append('image', fs.createReadStream(testImagePath));

    // Send request
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE'
      }
    });

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testImageUpload();
