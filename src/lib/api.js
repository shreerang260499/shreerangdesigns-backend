// Utility for API calls with JWT support
export const apiRequest = async (url, method = 'GET', data = null, token = null, isFormData = false) => {
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const options = {
      method,
      headers,
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      signal: controller.signal,
      // Add credentials for CORS
      credentials: 'include',
      mode: 'cors'
    };

    console.log('API Request:', { url, method, headers: { ...headers, Authorization: token ? 'Bearer [HIDDEN]' : undefined } });
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('API Response:', { url, status: response.status, dataLength: Array.isArray(result) ? result.length : 'N/A' });
    return result;
  } catch (error) {
    console.error('API Request failed:', { url, method, error: error.message });
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
