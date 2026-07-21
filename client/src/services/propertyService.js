import API from './api';

// Fetch all properties with optional filter params
export const getProperties = async (filters = {}) => {
  const response = await API.get('/properties', { params: filters });
  return response.data;
};

// Create property listing (Handles File Uploads via FormData)
export const createProperty = async (propertyData) => {
  const response = await API.post('/properties', propertyData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Crucial for image uploads
    },
  });
  return response.data;
};