const axios = require('axios');

const phonepeConfig = {
  baseUrl: process.env.PHONEPE_BASE_URL,
  merchantId: process.env.PHONEPE_MERCHANT_ID,
  secretKey: process.env.PHONEPE_SECRET_KEY,
};

const createOrder = async (orderPayload) => {
  try {
    const response = await axios.post(`${phonepeConfig.baseUrl}/v1/order/create`, orderPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-ID': phonepeConfig.merchantId,
        'X-Secret-Key': phonepeConfig.secretKey,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`PhonePe order creation failed: ${error.message}`);
  }
};

const verifyPayment = async (paymentPayload) => {
  try {
    const response = await axios.post(`${phonepeConfig.baseUrl}/v1/payment/verify`, paymentPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-ID': phonepeConfig.merchantId,
        'X-Secret-Key': phonepeConfig.secretKey,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`PhonePe payment verification failed: ${error.message}`);
  }
};

module.exports = { createOrder, verifyPayment };
