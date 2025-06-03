const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const testAuthFlow = async () => {
  try {
    // 1. Register a test user
    console.log('Creating test user...');
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
        mobile: '1234567890'
      });
      console.log('Test user created successfully');
    } catch (error) {
      if (error.response?.data?.message === 'User already exists') {
        console.log('Test user already exists, proceeding with login');
      } else {
        throw error;
      }
    }

    // 2. Try to login
    console.log('\nTesting login...');
    const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'test@example.com',
      password: 'testpassword123'
    });
      const token = loginResponse.data.token;
    console.log('Login successful, received token:', token.substring(0, 20) + '...');
    
    // 2. Test protected route with the token
    console.log('\nTesting protected route...');
    const protectedResponse = await axios.get('http://localhost:8080/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Verify the token by decoding it
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('\nToken verification successful');
    console.log('Token payload:', JSON.stringify(decodedToken, null, 2));
    
    console.log('Protected route access successful');
    console.log('User data:', protectedResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Run the test
testAuthFlow();
