import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8000",
  // axios.defaults.withCredentials = true;
  withCredentials: true,

  // axios.defaults.withXSRFToken = true;
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
