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
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
