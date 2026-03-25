// Backend API Configuration
// Using Render backend URL for production
export const API_URL = process.env.REACT_APP_API_URL || 'https://university-management-k0ri.onrender.com';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function for file upload headers
export const getFileUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API request helper
export const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body?: any
) => {
  const url = `${API_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: getAuthHeaders(),
    credentials: 'include', // Include cookies for CORS requests
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        message: data.message,
        endpoint: endpoint,
      });
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Request failed:', {
      endpoint: endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiUrl: API_URL,
    });
    throw error;
  }
};
