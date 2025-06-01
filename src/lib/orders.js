import { apiRequest } from '@/lib/api';

export const fetchAllOrders = async (token) => {
  return apiRequest(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, 'GET', null, token);
};
