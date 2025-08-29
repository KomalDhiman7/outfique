import axios from "axios";
const API_URL = "http://localhost:5000";

// Fetch all posts
export const fetchPosts = async (token) => {
  return axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Create post
export const createPost = async (data, token) => {
  return axios.post(`${API_URL}/posts`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Get single post
export const getPostById = async (postId, token) => {
  return axios.get(`${API_URL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
