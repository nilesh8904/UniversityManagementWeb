// Backend API Configuration
// Change this to your Render backend URL after deployment
export const API_URL = 'https://university-backend-o33j.onrender.com/api';

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
