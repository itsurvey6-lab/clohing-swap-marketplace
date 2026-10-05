import axios from "axios";

const api = axios.create({
  // Use the deployed backend when VITE_API_URL is set.
  // Otherwise, use the local backend during development.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;