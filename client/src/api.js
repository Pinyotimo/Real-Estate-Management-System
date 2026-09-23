import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Inject current JWT token into headers for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired or unauthorized tokens without breaking form error states
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token only if authentication failed, then let the component handle the error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default API;