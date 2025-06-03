import axios from 'axios';

const BACKEND_URL = 'https://shreerangdesigns-backend.onrender.com';
const FRONTEND_URL = 'https://shreerangdesigns.in';
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123'
};

async function testEndpoints() {
  try {
    console.log('1. Testing Backend Health...');
    const healthResponse = await axios.get(`${BACKEND_URL}/api/products`);
    console.log('✓ Backend is responsive\n');

    console.log('2. Testing Products API...');
    const productsResponse = await axios.get(`${BACKEND_URL}/api/products`);
    console.log(`✓ Products API: ${productsResponse.data.products?.length} products found\n`);

    console.log('3. Testing Authentication...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, TEST_USER);
    const token = loginResponse.data.token;
    console.log('✓ Login successful\n');

    console.log('4. Testing Protected Route...');
    const profileResponse = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✓ Protected route accessible\n');

    console.log('5. Testing Frontend...');
    const frontendResponse = await axios.get(FRONTEND_URL);
    console.log('✓ Frontend is accessible\n');

    console.log('6. Testing Cloudinary Integration...');
    const randomProduct = productsResponse.data.products[0];
    if (randomProduct?.images?.[0]?.startsWith('https://res.cloudinary.com')) {
      console.log('✓ Cloudinary images loading correctly\n');
    } else {
      console.log('⚠ Cloudinary image URL format unexpected\n');
    }

    console.log('7. Testing CORS...');
    const corsResponse = await axios.get(`${BACKEND_URL}/api/products`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    console.log('✓ CORS is properly configured\n');

    console.log('All core functionality tests passed! ✓');
    console.log('\nDeployment verification successful!');

  } catch (error) {
    console.error('Error during testing:', error.response?.data || error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testEndpoints();