import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor attaches Bearer token if user is logged in
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const user = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;