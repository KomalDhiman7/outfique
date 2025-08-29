import axios from "axios";

const API_URL = "http://localhost:5000"; // change when deploying

// Signup
export const signup = async (email, password) => {
  return axios.post(`${API_URL}/auth/signup`, { email, password });
};

// Login
export const login = async (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

// Get current user (protected route)
export const getCurrentUser = async (token) => {
  return axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
