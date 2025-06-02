// Utility for API calls with JWT support
export const apiRequest = async (url, method = 'GET', data = null, token = null, isFormData = false) => {
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = {
    method,
    headers,
    body: isFormData ? data : (data ? JSON.stringify(data) : undefined)
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API Error');
  }
  return response.json();
};
